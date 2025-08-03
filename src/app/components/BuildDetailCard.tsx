"use client";

import React from 'react';

interface BuildInfo {
  id: string;
  version: string;
  branch: string;
  commitHash: string;
  timestamp: string;
  releaseNotes: string;
  installLink: string;
  deploymentDate?: string;
}

interface BuildDetailCardProps {
  buildInfo: BuildInfo;
}

const BuildDetailCard: React.FC<BuildDetailCardProps> = ({ buildInfo }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fs-5 fw-bold">Build Details</div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <strong>Build ID:</strong>
            <span>{buildInfo.id}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Version:</strong>
            <span>{buildInfo.version}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Branch:</strong>
            <span>{buildInfo.branch}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Commit Hash:</strong>
            <span className="font-monospace text-truncate" style={{ maxWidth: '150px' }}>{buildInfo.commitHash}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Timestamp:</strong>
            <span>{buildInfo.timestamp}</span>
          </li>
          {buildInfo.deploymentDate && (
            <li className="list-group-item d-flex justify-content-between">
              <strong>Deployment Date:</strong>
              <span>{new Date(buildInfo.deploymentDate + 'T00:00:00').toLocaleDateString()}</span>
            </li>
           )}
        </ul>
        <div className="mt-3">
          <h6>Release Notes</h6>
          <p className="text-muted">{buildInfo.releaseNotes}</p>
        </div>
        <a href={buildInfo.installLink} className="btn btn-primary w-100 mt-2">Download & Install Build</a>
      </div>
    </div>
  );
};

export default BuildDetailCard;