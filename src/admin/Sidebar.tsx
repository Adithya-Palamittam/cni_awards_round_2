import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Star, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: <Home size={18} /> },
  { label: "Users", path: "/admin/users", icon: <Users size={18} /> },
  { label: "Ratings", path: "/admin/ratings", icon: <Star size={18} /> }
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed flex flex-col justify-between">
      {/* Top section */}
      <div>
        <div className="text-xl font-bold mb-8">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom logout button */}
      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-800"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
