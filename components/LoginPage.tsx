import React, { useState, FormEvent } from 'react';

interface LoginPageProps {
  // FIX: Corrected syntax from 'password; string' to 'password: string'.
  onLogin: (username: string, password: string) => boolean;
  // FIX: Corrected syntax from 'password; string' to 'password: string'.
  onRegister: (username: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('ユーザー名とパスワードを入力してください。');
      return;
    }

    const success = isRegister ? onRegister(username, password) : onLogin(username, password);
    if (!success && !isRegister) {
      setError('ユーザー名またはパスワードが間違っています。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">勤怠管理ツール</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{isRegister ? '新規登録' : 'ログイン'}</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ユーザー名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-3 text-white font-bold text-lg rounded-xl shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 bg-blue-500 hover:bg-blue-600"
          >
            {isRegister ? '登録' : 'ログイン'}
          </button>
        </form>
        <div className="text-center">
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            {isRegister ? '既にアカウントをお持ちですか？ログイン' : 'アカウントを作成しますか？新規登録'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
