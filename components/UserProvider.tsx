"use client";

import { Profile } from "@/types";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, ReactNode } from "react";

interface UserState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  supabase: SupabaseClient;
}

const safeStubClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
} as unknown as SupabaseClient;

const UserContext = createContext<UserState | undefined>(undefined);

export function UserProvider({
  children,
  user,
  profile,
}: {
  children: ReactNode;
  user: User | null;
  profile: Profile | null;
}) {
  const isAdmin = profile?.role === "system_admin";

  return (
    <UserContext.Provider value={{ user, profile, isAdmin, supabase: safeStubClient }}>
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
