export enum AttendanceStatus {
  NotClockedIn,
  ClockedIn,
  OnBreak,
  ClockedOut,
}

export enum RecordType {
  ClockIn = '出勤',
  ClockOut = '退勤',
  BreakStart = '休憩開始',
  BreakEnd = '休憩終了',
}

export interface AttendanceRecord {
  id: string;
  type: RecordType;
  timestamp: Date;
}

export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  username: string;
  // FIX: Corrected syntax from 'password; string;' to 'password: string;'.
  password: string; // In a real app, this would be hashed
  role: UserRole;
}

export type CorrectionRequestStatus = '保留中' | '承認済み' | '却下済み';

export interface CorrectionRequest {
  id: string;
  userId: string;
  username: string; // Denormalized for easier display
  recordId: string;
  recordType: RecordType;
  originalTimestamp: Date;
  requestedTimestamp: Date;
  reason: string;
  status: CorrectionRequestStatus;
}
