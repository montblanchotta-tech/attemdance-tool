import React from 'react';
import { User, CorrectionRequest, AttendanceRecord } from '../types';
import { UserGroupIcon, PencilSquareIcon } from './icons';

interface AdminViewProps {
  users: User[];
  requests: CorrectionRequest[];
  records: { [userId: string]: AttendanceRecord[] };
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  onPromote: (userId: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ users, requests, records, onApprove, onDeny, onPromote }) => {

  const pendingRequests = requests.filter(r => r.status === '保留中');

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 flex items-center mb-4">
          <UserGroupIcon />
          <span className="ml-2">ユーザー管理</span>
        </h2>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg max-h-48 overflow-y-auto">
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center p-2 bg-white dark:bg-slate-700 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 dark:text-slate-200">{user.username}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'Admin' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
                {user.role === 'User' && (
                  <button 
                    onClick={() => onPromote(user.id)}
                    className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition-colors"
                  >
                    管理者に昇格
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 flex items-center mb-4">
          <PencilSquareIcon className="h-6 w-6" />
          <span className="ml-2">勤怠修正申請</span>
        </h2>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg max-h-96 overflow-y-auto">
          {pendingRequests.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">保留中の申請はありません。</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.map(req => (
                <li key={req.id} className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        {req.username} <span className="font-normal text-slate-500 dark:text-slate-400">({req.recordType})</span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-mono bg-slate-100 dark:bg-slate-600 px-1 rounded">{req.originalTimestamp.toLocaleTimeString('ja-JP')}</span>
                        {' → '}
                        <span className="font-mono bg-green-100 dark:bg-green-900 px-1 rounded">{req.requestedTimestamp.toLocaleTimeString('ja-JP')}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onApprove(req.id)} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600">承認</button>
                      <button onClick={() => onDeny(req.id)} className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full hover:bg-red-600">却下</button>
                    </div>
                  </div>
                  <p className="text-sm mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">理由: {req.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminView;