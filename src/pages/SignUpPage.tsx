import React from 'react';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Logo } from '../components/common/Logo';
import { Anchor } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
        <Logo size="xl" />
        <div className="mt-3 flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
          <Anchor className="w-3.5 h-3.5 text-brand-500" />
          <span>Port & Terminal Operations Infrastructure</span>
        </div>
      </div>

      {/* Main Registration Form */}
      <SignUpForm />

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-charcoal-400">
        <p>IssueTrack Enterprise Prototype &bull; Designed for JSW Ports & Terminals</p>
      </div>
    </div>
  );
};
