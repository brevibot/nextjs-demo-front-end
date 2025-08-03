import { Build } from '@/app/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

interface BuildDetailCardProps {
  // Make the build prop optional to prevent runtime errors
  build?: Build | null;
}

// Use the 'build' prop directly without renaming it
export default function BuildDetailCard({ build }: BuildDetailCardProps) {
  // Add a robust check to ensure the build object exists
  if (!build) {
    return (
        <div className="card shadow-sm">
            <div className="card-header fs-5 fw-bold">Build Details</div>
            <div className="card-body">
                <p>Build information is not available.</p>
            </div>
        </div>
    );
  }

  const version = `${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`;
  const timestamp = new Date(build.date).toLocaleString();
  const deploymentDate = build.deploymentDate ? new Date(build.deploymentDate).toLocaleDateString() : 'Not set';

  return (
    <div className="card shadow-sm">
      <div className="card-header fs-5 fw-bold">Build Details</div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <strong>Build ID:</strong>
            <span>{build.id}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Version:</strong>
            <span>{version}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Branch:</strong>
            <span>{build.branch}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Timestamp:</strong>
            <span>{timestamp}</span>
          </li>
           <li className="list-group-item d-flex justify-content-between">
            <strong>Deployment Date:</strong>
            <span>{deploymentDate}</span>
          </li>
        </ul>
        <div className="d-grid gap-2 mt-3">
            <Link href={`/builds/${build.id}`} className="btn btn-outline-primary">
                View Full Details
            </Link>
        </div>
      </div>
    </div>
  );
}