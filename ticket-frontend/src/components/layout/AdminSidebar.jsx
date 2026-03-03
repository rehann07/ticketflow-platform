import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  BrainCircuit,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const username = user?.username || "Admin";

  const isActive = (path) => location.pathname === path;
  const isUsersActive = () => location.pathname.startsWith("/admin/users");
  const isSettingsActive = () => location.pathname.startsWith("/admin/settings");

  return (
    <aside className="w-64 border-r bg-white hidden md:flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      
      {/* Profile Section */}
      <div className="p-8 pb-6 text-center border-b border-slate-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-20 w-20 mb-3 shadow-md border-2 border-white bg-slate-100">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`}
              />
              <AvatarFallback>
                {username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full border-2 border-white shadow-sm">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
          </div>

          <h3 className="font-semibold text-lg text-slate-900">
            {username}
          </h3>

          <Badge
            variant="outline"
            className="mt-2 bg-indigo-50 text-indigo-700 border-indigo-200 uppercase tracking-widest text-[9px] font-bold"
          >
            System Admin
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-6">
        
        {/* Dashboard */}
        <Button
          variant={isActive("/admin") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 ${
            isActive("/admin")
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => navigate("/admin")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Button>

        {/* Users */}
        <Button
          variant={isUsersActive() ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 ${
            isUsersActive()
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => navigate("/admin/users")}
        >
          <Users size={18} />
          User Management
        </Button>

        {/* Settings */}
        <Button
          variant={isSettingsActive() ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 ${
            isSettingsActive()
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => navigate("/admin/settings")}
        >
          <SettingsIcon size={18} />
          Settings
        </Button>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
