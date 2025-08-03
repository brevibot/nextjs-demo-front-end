'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

interface QAApprovalFormProps {
  onApprove: () => void;
  onDeny: () => void;
}

export default function QAApprovalForm({ onApprove, onDeny }: QAApprovalFormProps) {
  return (
    <div>
      <h4>Quality Assurance Approval</h4>
      <p>
        The QA team verifies the build and its changes. Approve to proceed to the Manager review, or Deny to cancel the approval process.
      </p>
      
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg me-3" onClick={onApprove}>
          Approve Build
        </button>
        <button className="btn btn-danger btn-lg" onClick={onDeny}>
          Deny Build
        </button>
      </div>
    </div>
  );
}