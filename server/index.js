import express from "express";
import cors from "cors";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import Credentials from "@auth/express/providers/credentials";
import "dotenv/config";
import User from "../src/database/models/User.js";
import { connectDB } from "../src/database/db.js";
import { fetch, Agent } from "undici";

// ✅ Custom fetch with longer timeout
const customFetch = (url, options) => {
  return fetch(url, {
    ...options,
    dispatcher: new Agent({
      connectTimeout: 30000,
      headersTimeout: 30000,
      bodyTimeout: 30000,
    }),
  });
};

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set("trust proxy", true);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  "/auth",
  ExpressAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          url: "https://accounts.google.com/o/oauth2/v2/auth",
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
        token: "https://oauth2.googleapis.com/token",
        userinfo: "https://www.googleapis.com/oauth2/v3/userinfo",
        issuer: "https://accounts.google.com",
        checks: ["none"], // ✅ disable pkce + state checks
        [Symbol.for("auth.js.custom-fetch")]: customFetch,
      }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const user = await User.findOne({ email: credentials.email });
            if (!user) return null;
            const isValid = credentials.password === user.password;
            if (!isValid) return null;
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } catch (err) {
            console.error("❌ Credentials auth error:", err);
            return null;
          }
        },
      }),
    ],

    secret: process.env.AUTH_SECRET,
    trustHost: true,

    events: {
      async signIn({ user, account }) {
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
            });
            console.log("✅ New user saved to DB");
          } else {
            console.log("ℹ️ User already exists");
          }
        } catch (err) {
          console.error("❌ Error saving user:", err);
        }
      },
    },
    pages: {
      signIn: "http://localhost:5173/signin",
    },

    callbacks: {
      async redirect({ url }) {
        // Allow any localhost:5173 URL through
        if (url.startsWith("http://localhost:5173")) return url;
        return "http://localhost:5173";
      },
    },
    cookies: {
      pkceCodeVerifier: {
        name: "authjs.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false, // ✅ false for localhost
          domain: "localhost",
        },
      },
      state: {
        name: "authjs.state",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false,
          domain: "localhost",
        },
      },
      sessionToken: {
        name: "authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false,
          domain: "localhost",
        },
      },
    },

    trustHost: true,
  }),
);

app.listen(PORT, "127.0.0.1", () =>
  console.log(`Auth server running on :${PORT}`),
);
