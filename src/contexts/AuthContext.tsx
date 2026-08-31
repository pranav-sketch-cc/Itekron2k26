import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{
    data: any;
    error: any;
  }>;

  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: any;
  }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: any;
  }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('GET SESSION ERROR:', error);
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('SESSION LOAD ERROR:', error);

        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * SIGN UP
   *
   * This is the function that was missing from the old
   * AuthContext and caused:
   *
   * "n is not a function"
   *
   * We use Supabase Auth directly.
   */
  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = fullName?.trim() || '';

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        console.error('SUPABASE SIGNUP ERROR:', error);
      }

      return {
        data,
        error,
      };
    } catch (error) {
      console.error('SIGNUP EXCEPTION:', error);

      return {
        data: null,
        error,
      };
    }
  };

  /*
   * SIGN IN
   */
  const signInWithPassword = async (
    email: string,
    password: string
  ) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        console.error('SUPABASE SIGNIN ERROR:', error);
      }

      return {
        data,
        error,
      };
    } catch (error) {
      console.error('SIGNIN EXCEPTION:', error);

      return {
        data: null,
        error,
      };
    }
  };

  /*
   * Backwards-compatible alias.
   */
  const signIn = signInWithPassword;

  /*
   * SIGN OUT
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('SUPABASE SIGNOUT ERROR:', error);
        throw error;
      }

      setUser(null);
    } catch (error) {
      console.error('SIGNOUT EXCEPTION:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        signUp,

        signInWithPassword,
        signIn,

        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};