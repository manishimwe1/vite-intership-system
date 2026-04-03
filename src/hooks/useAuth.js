import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";
const REDIRECT_URL = import.meta.env.VITE_AUTH_REDIRECT_URL;

export function useAuth() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/session`, {
          credentials: "include",
        });
        const data = await res.json();
        setSession(data?.user ?? null);
      } catch (error) {
        setSession(null);
      }
    };
    loadSession();
  }, []);

  const signInWithGoogle = async () => {
  try {
    // ✅ Use /auth (Vite proxy) not http://localhost:3000
    const csrfRes = await fetch("/auth/csrf", {
      credentials: "include",
    });
    const { csrfToken } = await csrfRes.json();
    console.log("CSRF token:", csrfToken);

    const form = document.createElement("form");
    form.method = "POST";
    // ✅ POST through the proxy too
    form.action = "/auth/signin/google";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfToken";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    const callbackInput = document.createElement("input");
    callbackInput.type = "hidden";
    callbackInput.name = "callbackUrl";
    callbackInput.value = "http://localhost:5173";
    form.appendChild(callbackInput);

    document.body.appendChild(form);
    form.submit();
  } catch (err) {
    console.error("❌ signInWithGoogle error:", err);
  }
};

  const signInWithEmail = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/callback/credentials`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        password,
        callbackUrl: REDIRECT_URL,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setSession(data?.user ?? null);
      window.location.href = REDIRECT_URL; 
    }

    return res;
  };

  
  const signOut = () => {
    window.location.href = `${API_URL}/auth/signout?callbackUrl=${REDIRECT_URL}`;
  };

  return {
    user: session,
    loading: session === undefined,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };
}