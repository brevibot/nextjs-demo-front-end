import { Build, Change } from '@/app/types';
import { FaHashtag, FaCodeBranch, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// This is a Server Component, so it fetches data directly from the backend.
// The next.config.ts rewrite proxy does not apply here, so we use the full URL.
async function getBuildData(buildNumber: string) {
  const API_BASE_URL = 'http://localhost:8080'; // Point to the Spring Boot backend
  
  // Fetch main build details
  // Note: Spring Data REST uses the entity ID by default, not the buildNumber field.
  // We are assuming the ID and buildNumber are the same for this example.
  const buildRes = await fetch(`${API_BASE_URL}/api/builds/${buildNumber}`, { cache: 'no-store' });
  if (!buildRes.ok) throw new Error(`Failed to fetch build details for build #${buildNumber}. Status: ${buildRes.status}`);
  const build: Build = await buildRes.json();

  // Fetch associated changes using the link provided by the API
  if (!build._links.changes || !build._links.changes.href) {
      // It's possible a build has no changes, so we don't throw an error, just return an empty array.
      return { build, changes: [] };
  }
  
  const changesRes = await fetch(build._links.changes.href, { cache: 'no-store' });
  if (!changesRes.ok) throw new Error('Failed to fetch build changes.');
  const changesData = await changesRes.json();
  const changes: Change[] = changesData._embedded?.changes || [];
  
  return { build, changes };
}


export default async function BuildDetailPage({ params }: { params: { buildNumber: string } }) {
  const { buildNumber } = params; // Destructure here to ensure the value is resolved.

  try {
    const { build, changes } = await getBuildData(buildNumber);
    const isSuccess = build.buildStatus === 'SUCCESS';

    return (
      <main className="container py-5">
        <div className="p-5 mb-4 bg-body-tertiary rounded-3 border">
          <div className="container-fluid py-4">
            <h1 className="display-5 fw-bold">Version {`${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`}</h1>
            <div className={`d-flex align-items-center fs-4 mb-3 ${isSuccess ? 'text-success' : 'text-danger'}`}>
              {isSuccess ? <FaCheckCircle className="me-2" /> : <FaExclamationCircle className="me-2" />}
              {build.buildStatus}
            </div>
            <p className="col-md-8 fs-5 text-muted">Detailed summary for build #{build.buildNumber}.</p>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          <div className="col-md-6"><InfoCard icon={<FaCodeBranch />} title="Branch" value={build.branch} /></div>
          <div className="col-md-6"><InfoCard icon={<FaCalendarAlt />} title="Build Date" value={new Date(build.date).toLocaleString()} /></div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header"><h4 className="mb-0">📜 Changes in this Build ({changes.length})</h4></div>
          <ul className="list-group list-group-flush">
            {changes.length > 0 ? (
              changes.map((change) => (
                <li key={change.hash} className="list-group-item d-flex align-items-center"><div className="flex-shrink-0 me-3 text-muted"><FaHashtag /></div>
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-bold">{change.message}</p>
                    <small className="text-muted">by {change.author} &bull; {change.hash.substring(0, 7)}</small>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">No changes found for this build.</li>
            )}
          </ul>
        </div>
      </main>
    );
  } catch (error: any) {
    return <div className="alert alert-danger text-center m-4">Error loading build details: {error.message}</div>;
  }
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="card h-100"><div className="card-body d-flex align-items-center">
      <div className="fs-2 me-4 text-primary">{icon}</div>
      <div><h5 className="card-title text-muted">{title}</h5>
        <p className="card-text fs-5 fw-bold mb-0">{value}</p>
      </div>
    </div></div>
  );
}