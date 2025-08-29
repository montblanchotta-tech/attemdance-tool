import React, { useState, FormEvent } from 'react';
import { AttendanceRecord } from '../types';
import { XCircleIcon } from './icons';

interface RequestCorrectionModalProps {
  record: AttendanceRecord;
  onClose: () => void;
  onSubmit: (record: AttendanceRecord, requestedTime: string, reason: string) => void;
}

const RequestCorrectionModal: React.FC<RequestCorrectionModalProps> = ({ record, onClose, onSubmit }) => {
  const initialTime = record.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
  const [requestedTime, setRequestedTime] = useState(initialTime);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('理由を入力してください。');
      return;
    }
    onSubmit(record, requestedTime, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <XCircleIcon />
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">勤怠記録の修正申請</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">対象記録: {record.type}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              元の時刻: <span className="font-mono">{record.timestamp.toLocaleTimeString('ja-JP')}</span>
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="requestedTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              修正後の時刻
            </label>
            <input
              type="time"
              id="requestedTime"
              value={requestedTime}
              onChange={(e) => setRequestedTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              修正理由
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">
              キャンセル
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              申請する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCorrectionModal;
