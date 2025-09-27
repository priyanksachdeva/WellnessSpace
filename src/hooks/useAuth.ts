import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInLoading: boolean;
  signUpLoading: boolean;
  signOutLoading: boolean;
}

interface AuthResult {
  success: boolean;
  error: AuthError | Error | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    signInLoading: false,
    signUpLoading: false,
    signOutLoading: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const initializeAuth = async (retryCount = 0) => {
      try {
        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setAuthState((prev) => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
          }));

          // Sync user profile when user signs in
          if (event === "SIGNED_IN" && session?.user) {
            await syncUserProfile(session.user);
          }
        });

        // Get initial session with retry logic
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (retryCount < 3) {
            retryTimeout = setTimeout(() => {
              initializeAuth(retryCount + 1);
            }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
            return;
          }
        }

        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));

        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    const cleanup = initializeAuth();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      cleanup?.then((unsub) => unsub?.());
    };
  }, []);

  const syncUserProfile = async (user: User, retryCount = 0): Promise<void> => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: user.id,
          display_name: user.user_metadata?.display_name || "Anonymous User",
          is_anonymous: false,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          if (retryCount < 2) {
            setTimeout(() => syncUserProfile(user, retryCount + 1), 1000);
          }
        }
      }
    } catch (error) {
      console.error("Error syncing user profile:", error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult> => {
    setAuthState((prev) => ({ ...prev, signUpLoading: true }));

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName || "Anonymous User",
          },
        },
      });

      if (error) {
        let errorMessage = "Failed to create account. Please try again.";

        if (error.message.includes("already registered")) {
          errorMessage =
            "This email is already registered. Try signing in instead.";
        } else if (error.message.includes("invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        }

        toast({
          title: "Sign Up Error",
          description: errorMessage,
          variant: "destructive",
        });

        return { success: false, error };
      }

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });

      return { success: true, error: null };
    } catch (error) {
      const err = error as Error;
      console.error("Sign up error:", err);

      toast({
        title: "Network Error",
        description:
          "Unable to create account. Please check your connection and try again.",
        variant: "destructive",
      });

      return { success: false, error: err };
    } finally {
      setAuthState((prev) => ({ ...prev, signUpLoading: false }));
    }
  };

  const signIn = async (
    email: string,
    password: string,
    retryCount = 0
  ): Promise<AuthResult> => {
    setAuthState((prev) => ({ ...prev, signInLoading: true }));

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Failed to sign in. Please check your credentials.";

        if (error.message.includes("invalid_credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("email_not_confirmed")) {
          errorMessage =
            "Please check your email and confirm your account first.";
        } else if (error.message.includes("too_many_requests")) {
          errorMessage = "Too many attempts. Please wait before trying again.";
        }

        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });

        return { success: false, error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { success: true, error: null };
    } catch (error) {
      const err = error as Error;
      console.error("Sign in error:", err);

      // Retry logic for network errors
      if (err.message.includes("network") && retryCount < 2) {
        setTimeout(() => signIn(email, password, retryCount + 1), 1000);
        return { success: false, error: err };
      }

      toast({
        title: "Connection Error",
        description:
          "Unable to sign in. Please check your connection and try again.",
        variant: "destructive",
      });

      return { success: false, error: err };
    } finally {
      setAuthState((prev) => ({ ...prev, signInLoading: false }));
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    setAuthState((prev) => ({ ...prev, signOutLoading: true }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign Out Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        return { success: false, error };
      }

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      return { success: true, error: null };
    } catch (error) {
      const err = error as Error;
      console.error("Sign out error:", err);

      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: err };
    } finally {
      setAuthState((prev) => ({ ...prev, signOutLoading: false }));
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signInLoading: authState.signInLoading,
    signUpLoading: authState.signUpLoading,
    signOutLoading: authState.signOutLoading,
    signUp,
    signIn,
    signOut,
    syncUserProfile,
  };
};
