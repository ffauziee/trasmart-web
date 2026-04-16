"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth, UserProfile } from "@/hooks/useAuth";

//Update interface
interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  updateUser: (updatedUser: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  //Gunakan useAuth hook untuk dapat data real dari Supabase
  const {
    userProfile,
    loading,
    error,
    isAuthenticated,
    updateProfile,
    signOut,
  } = useAuth();

  return (
    <UserContext.Provider
      value={{
        user: userProfile,
        loading,
        error,
        isAuthenticated,
        updateUser: updateProfile, // ✅ Wrapper untuk consistency
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
export type { UserContextType };
