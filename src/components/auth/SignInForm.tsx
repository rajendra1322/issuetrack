import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validation';
import { QuickDemoAccounts } from './QuickDemoAccounts';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ShieldAlert } from 'lucide-react';

export const SignInForm: React.FC = () => {
  const { signIn, quickSwitch } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rahul.it@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = signIn(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantLogin = (userId: string) => {
    quickSwitch(userId);
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sign In Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">Sign In to IssueTrack</h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Access port & terminal incident logs and cross-department routing.
          </p>
        </div>

        {/* Simulated Auth Notice Banner */}
        <div className="mb-5 p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-brand-900">
          <ShieldAlert className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Simulated Authentication:</span> This frontend prototype authenticates locally via state and LocalStorage. Passwords are never saved in storage.
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Email Address / Gmail ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.it@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-charcoal-50 border border-charcoal-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-charcoal-900"
              />
            </div>
          </div>

          {/* Password input with show/hide */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-charcoal-50 border border-charcoal-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-charcoal-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Link to Sign Up */}
        <div className="mt-5 text-center text-xs text-charcoal-600">
          <span>Don't have an account yet? </span>
          <Link
            to="/signup"
            className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* Quick Demo Accounts Component */}
      <QuickDemoAccounts
        onSelectAccount={(selectedEmail) => setEmail(selectedEmail)}
        onInstantLogin={handleInstantLogin}
      />
    </div>
  );
};
