"use client";

import React from 'react';

interface ApprovalProcessDiagramProps {
  currentStage: 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved';
}

const ApprovalProcessDiagram: React.FC<ApprovalProcessDiagramProps> = ({ currentStage }) => {
  const stages = [
    { id: 'deployer', label: 'Deployer', members: ['Deployer User'] },
    { id: 'teamLead', label: 'Team Lead', members: ['Alice', 'Bob'] },
    { id: 'qa', label: 'QA', members: ['Charlie', 'David'] },
    { id: 'manager', label: 'Manager', members: ['Eve'] },
    { id: 'approved', label: 'Approved', members: [] },
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
    <div className="d-flex justify-content-between align-items-start">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className={`d-flex flex-column align-items-center text-center ${getStageClass(stage.id)}`}>
            <div className={`rounded-circle border border-2 p-2 ${getStageClass(stage.id)}`}>
              <div className="rounded-circle bg-light p-2">{index + 1}</div>
            </div>
            <div className="mt-2 fw-bold">{stage.label}</div>
            <div className="mt-1 fs-sm">
              {stage.members.map(member => (
                <div key={member}>{member}</div>
              ))}
            </div>
          </div>
          {index < stages.length - 1 && (
            <div className={`flex-grow-1 border-top border-2 mx-2 mt-4 ${getStageClass(stages[index + 1].id)}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ApprovalProcessDiagram;