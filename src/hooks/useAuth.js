import { useState, useEffect, useCallback } from "react";

const REDIRECT_URL = "http://localhost:5173";

export function useAuth() {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/auth/session", {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Session fetch failed:", res.status);
        setSession(null);
        return;
      }

      const data = await res.json();
      console.log("Session data:", data);

      if (data?.user) {
        // Ensure user has a role (fallback to 'user' if not set)
        const userWithRole = {
          ...data.user,
          role: data.user.role || "user",
        };
        setSession(userWithRole);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("❌ Failed to load session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Re-check session when window gains focus (after OAuth redirect)
  useEffect(() => {
    const handleFocus = () => {
      loadSession();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadSession]);

  const signInWithGoogle = async () => {
    try {
      // Get CSRF token
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });

      if (!csrfRes.ok) {
        console.error("Failed to get CSRF token:", csrfRes.status);
        return;
      }

      const { csrfToken } = await csrfRes.json();

      // Build the form and submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/auth/signin/google";

      // CSRF Token
      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);

      // Callback URL - use the correct redirect URL
      const callbackInput = document.createElement("input");
      callbackInput.type = "hidden";
      callbackInput.name = "callbackUrl";
      callbackInput.value = REDIRECT_URL;
      form.appendChild(callbackInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("❌ signInWithGoogle error:", err);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      // Step 1: get CSRF token first (required by auth.js for POST)
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });

      if (!csrfRes.ok) {
        console.error("Failed to get CSRF token:", csrfRes.status);
        return { ok: false, error: "Failed to get CSRF token" };
      }

      const { csrfToken } = await csrfRes.json();

      // Step 2: POST to signin/credentials
      const res = await fetch("/auth/signin/credentials", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl: REDIRECT_URL,
          redirect: "false",
        }),
      });

      if (res.ok) {
        // Step 3: re-fetch session to update state
        await loadSession();
        return { ok: true };
      }

      return { ok: false, error: "Invalid credentials" };
    } catch (err) {
      console.error("❌ signInWithEmail error:", err);
      return { ok: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });

      if (!csrfRes.ok) {
        console.error("Failed to get CSRF token for signout");
        setSession(null);
        window.location.href = "/signin";
        return;
      }

      const { csrfToken } = await csrfRes.json();

      // POST signout with CSRF token
      const res = await fetch("/auth/signout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          csrfToken,
          callbackUrl: "http://localhost:5173",
        }),
      });

      // Clear session state
      setSession(null);

      // Navigate to signin page
      window.location.href = "/signin";
    } catch (err) {
      console.error("❌ signOut error:", err);
      setSession(null);
      window.location.href = "/signin";
    }
  };

  return {
    user: session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    refreshSession: loadSession,
  };
}