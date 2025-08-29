
import React from 'react';

interface ClockProps {
  currentTime: Date;
}

const Clock: React.FC<ClockProps> = ({ currentTime }) => {
  return (
    <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
      現在の時刻: {currentTime.toLocaleTimeString('ja-JP')}
    </p>
  );
};

export default Clock;
