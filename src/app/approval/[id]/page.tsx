"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ApprovalProcessDiagram from '@/app/components/ApprovalProcessDiagram';
import BuildDetailCard from '@/app/components/BuildDetailCard';
import PendingApproversCard from '@/app/components/PendingApproversCard';
import ChangesSummaryCard from '@/app/components/ChangesSummaryCard';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { apiFetch } from '@/app/lib/api';

type Stage = 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved' | 'canceled';

// Mock data for pending approvers at each stage
const approversByStage: Record<Stage, string[]> = {
  deployer: [],
  teamLead: ['Alice (Team Lead)', 'Bob (Team Lead)'],
  qa: ['Charlie (QA)', 'David (QA)'],
  manager: ['Eve (Manager)'],
  approved: [],
  canceled: [],
};

export default function ApprovalPage() {
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState<Stage>('deployer');
  const [pendingApprovers, setPendingApprovers] = useState<string[]>([]);
  const [changes, setChanges] = useState([{ changeDescription: '', ticketNumber: '', reason: 'code fix', impactDescription: '' }]);
  const [qaAttachment, setQaAttachment] = useState<File | null>(null);
  const [isAddingChanges, setIsAddingChanges] = useState(false);
  const [deploymentDate, setDeploymentDate] = useState('');
  const [buildInfo, setBuildInfo] = useState({
    id: id as string,
    version: '1.2.3',
    branch: 'main',
    commitHash: 'a1b2c3d4e5f6',
    timestamp: new Date().toLocaleString(),
    releaseNotes: 'This release includes several bug fixes and performance improvements, enhancing the overall stability of the application.',
    installLink: `/downloads/build-${id}.zip`,
    deploymentDate: '',
  });
  const [approvalRequestId, setApprovalRequestId] = useState<number | null>(null);

  useEffect(() => {
    setPendingApprovers(approversByStage[currentStage] || []);
  }, [currentStage]);

  useEffect(() => {
    const requestApproval = async () => {
      if (id) {
        try {
          const response = await apiFetch(`/api/approvals/request/${id}`, {
            method: 'POST',
          });
          setApprovalRequestId(response.id);
        } catch (error) {
          console.error('Failed to create approval request:', error);
        }
      }
    };
    requestApproval();
  }, [id]);

  const handleAddChange = () => {
    setChanges([...changes, { changeDescription: '', ticketNumber: '', reason: 'code fix', impactDescription: '' }]);
  };
  
  const handleRemoveChange = (indexToRemove: number) => {
    setChanges(changes.filter((_, index) => index !== indexToRemove));
  };

  const handleDeployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuildInfo({ ...buildInfo, deploymentDate: deploymentDate });
    setCurrentStage('teamLead');
  };

  const handleTeamLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedChanges = changes.filter(c => c.changeDescription.trim() !== '');
    setChanges(submittedChanges.length > 0 ? submittedChanges : []);
    if (approvalRequestId) {
      try {
        await apiFetch(`/api/approvals/team-lead/${approvalRequestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submittedChanges),
        });
        setCurrentStage('qa');
      } catch (error) {
        console.error('Failed to submit team lead changes:', error);
      }
    }
  };

  const handleSkipTeamLead = () => {
    setChanges([]);
    setCurrentStage('qa');
  };
  
  const handleQaApprove = async () => {
    console.log('QA Approved with attachment:', qaAttachment?.name || 'None');
    if (approvalRequestId) {
      try {
        await apiFetch(`/api/approvals/qa/${approvalRequestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approved: true, approvedBy: 'QA User' }),
        });
        setCurrentStage('manager');
      } catch (error) {
        console.error('Failed to submit QA approval:', error);
      }
    }
  };

  const handleQaDeny = () => {
    if (window.confirm('Are you sure you want to deny this build? This will cancel the process.')) {
      console.log('QA Denied with attachment:', qaAttachment?.name || 'None');
      setCurrentStage('canceled');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQaAttachment(e.target.files[0]);
    } else {
      setQaAttachment(null);
    }
  };

  const handleManagerApprove = async () => {
    if (approvalRequestId) {
      try {
        await apiFetch(`/api/approvals/manager/${approvalRequestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approved: true, approvedBy: 'Manager User' }),
        });
        setCurrentStage('approved');
      } catch (error) {
        console.error('Failed to submit manager approval:', error);
      }
    }
  };
  
  const handleManagerDeny = () => {
    if (window.confirm('Are you sure you want to deny this release? This will cancel the process.')) {
      setCurrentStage('canceled');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this approval process?')) {
      setCurrentStage('canceled');
    }
  };

  return (
    <main className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Approval for Build Version: {buildInfo.version}</h1>
        <p className="lead text-muted">Review and approve the changes for this build.</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <ApprovalProcessDiagram currentStage={currentStage} />
            </div>
          </div>

          {currentStage !== 'approved' && currentStage !== 'canceled' && (
             <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleCancel}>Cancel Approval</button>
            </div>
          )}

          {currentStage === 'deployer' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Deployer Approval</div>
              <div className="card-body p-4">
                <form onSubmit={handleDeployerSubmit} className="text-center">
                  <p>Please select the target deployment date for this build.</p>
                  <div className="mb-3 mx-auto" style={{ maxWidth: '300px' }}>
                    <label htmlFor="deploymentDate" className="form-label fw-bold">Deployment Date</label>
                    <input
                      type="date"
                      id="deploymentDate"
                      className="form-control"
                      value={deploymentDate}
                      onChange={(e) => setDeploymentDate(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success btn-lg mt-3">Confirm and Proceed</button>
                </form>
              </div>
            </div>
          )}

          {currentStage === 'teamLead' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Team Lead Input</div>
              <div className="card-body p-4">
                {!isAddingChanges ? (
                  <div className="text-center">
                    <p>Does this build require a change log? You can add change details or proceed directly to QA.</p>
                    <button className="btn btn-primary me-2" onClick={() => setIsAddingChanges(true)}>Add Changes</button>
                    <button className="btn btn-secondary" onClick={handleSkipTeamLead}>Proceed to QA (No Changes)</button>
                  </div>
                ) : (
                  <form onSubmit={handleTeamLeadSubmit}>
                    {changes.map((change, index) => (
                      <div key={index} className="mb-4 p-3 border rounded">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Change Description"
                          value={change.changeDescription}
                          onChange={(e) => {
                            const newChanges = [...changes];
                            newChanges[index].changeDescription = e.target.value;
                            setChanges(newChanges);
                          }}
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
                          value={change.impactDescription}
                          onChange={(e) => {
                              const newChanges = [...changes];
                              newChanges[index].impactDescription = e.target.value;
                              setChanges(newChanges);
                          }}
                        ></textarea>
                         {changes.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() => handleRemoveChange(index)}
                          >
                            <FaTrash className="me-1" /> Remove Change
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary me-2" onClick={handleAddChange}>
                      Add Another Change
                    </button>
                    <button type="submit" className="btn btn-primary">Submit for QA</button>
                    <button type="button" className="btn btn-light ms-2" onClick={() => setIsAddingChanges(false)}>Cancel</button>
                  </form>
                )}
              </div>
            </div>
          )}

          {currentStage === 'qa' && (
            <div className="card shadow-sm">
              <div className="card-header fs-5 fw-bold">Quality Assurance Approval</div>
              <div className="card-body p-4">
                <p className="text-center">QA team verifies the build and its changes.</p>
                 <div className="my-3">
                  <label htmlFor="qaAttachment" className="form-label fw-bold">Optional: Attach Findings</label>
                  <input className="form-control" type="file" id="qaAttachment" onChange={handleFileChange} />
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-success btn-lg me-2" onClick={handleQaApprove}>Approve Build</button>
                  <button className="btn btn-danger btn-lg" onClick={handleQaDeny}>Deny Build</button>
                </div>
              </div>
            </div>
          )}

          {currentStage === 'manager' && (
            <>
              <ChangesSummaryCard changes={changes} />
              <div className="card shadow-sm">
                <div className="card-header fs-5 fw-bold">Manager Approval</div>
                <div className="card-body p-4 text-center">
                  <p>Manager gives final approval for release.</p>
                  <button className="btn btn-success btn-lg me-2" onClick={handleManagerApprove}>Approve for Release</button>
                  <button className="btn btn-danger btn-lg" onClick={handleManagerDeny}>Deny Release</button>
                </div>
              </div>
            </>
          )}
            
          {currentStage === 'approved' && (
            <div className="alert alert-success fs-4 text-center shadow-sm">This build has been approved for release.</div>
          )}

          {currentStage === 'canceled' && (
            <div className="alert alert-danger fs-4 text-center shadow-sm d-flex align-items-center justify-content-center">
              <FaExclamationTriangle className="me-3" />
              <span>This approval process has been canceled.</span>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <BuildDetailCard buildInfo={buildInfo} />
          <PendingApproversCard approvers={pendingApprovers} />
        </div>
      </div>
    </main>
  );
}