"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ApprovalProcessDiagram from '@/app/components/ApprovalProcessDiagram';
import BuildDetailCard from '@/app/components/BuildDetailCard';

export default function ApprovalPage() {
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState<'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved'>('deployer');
  const [changes, setChanges] = useState([{ description: '', ticketNumber: '', reason: 'code fix', impact: '' }]);
  const [buildInfo, setBuildInfo] = useState({
    id: id as string,
    version: '1.2.3',
    branch: 'main',
    commitHash: 'a1b2c3d4e5f6',
    timestamp: new Date().toLocaleString(),
    releaseNotes: 'This release includes several bug fixes and performance improvements, enhancing the overall stability of the application.',
    installLink: `/downloads/build-${id}.zip`
  });

  const handleAddChange = () => {
    setChanges([...changes, { description: '', ticketNumber: '', reason: 'code fix', impact: '' }]);
  };

  const handleTeamLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Team Lead Changes:', changes);
    setCurrentStage('qa');
  };
  
  const handleQaApprove = () => {
    console.log('QA Approved');
    setCurrentStage('manager');
  };

  const handleManagerApprove = () => {
    console.log('Manager Approved');
    setCurrentStage('approved');
  };

  return (
    <main className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Approval for Build #{id}</h1>
        <p className="lead text-muted">Review and approve the changes for this build.</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <ApprovalProcessDiagram currentStage={currentStage} />
            </div>
          </div>

          {currentStage === 'deployer' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Deployer Approval</div>
              <div className="card-body p-4 text-center">
                <p>Deployer confirms the build is ready for the approval process.</p>
                <button className="btn btn-success btn-lg" onClick={() => setCurrentStage('teamLead')}>Confirm and Proceed to Team Lead Approval</button>
              </div>
            </div>
          )}

          {currentStage === 'teamLead' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Team Lead Input</div>
              <div className="card-body p-4">
                <form onSubmit={handleTeamLeadSubmit}>
                  {changes.map((change, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
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
                    Add Another Change
                  </button>
                  <button type="submit" className="btn btn-primary">Submit for QA</button>
                </form>
              </div>
            </div>
          )}

          {currentStage === 'qa' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Quality Assurance Approval</div>
              <div className="card-body p-4 text-center">
                <p>QA team verifies the build.</p>
                <button className="btn btn-success btn-lg" onClick={handleQaApprove}>Approve Build</button>
              </div>
            </div>
          )}

          {currentStage === 'manager' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Manager Approval</div>
              <div className="card-body p-4 text-center">
                <p>Manager gives final approval for release.</p>
                <button className="btn btn-success btn-lg" onClick={handleManagerApprove}>Approve for Release</button>
              </div>
            </div>
          )}
            
          {currentStage === 'approved' && (
            <div className="alert alert-success fs-4 text-center shadow-sm">This build has been approved for release.</div>
          )}
        </div>
        <div className="col-lg-4">
          <BuildDetailCard buildInfo={buildInfo} />
        </div>
      </div>
    </main>
  );
}