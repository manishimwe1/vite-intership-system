import { getSession } from "@auth/express";
import { useState, useEffect } from "react";

const REDIRECT_URL = import.meta.env.VITE_AUTH_REDIRECT_URL || "http://localhost:5173/dashboard";

export function useAuth() {
  const [session, setSession] = useState(undefined);
  const data = getSession();
  console.log(data);
  
  useEffect(() => {
    const loadSession = async () => {
      try {
        // ✅ Relative path — cookie is sent because same origin as frontend
        const res = await fetch("/auth/session", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Session data:", data);
        setSession(data?.user ?? null);
      } catch (error) {
        console.error("❌ Failed to load session:", error);
        setSession(null);
      }
    };
    loadSession();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/auth/signin/google";

      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);

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
      // ✅ Step 1: get CSRF token first (required by auth.js for POST)
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();

      // ✅ Step 2: POST to signin/credentials (not callback/credentials)
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
          redirect: "false", // ✅ prevent server-side redirect so we control navigation
        }),
      });

      if (res.ok) {
        // ✅ Step 3: re-fetch session to update state
        const sessionRes = await fetch("/auth/session", {
          credentials: "include",
        });
        const data = await sessionRes.json();
        setSession(data?.user ?? null);
      }

      return res;
    } catch (err) {
      console.error("❌ signInWithEmail error:", err);
      return { ok: false };
    }
  };

  const signOut = async () => {
    try {
      const csrfRes = await fetch("/auth/csrf", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();

      // ✅ POST signout with CSRF token
      await fetch("/auth/signout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          csrfToken,
          callbackUrl: "http://localhost:5173",
        }),
      });

      setSession(null);
      window.location.href = "/signin";
    } catch (err) {
      console.error("❌ signOut error:", err);
    }
  };

  return {
    user: session,
    loading: session === undefined,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };
}