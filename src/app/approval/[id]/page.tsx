'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/app/lib/api';
import { Build, ApprovalRequest, TeamLeadChange } from '@/app/types';
import ApprovalProcessDiagram from '@/app/components/ApprovalProcessDiagram';
import BuildDetailCard from '@/app/components/BuildDetailCard';
import PendingApproversCard from '@/app/components/PendingApproversCard';
import ChangesList from '@/app/components/ChangesList';
import ChangesSummaryCard from '@/app/components/ChangesSummaryCard'; // Import summary card
import TeamLeadApprovalForm from '@/app/components/TeamLeadApprovalForm';
import QAApprovalForm from '@/app/components/QAApprovalForm';
import ManagerApprovalForm from '@/app/components/ManagerApprovalForm';
import 'bootstrap/dist/css/bootstrap.min.css';

type Stage = 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved' | 'canceled';

const statusToStageMap: { [key: string]: Stage } = {
  'PENDING_DEPLOYER': 'deployer',
  'PENDING_TEAM_LEAD': 'teamLead',
  'PENDING_QA': 'qa',
  'PENDING_MANAGER': 'manager',
  'APPROVED': 'approved',
  'CANCELED': 'canceled'
};

export default function ApprovalPage() {
    const params = useParams();
    const buildId = params.id as string;

    const [buildInfo, setBuildInfo] = useState<Build | null>(null);
    const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null);
    const [approvalRequestId, setApprovalRequestId] = useState<number | null>(null);
    const [currentStage, setCurrentStage] = useState<Stage>('deployer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTeamLeadForm, setShowTeamLeadForm] = useState(false);
    const [deploymentDate, setDeploymentDate] = useState('');
    
    useEffect(() => {
        if (!buildId) return;

        const fetchBuildDetails = async () => {
            try {
                const buildData = await apiFetch(`/api/builds/${buildId}`);
                setBuildInfo(buildData);
            } catch (err: any) {
                setError(`Failed to fetch build details: ${err.message}`);
            }
        };

        const requestApproval = async () => {
            try {
                const approvalReq = await apiFetch(`/api/approvals/request/${buildId}`, { method: 'POST' });
                setApprovalRequest(approvalReq);
                setApprovalRequestId(approvalReq.id);
                if (approvalReq.status && statusToStageMap[approvalReq.status]) {
                  setCurrentStage(statusToStageMap[approvalReq.status]);
                }
            } catch (err: any) {
                setError(`Failed to initiate or fetch approval request: ${err.message}`);
            }
        };

        const run = async () => {
            setLoading(true);
            await fetchBuildDetails();
            await requestApproval();
            setLoading(false);
        };

        run();
    }, [buildId]);
    
    const isClosed = currentStage === 'approved' || currentStage === 'canceled';

    const handleDeployerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!approvalRequestId) return;
        try {
            const updatedRequest = await apiFetch(`/api/approvals/deployer/${approvalRequestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true, approvedBy: 'Deployer User' }),
            });
            setBuildInfo({ ...buildInfo, deploymentDate: deploymentDate } as Build);
            if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
              setCurrentStage(statusToStageMap[updatedRequest.status]);
              setApprovalRequest(updatedRequest);
            }
        } catch (err: any) {
            setError(`Failed to submit deployer approval: ${err.message}`);
        }
    };

    const handleCancel = async () => {
        if (!approvalRequestId) return;
        try {
            const updatedRequest = await apiFetch(`/api/approvals/cancel/${approvalRequestId}`, {
                method: 'POST',
            });
            if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
                setApprovalRequest(updatedRequest);
                setCurrentStage(statusToStageMap[updatedRequest.status]);
            }
        } catch (err: any) {
            setError(`Failed to cancel approval: ${err.message}`);
        }
    };
    
    const handleReset = async () => {
        if (!approvalRequestId) return;
        try {
          const updatedRequest = await apiFetch(`/api/approvals/reset/${approvalRequestId}`, {
            method: 'POST',
          });
          if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
            setApprovalRequest(updatedRequest);
            setCurrentStage(statusToStageMap[updatedRequest.status]);
            setError(null);
          }
        } catch (err: any) {
          setError(`Failed to reset approval: ${err.message}`);
        }
    };

    const handleTeamLeadSubmit = async (changes: TeamLeadChange[], approvedBy: string) => {
        if (!approvalRequestId) return;
        try {
            const updatedRequest = await apiFetch(`/api/approvals/team-lead/${approvalRequestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvedBy, changes }),
            });
             if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
                setCurrentStage(statusToStageMap[updatedRequest.status]);
                setApprovalRequest(updatedRequest);
                setShowTeamLeadForm(false);
            }
        } catch (err: any) {
            setError(`Failed to submit team lead approval: ${err.message}`);
        }
    };

    const handleProceedToQa = () => {
        handleTeamLeadSubmit([], "Team Lead (No Changes)");
    };

    const handleQaDecision = async (approved: boolean) => {
        if (!approvalRequestId) return;
        try {
            const updatedRequest = await apiFetch(`/api/approvals/qa/${approvalRequestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved, approvedBy: 'QA User' }),
            });

             if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
                setApprovalRequest(updatedRequest);
                setCurrentStage(statusToStageMap[updatedRequest.status]);
            }
        } catch (err: any) {
            setError(`Failed to submit QA decision: ${err.message}`);
        }
    };

    const handleManagerDecision = async (approved: boolean) => {
        if (!approvalRequestId) return;
        try {
            const updatedRequest = await apiFetch(`/api/approvals/manager/${approvalRequestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved, approvedBy: 'Manager User' }),
            });

             if (updatedRequest.status && statusToStageMap[updatedRequest.status]) {
                setApprovalRequest(updatedRequest);
                setCurrentStage(statusToStageMap[updatedRequest.status]);
            }
        } catch (err: any) {
            setError(`Failed to submit manager decision: ${err.message}`);
        }
    };

    if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!buildInfo || !approvalRequest) return <div className="alert alert-warning">Build information not found.</div>;

    const version = `${buildInfo.majorVersion}.${buildInfo.minorVersion}.${buildInfo.patchVersion}`;

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h1>Approval for Build Version: {version}</h1>
                <p className="lead">Review and approve the changes for this build.</p>
            </div>
            
            <ApprovalProcessDiagram currentStage={currentStage} status={approvalRequest.status} />
            
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            
            <div className="row mt-4 g-4">
                <div className="col-lg-8">
                    {!isClosed && (
                         <div className="card shadow-sm mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Actions</h5>
                                <button className="btn btn-danger btn-sm" onClick={handleCancel}>Cancel Approval</button>
                            </div>
                            <div className="card-body">
                                {currentStage === 'deployer' && (
                                    <form onSubmit={handleDeployerSubmit}>
                                        <h4>Deployer Approval</h4>
                                        <p>Please select the target deployment date for this build.</p>
                                        <div className="mb-3">
                                            <label htmlFor="deploymentDate" className="form-label">Deployment Date</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="deploymentDate" 
                                                value={deploymentDate} 
                                                onChange={(e) => setDeploymentDate(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Confirm and Proceed</button>
                                    </form>
                                )}
                                {currentStage === 'teamLead' && !showTeamLeadForm && (
                                    <div>
                                        <h4>Team Leader Approval</h4>
                                        <p>Are there any changes required for this build?</p>
                                        <button className="btn btn-primary me-2" onClick={() => setShowTeamLeadForm(true)}>Add Changes</button>
                                        <button className="btn btn-success" onClick={handleProceedToQa}>Proceed to QA (No Changes)</button>
                                    </div>
                                )}
                                {currentStage === 'teamLead' && showTeamLeadForm && (
                                    <TeamLeadApprovalForm 
                                        onSubmit={handleTeamLeadSubmit} 
                                        onCancel={() => setShowTeamLeadForm(false)} 
                                    />
                                )}
                                {currentStage === 'qa' && (
                                    <QAApprovalForm 
                                        onApprove={() => handleQaDecision(true)}
                                        onDeny={() => handleQaDecision(false)}
                                    />
                                )}
                                {currentStage === 'manager' && (
                                    <ManagerApprovalForm
                                        onApprove={() => handleManagerDecision(true)}
                                        onDeny={() => handleManagerDecision(false)}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {isClosed && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center">
                                {approvalRequest.status === 'APPROVED' && <div className="alert alert-success">This approval request has been fully approved.</div>}
                                {approvalRequest.status === 'CANCELED' && (
                                    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                        <span>This approval request has been canceled.</span>
                                        <button className="btn btn-warning btn-sm" onClick={handleReset}>
                                            Reset Approval
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {(currentStage === 'qa' || currentStage === 'manager') && (
                        <ChangesSummaryCard changes={approvalRequest.teamLeadChanges || []} />
                    )}

                    <ChangesList changes={buildInfo.changes} />
                </div>
                <div className="col-lg-4">
                    <BuildDetailCard build={buildInfo} />
                    <PendingApproversCard stage={currentStage} />
                </div>
            </div>
        </div>
    );
}