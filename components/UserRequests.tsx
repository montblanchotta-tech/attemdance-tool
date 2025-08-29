import React from 'react';
import { CorrectionRequest } from '../types';
import { PencilSquareIcon } from './icons';

interface UserRequestsProps {
  requests: CorrectionRequest[];
}

const getStatusChipClassName = (status: CorrectionRequest['status']) => {
  switch (status) {
    case '保留中':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case '承認済み':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case '却下済み':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

const UserRequests: React.FC<UserRequestsProps> = ({ requests }) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
        <PencilSquareIcon className="h-5 w-5" />
        <span className="ml-2">修正申請履歴</span>
      </h2>
      <ul className="space-y-2 text-slate-600 dark:text-slate-300 max-h-40 overflow-y-auto">
        {requests.map((req) => (
          <li key={req.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-700 rounded-md">
            <div>
              <span className="font-semibold">{req.recordType}</span>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                {req.originalTimestamp.toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs">
                {req.originalTimestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                {' → '}
                {req.requestedTimestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipClassName(req.status)}`}>
                {req.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRequests;
