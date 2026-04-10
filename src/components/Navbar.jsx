import { Bell, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// Role badge colors
const roleColors = {
  user: "bg-gray-100 text-gray-600",
  intern: "bg-blue-100 text-blue-600",
  admin: "bg-purple-100 text-purple-600",
};

const NavBar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="p-6 sticky w-full z-10 bg-white">
      <nav className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="border border-slate-300 flex-1 max-w-md rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full border border-slate-300 hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2 rounded-full border border-slate-300 hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* User section */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role badge */}
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                  roleColors[user.role || "user"]
                }`}
              >
                {user.role || "user"}
              </span>

              {/* User info */}
              <div className="flex items-center gap-2">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </span>
              </div>

              {/* Sign out */}
              <button
                onClick={signOut}
                className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Loading...</span>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
