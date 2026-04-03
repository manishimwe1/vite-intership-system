

import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    link: "/",
    active: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="eee">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Student",
    link: "/student",
    active: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    label: "Inbox",
    link: "/inbox",

    active: false,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Lesson",
    link: "/lesson",

    active: false,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="9" x2="21" y2="9" />
        <line x1="15" y1="15" x2="21" y2="15" />
      </svg>
    ),
  },
  {
    label: "Task",
    link: "/task",

    active: false,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <polyline points="9,11 12,14 22,4" />
        <line x1="3" y1="8" x2="21" y2="8" />
      </svg>
    ),
  },
 
];

const SideBar = () => {
  const pathname = useLocation();

  return (
    <div className="w-[220px] h-screen bg-white flex flex-col px-5 py-6 border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[18px] font-bold text-gray-900 tracking-tight">
          Coursue
        </span>
      </div>

      {/* Overview Section */}
      <div className="mb-2">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Overview
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              to={item.link}
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left
                ${
                  item.link === pathname.pathname
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <span className={item.active ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;