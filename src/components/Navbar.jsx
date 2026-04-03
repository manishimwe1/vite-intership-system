import { Bell, Mail, MessageSquare, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { user } = useAuth();
  console.log({user});
  
  return (
    <header className="p-6 sticky w-full z-10">
      <nav className="flex items-center justify-between gap-2">
        <div className="border border-slate-400 flex-1 rounded-full">
          <input className=" " />
        </div>
        <div className="flex items-center justify-around gap-2">
          <div className="p-2 rounded-full border border-slate-400">
            <Mail className="size-3" />
          </div>
          <div className="p-2 rounded-full border border-slate-400">
            <Bell className="size-3" />
          </div>
        </div>
        <div>
          {/* {user ? (
            <div className="flex items-center gap-2">
              <p>{user.name || user.email}</p>
              <button onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in</button>
          )} */}
          user
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
