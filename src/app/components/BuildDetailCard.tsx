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
}

interface BuildDetailCardProps {
  buildInfo: BuildInfo;
}

const BuildDetailCard: React.FC<BuildDetailCardProps> = ({ buildInfo }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fs-5 fw-bold">Build Details</div>
      <div className="card-body p-4">
        <div className="row">
          <div className="col-md-12">
            <p><strong>Build ID:</strong> {buildInfo.id}</p>
            <p><strong>Version:</strong> {buildInfo.version}</p>
            <p><strong>Branch:</strong> {buildInfo.branch}</p>
            <p><strong>Commit Hash:</strong> {buildInfo.commitHash}</p>
            <p><strong>Timestamp:</strong> {buildInfo.timestamp}</p>
          </div>
        </div>
        <hr />
        <h5>Release Notes</h5>
        <p>{buildInfo.releaseNotes}</p>
        <a href={buildInfo.installLink} className="btn btn-info mt-3 w-100" download>Download & Install Build</a>
      </div>
    </div>
  );
};

export default BuildDetailCard;