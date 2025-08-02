"use client";

import React from 'react';
import { Change } from '@/app/types';
import { FaHashtag } from 'react-icons/fa';

interface ChangesListProps {
  changes: Change[];
}

const ChangesList: React.FC<ChangesListProps> = ({ changes }) => {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header fs-5 fw-bold">Changes in this Build ({changes.length})</div>
      <ul className="list-group list-group-flush">
        {changes.length > 0 ? (
          changes.map((change) => (
            <li key={change.hash} className="list-group-item d-flex align-items-center">
              <div className="flex-shrink-0 me-3 text-muted"><FaHashtag /></div>
              <div className="flex-grow-1">
                <p className="mb-0 fw-bold">{change.message}</p>
                <small className="text-muted">by {change.author} • <a href={`https://github.com/example/repo/commit/${change.hash}`} target="_blank" rel="noopener noreferrer">{change.hash.substring(0, 7)}</a></small>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item">No changes found for this build.</li>
        )}
      </ul>
    </div>
  );
};

export default ChangesList;