import React from 'react';
import { User, AttendanceStatus } from '../types';
import { UserGroupIcon } from './icons';

interface TeamStatus {
  user: User;
  status: AttendanceStatus;
}

interface TeamStatusViewProps {
  statuses: TeamStatus[];
  currentUserId: string;
}

const getStatusInfo = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.NotClockedIn: return { text: '未出勤', className: 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200' };
    case AttendanceStatus.ClockedIn: return { text: '勤務中', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    case AttendanceStatus.OnBreak: return { text: '休憩中', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' };
    case AttendanceStatus.ClockedOut: return { text: '退勤済', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    default: return { text: '不明', className: 'bg-gray-100 text-gray-800' };
  }
};

const TeamStatusView: React.FC<TeamStatusViewProps> = ({ statuses, currentUserId }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
        <UserGroupIcon />
        <span className="ml-2">チームメンバーの状況</span>
      </h2>
      <ul className="space-y-2 text-slate-600 dark:text-slate-300 max-h-48 overflow-y-auto">
        {statuses.map(({ user, status }) => {
          const { text, className } = getStatusInfo(status);
          return (
            <li key={user.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-700 rounded-md">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {user.username}
                {user.id === currentUserId && <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">(あなた)</span>}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${className}`}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamStatusView;
