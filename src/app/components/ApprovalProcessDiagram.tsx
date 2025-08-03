'use client';

import React from 'react';

type StageId = 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved' | 'canceled';

interface ApprovalProcessDiagramProps {
  currentStage: StageId;
  status?: string;
}

const STAGES: { id: StageId, label: string }[] = [
  { id: 'deployer', label: 'New' },
  { id: 'teamLead', label: 'Team Leaders' },
  { id: 'qa', label: 'QA' },
  { id: 'manager', label: 'Managers' },
  { id: 'approved', label: 'Closed' },
];

const stageOrder: Record<StageId, number> = {
  deployer: 0,
  teamLead: 1,
  qa: 2,
  manager: 3,
  approved: 4,
  canceled: 5,
};

export default function ApprovalProcessDiagram({ currentStage, status }: ApprovalProcessDiagramProps) {
  const currentStageIndex = stageOrder[currentStage];
  
  const getStageClass = (stage: StageId) => {
    const stageIndex = stageOrder[stage];
    if (status === 'CANCELED') return 'canceled';
    if (stageIndex < currentStageIndex || status === 'APPROVED') return 'completed';
    if (stage === currentStage) return 'active';
    return '';
  };
  
  if (status === 'CANCELED') {
    return (
        <div className="approval-diagram">
            <div className="stage canceled">
                <span>Canceled</span>
            </div>
        </div>
    );
  }

  return (
    <>
      <div className="approval-diagram">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className={`stage ${getStageClass(stage.id)}`}
          >
            <span>{stage.label}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .approval-diagram {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .stage {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 0.6rem 0.5rem 0.6rem 1.5rem;
          margin-right: -1rem;
          position: relative;
          background-color: #f0f2f5;
          color: #495057;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
          white-space: nowrap;
          min-width: 100px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .stage:first-child {
           padding-left: 1rem;
           clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
        }
        .stage:last-child {
           margin-right: 0;
           clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
        }
        .stage.active {
          background-color: #198754; /* Green */
          color: white;
        }
        .stage.completed {
            background-color: #d1e7dd; /* Light Green */
            color: #0a3622;
        }
        .stage.canceled {
            background-color: #dc3545; /* Red */
            color: white;
            clip-path: none;
            border-radius: 0.25rem;
        }
      `}</style>
    </>
  );
};