"use client";

import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

interface Change {
  description: string;
  ticketNumber: string;
  reason: string;
  impact: string;
}

interface ChangesSummaryCardProps {
  changes: Change[];
}

const ChangesSummaryCard: React.FC<ChangesSummaryCardProps> = ({ changes }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fs-5 fw-bold d-flex align-items-center">
        <FaClipboardList className="me-3" />
        <span>Submitted Changes Summary</span>
      </div>
      <div className="card-body">
        {changes.map((change, index) => (
          <div key={index} className="mb-3 p-3 border rounded bg-light">
            <h6 className="fw-bold">{change.description || 'No description'}</h6>
            <p className="mb-1"><strong>Ticket:</strong> {change.ticketNumber || 'N/A'}</p>
            <p className="mb-1"><strong>Reason:</strong> {change.reason || 'N/A'}</p>
            <p className="mb-0"><strong>Impact:</strong> {change.impact || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangesSummaryCard;