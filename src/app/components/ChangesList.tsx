import { Change } from '@/app/types';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ChangesListProps {
  changes?: Change[]; // Make prop optional to prevent errors
}

// Default the `changes` prop to an empty array
export default function ChangesList({ changes = [] }: ChangesListProps) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header fs-5 fw-bold">Changes in this Build ({changes.length})</div>
      <ul className="list-group list-group-flush">
        {changes.length > 0 ? (
          changes.map((change, index) => (
            <li key={index} className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">{change.message}</h6>
                <small><code>{change.hash?.substring(0, 7)}</code></small>
              </div>
              <p className="mb-1">
                <small>Authored by: {change.author}</small>
              </p>
            </li>
          ))
        ) : (
          <li className="list-group-item">No changes found for this build.</li>
        )}
      </ul>
    </div>
  );
}