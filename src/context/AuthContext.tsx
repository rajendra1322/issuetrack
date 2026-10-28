import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Department, TerminalId } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  signIn: (email: string, password?: string) => { success: boolean; error?: string };
  signUp: (
    name: string,
    email: string,
    department: Department,
    terminalId: TerminalId
  ) => { success: boolean; error?: string };
  quickSwitch: (userId: string) => void;
  signOut: () => void;
  updateProfile: (name: string, department: Department, terminalId: TerminalId) => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => authService.getAllUsers());

  useEffect(() => {
    // Sync current user and user list
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setAllUsers(authService.getAllUsers());
  }, []);

  const refreshUsers = () => {
    setAllUsers(authService.getAllUsers());
    setCurrentUser(authService.getCurrentUser());
  };

  const signIn = (email: string, password?: string) => {
    const res = authService.signIn(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const signUp = (
    name: string,
    email: string,
    department: Department,
    terminalId: TerminalId
  ) => {
    const res = authService.registerUser(name, email, department, terminalId);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAllUsers(authService.getAllUsers());
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const quickSwitch = (userId: string) => {
    const target = authService.quickSwitchUser(userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const signOut = () => {
    authService.signOut();
    setCurrentUser(null);
  };

  const updateProfile = (name: string, department: Department, terminalId: TerminalId) => {
    const updated = authService.updateProfile(name, department, terminalId);
    if (updated) {
      setCurrentUser(updated);
      setAllUsers(authService.getAllUsers());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        signIn,
        signUp,
        quickSwitch,
        signOut,
        updateProfile,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
