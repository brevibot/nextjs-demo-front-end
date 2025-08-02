"use client";

import React from 'react';
import { FaUserClock } from 'react-icons/fa';

interface PendingApproversCardProps {
  approvers: string[];
}

const PendingApproversCard: React.FC<PendingApproversCardProps> = ({ approvers }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fs-5 fw-bold">Pending Approvals</div>
      <div className="card-body p-0">
        <ul className="list-group list-group-flush">
          {approvers.length > 0 ? (
            approvers.map((approver, index) => (
              <li key={index} className="list-group-item d-flex align-items-center">
                <FaUserClock className="me-3 text-muted" />
                <span>{approver}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              None for this stage.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PendingApproversCard;