'use client';

import { useState } from 'react';
import { TeamLeadChange } from '@/app/types';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TeamLeadApprovalFormProps {
  onSubmit: (changes: TeamLeadChange[], approvedBy: string) => void;
  onCancel: () => void;
}

export default function TeamLeadApprovalForm({ onSubmit, onCancel }: TeamLeadApprovalFormProps) {
  const [changes, setChanges] = useState<Partial<TeamLeadChange>[]>([]);
  const [currentChange, setCurrentChange] = useState<Partial<TeamLeadChange>>({});
  const [approvedBy, setApprovedBy] = useState('');

  const handleAddChange = () => {
    if (currentChange.changeDescription) {
      setChanges([...changes, currentChange]);
      setCurrentChange({});
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(changes as TeamLeadChange[], approvedBy);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
        <h5>Add Required Changes</h5>
        <div className="mb-3">
            <label htmlFor="approvedBy" className="form-label">Approver Name</label>
            <input
                id="approvedBy"
                type="text"
                className="form-control"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                required
            />
        </div>
        <hr />
        <h6>Changes Added ({changes.length})</h6>
        <ul className="list-group mb-3">
            {changes.map((change, index) => (
                <li key={index} className="list-group-item">
                    {change.changeDescription} ({change.ticketNumber})
                </li>
            ))}
        </ul>
        
        <div className="border p-3 rounded">
            <h6>New Change</h6>
             <div className="mb-3">
                <label htmlFor="changeDescription" className="form-label">Change Description</label>
                <input id="changeDescription" type="text" className="form-control" value={currentChange.changeDescription || ''} onChange={(e) => setCurrentChange({...currentChange, changeDescription: e.target.value})} />
            </div>
             <div className="mb-3">
                <label htmlFor="ticketNumber" className="form-label">Ticket Number</label>
                <input id="ticketNumber" type="text" className="form-control" value={currentChange.ticketNumber || ''} onChange={(e) => setCurrentChange({...currentChange, ticketNumber: e.target.value})} />
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddChange}>Add Change</button>
        </div>

        <div className="d-flex justify-content-end mt-3">
            <button type="button" className="btn btn-light me-2" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Changes</button>
        </div>
    </form>
  );
}