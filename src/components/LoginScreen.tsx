import React, { useState, useEffect } from 'react';
import * as userService from '../services/userService';
import { Player } from '../types';
import { ShieldCheckIcon } from './Icon';
import BannedNotificationModal from './BannedNotificationModal';

interface LoginScreenProps {
  onLoginSuccess: (player: Player, username: string) => void;
}

const generateCaptcha = (): { question: string, answer: string } => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return {
        question: `Type the following characters: ${result}`,
        answer: result
    };
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'register'>('login');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    // Clear error when switching views
    setError('');
  }, [view]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear any success message from registration
    if (loginUsername && loginPassword) {
      const result = userService.login(loginUsername, loginPassword);
      if (result.success && result.player) {
        onLoginSuccess(result.player, loginUsername);
      } else {
        if (result.message?.startsWith('ACCOUNT_BANNED::')) {
            const reason = result.message.split('::')[1];
            setBanReason(reason);
            setIsBannedModalOpen(true);
        } else {
            setError(result.message || 'Login failed.');
        }
      }
    } else {
      setError('Please enter a username and password.');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!regUsername || !regPassword || !regConfirmPassword || !captchaInput) {
        setError('All fields are required.');
        return;
    }
    if (regPassword !== regConfirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    if (regPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    if (captchaInput !== captcha.answer) {
        setError('CAPTCHA is incorrect.');
        setCaptcha(generateCaptcha()); // Regenerate captcha
        setCaptchaInput('');
        return;
    }

    const result = userService.register(regUsername, regPassword);
    if (result.success) {
      setSuccessMessage('Account created successfully! You can now log in.');
      setView('login');
      // Clear registration form
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
      setCaptchaInput('');
    } else {
      setError(result.message || 'Registration failed.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
    }
  };
  
  const renderLoginView = () => (
    <>
      <p className="text-center text-amber-800 mb-6">Login to continue your reign.</p>
      {successMessage && (
        <div className="bg-green-100 border-2 border-green-300 text-green-800 p-4 rounded-lg mb-6 text-center flex flex-col items-center gap-2">
            <ShieldCheckIcon className="h-8 w-8 text-green-600"/>
            <p className="font-bold text-lg">Success!</p>
            <p>{successMessage}</p>
        </div>
      )}
      {error && <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-md mb-4 text-center">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-bold text-amber-900 mb-2">Username</label>
          <input
            id="username"
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-md p-3 font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
            placeholder="Your criminal alias"
            required
            aria-label="Username"
          />
        </div>
        <div>
          <label htmlFor="password"  className="block text-sm font-bold text-amber-900 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-md p-3 font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
            placeholder="Your secret code"
            required
            aria-label="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-200"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={() => setView('register')} className="font-semibold text-amber-800 hover:text-amber-900 transition-colors">
          Create a New Account
        </button>
      </div>
    </>
  );

  const renderRegisterView = () => (
    <>
      <p className="text-center text-amber-800 mb-6">Create your legacy.</p>
      {error && <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-md mb-4 text-center">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-amber-900 mb-2">Username</label>
          <input
            type="text"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-md p-3 font-mono"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-amber-900 mb-2">Password</label>
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-md p-3 font-mono"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-amber-900 mb-2">Confirm Password</label>
          <input
            type="password"
            value={regConfirmPassword}
            onChange={(e) => setRegConfirmPassword(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-md p-3 font-mono"
            required
          />
        </div>
        <div className="pt-2">
            <label className="block text-sm font-bold text-amber-900 mb-2">CAPTCHA</label>
            <p className="p-3 bg-amber-300 text-center font-mono tracking-widest text-lg rounded-md text-amber-950 select-none">{captcha.question.split(': ')[1]}</p>
            <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                className="mt-2 w-full bg-white border border-amber-300 rounded-md p-3 font-mono text-center"
                placeholder="Enter characters above"
                required
            />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200"
        >
          Create Account
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={() => setView('login')} className="font-semibold text-amber-800 hover:text-amber-900 transition-colors">
          Already have an account? Login
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-200 to-amber-300 text-amber-950 font-sans flex items-center justify-center p-4">
      <BannedNotificationModal
        isOpen={isBannedModalOpen}
        reason={banReason}
        onClose={() => setIsBannedModalOpen(false)}
      />
      <div className="w-full max-w-md bg-amber-100/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-300">
        <div className="mb-4">
            <div className="flex items-center justify-center gap-6 text-amber-800">
                <div className="flex-grow h-px bg-amber-300"></div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-wider text-center font-cinzel">
                Empire Of Families
                </h1>
                <div className="flex-grow h-px bg-amber-300"></div>
            </div>
        </div>
        {view === 'login' ? renderLoginView() : renderRegisterView()}
      </div>
    </div>
  );
};

export default LoginScreen;