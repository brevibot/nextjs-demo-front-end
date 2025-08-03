'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

interface ManagerApprovalFormProps {
  onApprove: () => void;
  onDeny: () => void;
}

export default function ManagerApprovalForm({ onApprove, onDeny }: ManagerApprovalFormProps) {
  return (
    <div>
      <h4>Manager Approval</h4>
      <p>
        This is the final approval step. Approving this build will mark it as ready for release. Denying will cancel the process.
      </p>
      
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg me-3" onClick={onApprove}>
          Approve for Release
        </button>
        <button className="btn btn-danger btn-lg" onClick={onDeny}>
          Deny Release
        </button>
      </div>
    </div>
  );
}