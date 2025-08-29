import React from 'react';
import { AttendanceRecord } from '../types';
import { ClockIcon, PencilSquareIcon } from './icons';

interface AttendanceLogProps {
  records: AttendanceRecord[];
  onRequestCorrection: (record: AttendanceRecord) => void;
}

const AttendanceLog: React.FC<AttendanceLogProps> = ({ records, onRequestCorrection }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
        <ClockIcon />
        <span className="ml-2">勤怠記録</span>
      </h2>
      {records.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">まだ記録がありません。</p>
      ) : (
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          {records.map((record) => (
            <li key={record.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-700 rounded-md">
              <div className="flex items-center">
                <span>{record.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono">{record.timestamp.toLocaleTimeString('ja-JP')}</span>
                <button 
                  onClick={() => onRequestCorrection(record)} 
                  className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  title="この記録の修正を申請する"
                >
                  <PencilSquareIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendanceLog;
