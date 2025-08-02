import { Build, Change, SpringApiResponse } from '@/app/types';
import { FaHashtag, FaCodeBranch, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaDownload, FaGithub, FaBoxOpen, FaClipboardCheck } from 'react-icons/fa';
import Link from 'next/link';

type BuildDetailPageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const res = await fetch(`${API_BASE_URL}/api/builds`);
    if (!res.ok) {
        console.error("Failed to fetch builds for static generation, returning empty array.");
        return [];
    }
    const data: SpringApiResponse = await res.json();
    
    return data._embedded.builds.map((build) => ({
      id: build.id.toString(),
    }));
  } catch (error) {
    console.error("Error in generateStaticParams, backend might be down. Returning empty array.", error);
    return [];
  }
}

async function getBuildData(id: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  
  const buildRes = await fetch(`${API_BASE_URL}/api/builds/${id}`, { cache: 'no-store' });
  if (!buildRes.ok) throw new Error(`Failed to fetch build details for build ID #${id}. Status: ${buildRes.status}`);
  const build: Build = await buildRes.json();

  if (!build._links.changes || !build._links.changes.href) {
      return { build, changes: [] };
  }
  
  const changesRes = await fetch(build._links.changes.href, { cache: 'no-store' });
  if (!changesRes.ok) throw new Error('Failed to fetch build changes.');
  const changesData = await changesRes.json();
  const changes: Change[] = changesData._embedded?.changes || [];
  
  return { build, changes };
}

export default async function BuildDetailPage({ params }: BuildDetailPageProps) {
  const { id } = params;

  try {
    const { build, changes } = await getBuildData(id);
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

        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <LinkCard icon={<FaDownload />} title="Install" href={build.installLink} />
          </div>
          <div className="col-md-3">
            <LinkCard icon={<FaGithub />} title="GitHub Action" href={build.githubActionLink} />
          </div>
          <div className="col-md-3">
            <LinkCard icon={<FaBoxOpen />} title="Sonatype Nexus" href={build.sonatypeNexusLink} />
          </div>
          <div className="col-md-3">
            <Link href={`/approval/${id}`} legacyBehavior>
              <a className="text-decoration-none">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="fs-2 me-4 text-primary"><FaClipboardCheck /></div>
                    <div>
                      <h5 className="card-title text-muted">Approval</h5>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header"><h4 className="mb-0">📜 Changes in this Build ({changes.length})</h4></div>
          <ul className="list-group list-group-flush">
            {changes.length > 0 ? (
              changes.map((change) => (
                <li key={change.hash} className="list-group-item d-flex align-items-center">
                  <div className="flex-shrink-0 me-3 text-muted"><FaHashtag /></div>
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-bold">{change.message}</p>
                    <small className="text-muted">by {change.author} &bull; <a href={`https://github.com/example/repo/commit/${change.hash}`} target="_blank" rel="noopener noreferrer">{change.hash.substring(0, 7)}</a></small>
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
    <div className="card h-100">
      <div className="card-body d-flex align-items-center">
        <div className="fs-2 me-4 text-primary">{icon}</div>
        <div>
          <h5 className="card-title text-muted">{title}</h5>
          <p className="card-text fs-5 fw-bold mb-0">{value}</p>
        </div>
      </div>
    </div>
  );
}

function LinkCard({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
      <div className="card h-100">
        <div className="card-body d-flex align-items-center">
          <div className="fs-2 me-4 text-primary">{icon}</div>
          <div>
            <h5 className="card-title text-muted">{title}</h5>
          </div>
        </div>
      </div>
    </a>
  );
}