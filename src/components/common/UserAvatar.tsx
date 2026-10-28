import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  department?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 'md',
  department,
  className = '',
}) => {
  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base font-semibold',
    lg: 'w-12 h-12 text-lg font-bold',
    xl: 'w-16 h-16 text-2xl font-bold',
  };

  // Assign deterministic pleasant background based on initial
  const colorMap: Record<string, string> = {
    A: 'bg-blue-600 text-white',
    B: 'bg-indigo-600 text-white',
    C: 'bg-cyan-600 text-white',
    D: 'bg-emerald-600 text-white',
    E: 'bg-teal-600 text-white',
    F: 'bg-violet-600 text-white',
    G: 'bg-amber-600 text-white',
    H: 'bg-rose-600 text-white',
    I: 'bg-sky-600 text-white',
    J: 'bg-blue-700 text-white',
    K: 'bg-purple-600 text-white',
    L: 'bg-indigo-700 text-white',
    M: 'bg-pink-600 text-white',
    N: 'bg-teal-700 text-white',
    O: 'bg-orange-600 text-white',
    P: 'bg-sky-700 text-white',
    Q: 'bg-slate-700 text-white',
    R: 'bg-brand-600 text-white',
    S: 'bg-emerald-700 text-white',
    T: 'bg-cyan-700 text-white',
    U: 'bg-gray-700 text-white',
    V: 'bg-purple-700 text-white',
    W: 'bg-blue-800 text-white',
    X: 'bg-slate-800 text-white',
    Y: 'bg-amber-700 text-white',
    Z: 'bg-rose-700 text-white',
  };

  const bgColor = colorMap[initial] || 'bg-brand-600 text-white';

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium shadow-sm transition-transform select-none ${sizeClasses[size]} ${bgColor} ${className}`}
      title={department ? `${name} (${department})` : name}
    >
      {initial}
    </div>
  );
};
