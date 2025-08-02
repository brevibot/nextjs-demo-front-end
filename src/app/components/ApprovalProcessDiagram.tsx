"use client";

import React from 'react';

interface ApprovalProcessDiagramProps {
  currentStage: 'pending' | 'teamLead' | 'qa' | 'manager' | 'approved';
}

const ApprovalProcessDiagram: React.FC<ApprovalProcessDiagramProps> = ({ currentStage }) => {
  const stages = [
    { id: 'pending', label: 'Pending' },
    { id: 'teamLead', label: 'Team Lead' },
    { id: 'qa', label: 'QA' },
    { id: 'manager', label: 'Manager' },
    { id: 'approved', label: 'Approved' },
  ];

  const getStageClass = (stage: string) => {
    if (stage === currentStage) {
      return 'text-primary';
    }
    if (stages.findIndex(s => s.id === stage) < stages.findIndex(s => s.id === currentStage)) {
      return 'text-success';
    }
    return 'text-muted';
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className={`d-flex flex-column align-items-center ${getStageClass(stage.id)}`}>
            <div className={`rounded-circle border border-2 p-2 ${getStageClass(stage.id)}`}>
              <div className="rounded-circle bg-light p-2">{index + 1}</div>
            </div>
            <div className="mt-2">{stage.label}</div>
          </div>
          {index < stages.length - 1 && (
            <div className={`flex-grow-1 border-top border-2 mx-2 ${getStageClass(stages[index + 1].id)}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ApprovalProcessDiagram;