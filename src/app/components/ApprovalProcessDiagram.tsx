"use client";

import React from 'react';

// The parent component uses these stage names.
type OldStageId = 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved' | 'canceled';

// The new design uses a different set of stages.
type NewStageId = 'new' | 'teamLeaders' | 'qa' | 'managers' | 'closed' | 'canceled';

interface ApprovalProcessDiagramProps {
  currentStage: OldStageId;
}

// Map old stage names to the new visual stages to avoid breaking the parent component's logic.
const stageMapping: Record<OldStageId, NewStageId> = {
  deployer: 'new',
  teamLead: 'teamLeaders',
  qa: 'qa',
  manager: 'managers',
  approved: 'closed',
  canceled: 'canceled',
};

const ApprovalProcessDiagram: React.FC<ApprovalProcessDiagramProps> = ({ currentStage: oldStage }) => {
  const currentStage = stageMapping[oldStage];

  const stages: { id: NewStageId, label: string }[] = [
    { id: 'new', label: 'New' },
    { id: 'teamLeaders', label: 'Team Leaders' },
    { id: 'qa', label: 'QA' },
    { id: 'managers', label: 'Managers' },
    { id: 'closed', label: 'Closed' },
    { id: 'canceled', label: 'Canceled' },
  ];

  // Do not show the 'Canceled' stage in the main flow unless it is the active stage.
  const visibleStages = currentStage === 'canceled' 
    ? stages.filter(s => s.id === 'canceled') 
    : stages.filter(s => s.id !== 'canceled');

  return (
    <>
      <div className="diagram-container">
        <div className="approval-diagram">
          {visibleStages.map((stage) => (
            <div
              key={stage.id}
              className={`stage ${stage.id === currentStage ? 'active' : ''} ${stage.id === 'canceled' ? 'canceled' : ''}`}
            >
              <span>{stage.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .diagram-container {
          overflow-x: auto;
          padding-bottom: 10px; /* Space for scrollbar */
        }
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
          background-color: #f0f2f5; /* Lighter gray */
          color: #495057;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
          white-space: nowrap;
          min-width: 100px;
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
          background-color: #0b7956; /* Dark Green */
          color: white;
        }
        .stage.canceled {
            background-color: #dc3545; /* Red for canceled */
            color: white;
            clip-path: none;
            margin-right: 0;
            border-radius: 0.25rem;
        }
      `}</style>
    </>
  );
};

export default ApprovalProcessDiagram;