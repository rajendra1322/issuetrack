import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Department, DEPARTMENTS, TerminalId, TERMINALS } from '../../types';
import { isValidEmail, validateRequired } from '../../utils/validation';
import {
  User,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Operations');
  const [terminalId, setTerminalId] = useState<TerminalId>('container-terminal');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(name)) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!validateRequired(email)) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = signUp(name, email, department, terminalId);
      if (res.success) {
        navigate('/');
      } else {
        setErrors({ general: res.error || 'Registration failed.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Register your employee profile for terminal incident management.
          </p>
        </div>

        {/* Security / Prototype Notice */}
        <div className="mb-5 p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-brand-900">
          <ShieldAlert className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Security Note:</span> This is a frontend-only prototype. User profile data is simulated in LocalStorage. Plaintext passwords are not stored in persistent storage. Real password security and salting requires a backend service.
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Kumar"
                required
                className={`w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-charcoal-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
                } text-charcoal-900`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Gmail ID / Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.ops@gmail.com"
                required
                className={`w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-charcoal-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
                } text-charcoal-900`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Department & Terminal Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full text-xs font-semibold bg-charcoal-50 border border-charcoal-300 rounded-xl px-3 py-2.5 text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Port Terminal <span className="text-red-500">*</span>
              </label>
              <select
                value={terminalId}
                onChange={(e) => setTerminalId(e.target.value as TerminalId)}
                className="w-full text-xs font-semibold bg-charcoal-50 border border-charcoal-300 rounded-xl px-3 py-2.5 text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {Object.values(TERMINALS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-charcoal-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
                } text-charcoal-900`}
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
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-charcoal-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
                } text-charcoal-900`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 p-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-charcoal-600">
          <span>Already registered? </span>
          <Link
            to="/signin"
            className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
