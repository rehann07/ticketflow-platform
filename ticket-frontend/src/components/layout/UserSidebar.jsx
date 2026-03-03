import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import notificationApi from "@/api/notificationApi";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Ticket,
  Bell,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const username = user?.username || "User";

  const isActive = (path) => location.pathname === path;
  const isTicketsActive = () => location.pathname.startsWith("/dashboard/tickets");
  const isNotificationsActive = () => location.pathname.startsWith("/dashboard/notifications");
  const isSettingsActive = () => location.pathname.startsWith("/dashboard/settings");

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.get("");
      const unread = response.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    // 1. Fetch initially
    fetchUnreadCount();

    // 2. Connect to WebSocket for instant updates
    const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL); // Matches your Spring Boot Config
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Hides debug logs in console

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        const newNotification = JSON.parse(message.body);
        
        // If the notification belongs to this user, increment the badge instantly
        if (newNotification.username === username && !newNotification.read) {
          setUnreadCount((prev) => prev + 1);
        }
      });
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [username]);

  return (
    <aside className="w-64 border-r bg-slate-50/50 hidden md:flex flex-col h-screen sticky top-0">
      
      {/* Profile Section */}
      <div className="p-8 pb-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4 shadow-sm border-2 border-white">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} />
            <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg text-slate-900">Hello, {username}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Free Plan Member</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => navigate("/dashboard")}>
          <LayoutDashboard size={18} /> Dashboard
        </Button>

        <Button variant={isTicketsActive() ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => navigate("/dashboard/tickets")}>
          <Ticket size={18} /> My Tickets
        </Button>

        <Button variant={isNotificationsActive() ? "secondary" : "ghost"} className="w-full justify-between gap-3 group" onClick={() => { setUnreadCount(0); navigate("/dashboard/notifications"); }}>
          <div className="flex items-center gap-3">
            <Bell size={18} /> Notifications
          </div>
          
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm transition-all group-hover:scale-110">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto space-y-2 border-t">
        <Button variant={isSettingsActive() ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => navigate("/dashboard/settings")}>
          <SettingsIcon size={18} /> Settings
        </Button>

        <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50" onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default UserSidebar;