import express from "express";
import cors from "cors";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import Credentials from "@auth/express/providers/credentials";
import "dotenv/config";
import User from "../src/database/models/User.js";
import { connectDB } from "../src/database/db.js";
import { fetch, Agent } from "undici";
import intern from "../src/database/models/intern.js";

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

app.use(express.json());
app.set("trust proxy", true);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.json({
    sucess:true,
    message:'api working correctly'
  });
});


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
        checks: ["none"],
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
        if (url.startsWith("http://localhost:5173")) return url;
        return "http://localhost:5173";
      },
    },

    cookies: {
      pkceCodeVerifier: {
        name: "authjs.pkce.code_verifier",
        options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
      },
      state: {
        name: "authjs.state",
        options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
      },
      sessionToken: {
        name: "authjs.session-token",
        options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
      },
    },
  }),
);

app.post("/api/students", async (req, res) => {
  try {
    const { name, email, role, github, project } = req.body;

    // ✅ 1. Validation
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required",
      });
    }

    // ✅ 2. Email format check (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ 3. Check if student already exists
    const existingStudent = await intern.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Intern with this email already exists",
      });
    }

    // ✅ 4. Create student
    const newStudent = await intern.create({
      name,
      email,
      role,
      github,
      // project,
    });

    // ✅ 5. Success response
    return res.status(201).json({
      success: true,
      message: "Intern created successfully",
      data: newStudent,
    });

  } catch (error) {
    console.error("❌ Create student error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/api/students", async (req, res) => {
  
  try{
    const allStudents = await intern.find();

    return res.status(200).json({
      success: true,
      data: allStudents,
    });

  }catch(error){
    throw new Error("Failed to fetch students");
    console.log(error);
  }
});

app.get("/api/students/:id", async (req, res) => {
  
  try{
    const student = await intern.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Intern not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });

  }catch(error){
    throw new Error("Failed to fetch students");
    console.log(error);
  }
});

app.delete("/api/students/:id", async (req, res) => {
  
  try{
  const student = await intern.findByIdAndDelete(req.params.id);

  if (!student) {
    return res.status(404).json({
    success: false,
    message: "Intern not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Intern deleted successfully",
    data: student,
  });

  }catch(error){
  console.error("❌ Delete student error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
  }
});

app.listen(PORT, "127.0.0.1", () =>
  console.log(`✅ Auth server running on http://127.0.0.1:${PORT}`),
);