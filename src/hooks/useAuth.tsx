import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  role?: 'student' | 'teacher';
  active_role: 'student' | 'teacher';
  available_roles: ('student' | 'teacher')[];
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  switchRole: (newRole: 'student' | 'teacher') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, we'll let the dashboard handle it
        // But still set profile to null so user can access the app
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user, they may need to complete setup');
          setProfile(null);
          return;
        }
        throw error;
      }
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid recursive calls
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      // Create profile immediately after successful signup
      if (data.user && data.session) {
        console.log('Creating profile for user:', data.user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email,
            active_role: 'student',
            available_roles: ['student', 'teacher'],
            full_name: fullName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(`Failed to create profile: ${profileError.message}`);
        }

        console.log('Profile created successfully');
        
        // Fetch the created profile to update state
        setTimeout(() => {
          fetchProfile(data.user.id);
        }, 100);
      }

      toast({
        title: "Account created!",
        description: data.session ? 
          "Welcome! You can switch between student and teacher roles anytime." :
          "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const switchRole = async (newRole: 'student' | 'teacher') => {
    if (!user || !profile) {
      return { error: new Error('User must be logged in to switch roles') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile({ ...profile, active_role: newRole });
      
      toast({
        title: "Role switched!",
        description: `Now viewing as ${newRole}`,
      });

      return { error: null };
    } catch (error) {
      toast({
        title: "Role switch failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};