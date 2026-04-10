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
import bcrypt from "bcryptjs";
import Course from "../src/database/models/Course.js";

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

// Trust proxy
app.set("trust proxy", true);

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    sucess:true,
    message:'api working correctly'
  });
});

// Debug middleware to log cookies
app.use("/auth", (req, res, next) => {
  console.log("[Auth] Request:", req.method, req.url);
  console.log("[Auth] Cookies:", req.headers.cookie);
  next();
});


app.use(
  "/auth",
  ExpressAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

            // Check if user has a password (might be OAuth-only user)
            if (!user.password) {
              console.log("User signed up with OAuth, no password set");
              return null;
            }

            // Compare hashed password
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) return null;

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
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

    callbacks: {
      async signIn({ user, account, profile }) {
        // Save user to database with default role
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
              role: "user", // Default role for new users
            });
            // Add role to the session user
            user.role = newUser.role;
            console.log("✅ New user saved to DB with role:", newUser.role);
          } else {
            // Add existing user's role to session
            user.role = existingUser.role;
            console.log("ℹ️ User already exists, role:", existingUser.role);
          }
        } catch (err) {
          console.error("❌ Error saving user:", err);
        }
        return true;
      },
      async redirect({ url, baseUrl }) {
        // If URL is relative, prepend base URL
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        // Allow callback URLs
        return url;
      },
      async jwt({ token, user, account, profile }) {
        // Add role to JWT when user signs in
        if (user) {
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        // Add role to session from JWT
        if (token?.role) {
          session.user.role = token.role;
        }
        return session;
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

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with default role
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "user", // Default role for new registered users
    });

    console.log("✅ New user registered:", email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get current user info (including role)
app.get("/api/user/me", async (req, res) => {
  try {
    // Get session from auth cookie
    const sessionCookie = req.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("authjs.session-token="));

    if (!sessionCookie) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Return basic info - the frontend should use /auth/session for full session
    return res.status(200).json({
      success: true,
      message: "Use /auth/session for session data",
    });
  } catch (error) {
    console.error("❌ Get user error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get all users (admin only - in production, add admin authentication)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email role provider createdAt");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("❌ Get users error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update user role (admin only - in production, add admin authentication)
app.patch("/api/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "intern", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be one of: user, intern, admin",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "name email role" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`✅ Updated user ${updatedUser.email} role to: ${role}`);

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update role error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Upgrade current user to intern (for payment flow)
app.post("/api/user/upgrade", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "intern" },
      { new: true, select: "name email role" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`✅ User ${updatedUser.email} upgraded to intern`);

    return res.status(200).json({
      success: true,
      message: "User upgraded to intern",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Upgrade error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ============================================
// COURSES API
// ============================================

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;

    let query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tag = tag;
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: courses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("❌ Get courses error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get single course
app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("❌ Get course error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Create new course
app.post("/api/courses", async (req, res) => {
  try {
    const { name, description, tag, videoSrc, thumbnail, instructor, duration } = req.body;

    // Validation
    if (!name || !description || !tag || !videoSrc || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Name, description, tag, videoSrc, and thumbnail are required",
      });
    }

    const newCourse = await Course.create({
      name,
      description,
      tag,
      videoSrc,
      thumbnail,
      instructor: instructor || "",
      duration: duration || "",
    });

    console.log("✅ New course created:", newCourse.name);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("❌ Create course error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update course
app.put("/api/courses/:id", async (req, res) => {
  try {
    const { name, description, tag, videoSrc, thumbnail, instructor, duration, isPublished } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        tag,
        videoSrc,
        thumbnail,
        instructor,
        duration,
        isPublished,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    console.log("✅ Course updated:", updatedCourse.name);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("❌ Update course error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    console.log("✅ Course deleted:", course.name);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete course error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get all tags
app.get("/api/courses/tags/all", async (req, res) => {
  try {
    const tags = await Course.distinct("tag");
    return res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error("❌ Get tags error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Auth server running on http://localhost:${PORT}`),
);