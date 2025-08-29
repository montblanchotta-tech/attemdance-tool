
import React, { useMemo } from 'react';
import { AttendanceRecord, RecordType, AttendanceStatus } from '../types';

interface WorkSummaryProps {
  records: AttendanceRecord[];
  status: AttendanceStatus;
}

const formatMilliseconds = (ms: number): string => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-baseline p-3 bg-white dark:bg-slate-700 rounded-md">
    <span className="text-slate-600 dark:text-slate-300">{label}</span>
    <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);

const WorkSummary: React.FC<WorkSummaryProps> = ({ records, status }) => {
  const summary = useMemo(() => {
    let clockInTime: Date | null = null;
    let breakStartTime: Date | null = null;
    let totalBreakMs = 0;

    const completedBreaksMs = records.reduce((acc, record, index) => {
      if (record.type === RecordType.BreakStart) {
        const breakEndTime = records.slice(index + 1).find(r => r.type === RecordType.BreakEnd);
        if (breakEndTime) {
          acc += breakEndTime.timestamp.getTime() - record.timestamp.getTime();
        }
      }
      return acc;
    }, 0);

    totalBreakMs = completedBreaksMs;

    const firstClockIn = records.find(r => r.type === RecordType.ClockIn);
    if (firstClockIn) {
      clockInTime = firstClockIn.timestamp;
    }

    const lastRecord = records.length > 0 ? records[records.length - 1] : null;

    if (status === AttendanceStatus.OnBreak && lastRecord && lastRecord.type === RecordType.BreakStart) {
        breakStartTime = lastRecord.timestamp;
        const ongoingBreakMs = new Date().getTime() - breakStartTime.getTime();
        totalBreakMs += ongoingBreakMs;
    }
    
    if (!clockInTime) {
      return { totalWork: '00:00:00', totalBreak: '00:00:00', netWork: '00:00:00' };
    }

    const clockOutRecord = records.find(r => r.type === RecordType.ClockOut);
    const endCalcTime = clockOutRecord ? clockOutRecord.timestamp : new Date();
    
    const grossWorkMs = endCalcTime.getTime() - clockInTime.getTime();
    const netWorkMs = grossWorkMs - totalBreakMs;

    return {
      totalWork: formatMilliseconds(grossWorkMs),
      totalBreak: formatMilliseconds(totalBreakMs),
      netWork: formatMilliseconds(netWorkMs),
    };
  }, [records, status]);

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">勤務概要</h2>
      <div className="space-y-2">
        <SummaryItem label="総勤務時間" value={summary.totalWork} />
        <SummaryItem label="総休憩時間" value={summary.totalBreak} />
        <SummaryItem label="純勤務時間" value={summary.netWork} />
      </div>
    </div>
  );
};

export default WorkSummary;
