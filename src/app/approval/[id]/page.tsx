"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ApprovalProcessDiagram from '@/app/components/ApprovalProcessDiagram';

export default function ApprovalPage() {
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState<'pending' | 'teamLead' | 'qa' | 'manager' | 'approved'>('teamLead');
  const [changes, setChanges] = useState([{ description: '', ticketNumber: '', reason: 'code fix', impact: '' }]);
  const [qaApproved, setQaApproved] = useState(false);
  const [managerApproved, setManagerApproved] = useState(false);

  const handleAddChange = () => {
    setChanges([...changes, { description: '', ticketNumber: '', reason: 'code fix', impact: '' }]);
  };

  const handleTeamLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend API
    console.log('Team Lead Changes:', changes);
    setCurrentStage('qa');
  };
  
  const handleQaApprove = () => {
    setQaApproved(true);
    // Here you would typically send the data to your backend API
    console.log('QA Approved');
    setCurrentStage('manager');
  };

  const handleManagerApprove = () => {
    setManagerApproved(true);
    // Here you would typically send the data to your backend API
    console.log('Manager Approved');
    setCurrentStage('approved');
  };


  return (
    <main className="container py-5">
      <h1 className="mb-4">Approval for Build #{id}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <ApprovalProcessDiagram currentStage={currentStage} />
        </div>
      </div>

      {currentStage === 'teamLead' && (
        <div className="card">
          <div className="card-header">Team Lead Input</div>
          <div className="card-body">
            <form onSubmit={handleTeamLeadSubmit}>
              {changes.map((change, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Change Description"
                    value={change.description}
                    onChange={(e) => {
                      const newChanges = [...changes];
                      newChanges[index].description = e.target.value;
                      setChanges(newChanges);
                    }}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Ticket Number"
                    value={change.ticketNumber}
                    onChange={(e) => {
                        const newChanges = [...changes];
                        newChanges[index].ticketNumber = e.target.value;
                        setChanges(newChanges);
                    }}
                    required
                  />
                  <select
                    className="form-select mb-2"
                    value={change.reason}
                    onChange={(e) => {
                        const newChanges = [...changes];
                        newChanges[index].reason = e.target.value;
                        setChanges(newChanges);
                    }}
                  >
                    <option value="code fix">Code Fix</option>
                    <option value="new requirement">New Requirement</option>
                    <option value="change in requirement">Change in Requirement</option>
                  </select>
                  <textarea
                    className="form-control"
                    placeholder="Impact Description"
                    value={change.impact}
                    onChange={(e) => {
                        const newChanges = [...changes];
                        newChanges[index].impact = e.target.value;
                        setChanges(newChanges);
                    }}
                    required
                  ></textarea>
                </div>
              ))}
              <button type="button" className="btn btn-secondary me-2" onClick={handleAddChange}>
                Add Change
              </button>
              <button type="submit" className="btn btn-primary">Submit Changes</button>
            </form>
          </div>
        </div>
      )}

      {currentStage === 'qa' && (
        <div className="card">
          <div className="card-header">Quality Assurance Approval</div>
          <div className="card-body">
            <p>Build information and download links would be displayed here.</p>
            <button className="btn btn-success" onClick={handleQaApprove}>Approve</button>
          </div>
        </div>
      )}

      {currentStage === 'manager' && (
        <div className="card">
          <div className="card-header">Manager Approval</div>
          <div className="card-body">
            <p>Release date, build info, download links, and a list of approvers would be displayed here.</p>
            <button className="btn btn-success" onClick={handleManagerApprove}>Approve</button>
          </div>
        </div>
      )}
        
      {currentStage === 'approved' && (
        <div className="alert alert-success">This build has been approved.</div>
      )}
    </main>
  );
}