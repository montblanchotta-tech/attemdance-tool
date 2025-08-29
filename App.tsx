import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AttendanceStatus, RecordType, AttendanceRecord, User, CorrectionRequest, UserRole } from './types';
import Clock from './components/Clock';
import ControlButton from './components/ControlButton';
import AttendanceLog from './components/AttendanceLog';
import WorkSummary from './components/WorkSummary';
import LoginPage from './components/LoginPage';
import AdminView from './components/AdminView';
import RequestCorrectionModal from './components/RequestCorrectionModal';
import UserRequests from './components/UserRequests';
import TeamStatusView from './components/TeamStatusView'; // Import the new component
import { PlayIcon, StopIcon, CoffeeIcon, PlayCircleIcon, ArrowLeftOnRectangleIcon, ShieldCheckIcon } from './components/icons';

const APP_DATA_KEY = 'attendanceAppData_v2';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Global state for all app data
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<{ [userId: string]: AttendanceRecord[] }>({});
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'app' | 'admin'>('app');
  const [modal, setModal] = useState<{ type: 'correction'; record: AttendanceRecord } | null>(null);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedDataRaw = localStorage.getItem(APP_DATA_KEY);
      if (savedDataRaw) {
        const data = JSON.parse(savedDataRaw, (key, value) => {
          if (key === 'timestamp' || key.includes('Timestamp')) {
            return new Date(value);
          }
          return value;
        });
        setUsers(data.users || []);
        setRecords(data.records || {});
        setRequests(data.requests || []);
      } else {
        // Initialize with a default admin user if no data exists
        const adminId = crypto.randomUUID();
        const adminUser: User = { id: adminId, username: 'admin', password: 'admin', role: 'Admin' };
        setUsers([adminUser]);
        setRecords({ [adminId]: [] });
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) { // Only save if initialized
      try {
        const dataToSave = { users, records, requests };
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [users, records, requests]);

  // Clock timer
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  // Derived state for the current user
  const currentUserRecords = currentUser ? records[currentUser.id] || [] : [];
  const currentUserRequests = currentUser ? requests.filter(r => r.userId === currentUser.id) : [];

  const status = useMemo(() => {
    if (!currentUser || currentUserRecords.length === 0) return AttendanceStatus.NotClockedIn;
    const lastRecord = currentUserRecords[currentUserRecords.length - 1];
    switch (lastRecord.type) {
      case RecordType.ClockIn:
      case RecordType.BreakEnd:
        return AttendanceStatus.ClockedIn;
      case RecordType.BreakStart:
        return AttendanceStatus.OnBreak;
      case RecordType.ClockOut:
        return AttendanceStatus.ClockedOut;
      default:
        return AttendanceStatus.NotClockedIn;
    }
  }, [currentUser, currentUserRecords]);

  // Derived state for all users' statuses
  const allUserStatuses = useMemo(() => {
    return users.map(user => {
      const userRecords = records[user.id] || [];
      if (userRecords.length === 0) {
        return { user, status: AttendanceStatus.NotClockedIn };
      }
      const lastRecord = userRecords[userRecords.length - 1];
      let status: AttendanceStatus;
      switch (lastRecord.type) {
        case RecordType.ClockIn:
        case RecordType.BreakEnd:
          status = AttendanceStatus.ClockedIn;
          break;
        case RecordType.BreakStart:
          status = AttendanceStatus.OnBreak;
          break;
        case RecordType.ClockOut:
          status = AttendanceStatus.ClockedOut;
          break;
        default:
          status = AttendanceStatus.NotClockedIn;
          break;
      }
      return { user, status };
    });
  }, [users, records]);


  const addRecord = (type: RecordType) => {
    if (!currentUser) return;
    const newRecord: AttendanceRecord = { id: crypto.randomUUID(), type, timestamp: new Date() };
    const userRecords = [...(records[currentUser.id] || []), newRecord];
    setRecords(prev => ({ ...prev, [currentUser.id]: userRecords }));
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setView('app');
      return true;
    }
    return false;
  };

  const handleRegister = (username: string, password: string): boolean => {
    if (users.some(u => u.username === username)) {
      alert('このユーザー名は既に使用されています。');
      return false;
    }
    const newUserId = crypto.randomUUID();
    const newUser: User = { id: newUserId, username, password, role: 'User' };
    setUsers(prev => [...prev, newUser]);
    setRecords(prev => ({ ...prev, [newUserId]: [] }));
    setCurrentUser(newUser);
    setView('app');
    return true;
  };
  
  const handleLogout = () => setCurrentUser(null);
  
  const handleReset = useCallback(() => {
    if (!currentUser) return;
    if (window.confirm('本日の勤怠記録をすべてリセットします。よろしいですか？')) {
      setRecords(prev => ({ ...prev, [currentUser.id]: [] }));
    }
  }, [currentUser]);

  const handleSubmitCorrection = (record: AttendanceRecord, requestedTime: string, reason: string) => {
    if (!currentUser) return;
    
    const [hours, minutes] = requestedTime.split(':').map(Number);
    const requestedTimestamp = new Date(record.timestamp);
    requestedTimestamp.setHours(hours, minutes, 0, 0);

    const newRequest: CorrectionRequest = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      username: currentUser.username,
      recordId: record.id,
      recordType: record.type,
      originalTimestamp: record.timestamp,
      requestedTimestamp,
      reason,
      status: '保留中',
    };
    setRequests(prev => [...prev, newRequest]);
    setModal(null);
  };
  
  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    // Update record
    setRecords(prev => {
        const userRecords = prev[request.userId];
        if(!userRecords) return prev;
        const updatedRecords = userRecords.map(rec => 
            rec.id === request.recordId ? { ...rec, timestamp: request.requestedTimestamp } : rec
        );
        return { ...prev, [request.userId]: updatedRecords };
    });
    
    // Update request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: '承認済み' } : r));
  };
  
  const handleDenyRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: '却下済み' } : r));
  };

  const handlePromoteUser = (userId: string) => {
    if (window.confirm('このユーザーを管理者に昇格させますか？この操作は元に戻せません。')) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: 'Admin' } : user
        )
      );
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const getStatusText = () => {
    switch (status) {
      case AttendanceStatus.NotClockedIn: return { text: '未出勤', color: 'text-slate-500' };
      case AttendanceStatus.ClockedIn: return { text: '勤務中', color: 'text-green-500' };
      case AttendanceStatus.OnBreak: return { text: '休憩中', color: 'text-amber-500' };
      case AttendanceStatus.ClockedOut: return { text: '退勤済', color: 'text-blue-500' };
      default: return { text: '', color: '' };
    }
  };
  const { text: statusText, color: statusColor } = getStatusText();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <header className="border-b border-slate-200 dark:border-slate-700 pb-4">
           <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">勤怠管理ツール</h1>
                <Clock currentTime={currentTime} />
             </div>
             <div className="flex items-center gap-4">
               <span className="text-slate-600 dark:text-slate-300">ようこそ, {currentUser.username}さん</span>
               {currentUser.role === 'Admin' && (
                  <button onClick={() => setView(v => v === 'app' ? 'admin' : 'app')} title={view === 'app' ? '管理者画面へ' : '通常画面へ'} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <ShieldCheckIcon />
                  </button>
               )}
               <button onClick={handleLogout} title="ログアウト" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <ArrowLeftOnRectangleIcon/>
               </button>
             </div>
           </div>
        </header>

        {view === 'admin' ? (
            <AdminView 
                users={users} 
                requests={requests}
                records={records}
                onApprove={handleApproveRequest}
                onDeny={handleDenyRequest}
                onPromote={handlePromoteUser}
            />
        ) : (
          <>
            <div className="flex justify-center items-center space-x-3">
                <p className="text-lg text-slate-600 dark:text-slate-300">ステータス:</p>
                <p className={`text-lg font-bold ${statusColor}`}>{statusText}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {status === AttendanceStatus.NotClockedIn && (
                  <ControlButton label="出勤" onClick={() => addRecord(RecordType.ClockIn)} icon={<PlayIcon />} colorClassName="bg-green-500 hover:bg-green-600" />
                )}
                {status === AttendanceStatus.ClockedIn && (
                    <>
                        <ControlButton label="休憩開始" onClick={() => addRecord(RecordType.BreakStart)} icon={<CoffeeIcon />} colorClassName="bg-amber-500 hover:bg-amber-600" />
                        <ControlButton label="退勤" onClick={() => addRecord(RecordType.ClockOut)} icon={<StopIcon />} colorClassName="bg-red-500 hover:bg-red-600" />
                    </>
                )}
                {status === AttendanceStatus.OnBreak && (
                    <ControlButton label="休憩終了" onClick={() => addRecord(RecordType.BreakEnd)} icon={<PlayCircleIcon />} colorClassName="bg-blue-500 hover:bg-blue-600" />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <AttendanceLog records={currentUserRecords} onRequestCorrection={(record) => setModal({ type: 'correction', record })} />
              <WorkSummary records={currentUserRecords} status={status} />
            </div>
            
            <TeamStatusView statuses={allUserStatuses} currentUserId={currentUser.id} />

            <UserRequests requests={currentUserRequests} />

            {currentUserRecords.length > 0 && (
                <div className="pt-4 flex justify-center">
                    <button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        記録をリセット
                    </button>
                </div>
            )}
          </>
        )}
      </div>

      {modal?.type === 'correction' && (
        <RequestCorrectionModal
          record={modal.record}
          onClose={() => setModal(null)}
          onSubmit={handleSubmitCorrection}
        />
      )}
    </div>
  );
};

export default App;