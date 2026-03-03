import React, { useState, useEffect } from "react";
import notificationApi from "@/api/notificationApi";
import { useAuth } from "@/context/AuthContext";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ArrowLeft, Bell, Clock, CheckCircle2, MessageSquare, Check, Trash2 } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.username;

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.get('');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Fetch history
    fetchNotifications();

    // 2. Connect to WebSocket for instant live updates
    const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        const newNotification = JSON.parse(message.body);
        
        // If this notification is for us, add it to the top of the list instantly!
        if (newNotification.username === username) {
          setNotifications(prev => [newNotification, ...prev]);
        }
      });
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [username]);

  const markAllAsRead = async () => {
    try {
      await notificationApi.put('/read-all');
      setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApi.put(`/${id}/read`);
      setNotifications(prev =>
        prev.map(item => item.id === id ? { ...item, read: true } : item)
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationApi.delete('/all');
      setNotifications([]);
    } catch (error) {
      console.error("Failed to delete all notifications", error);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation(); 
    try {
      await notificationApi.delete(`/${id}`);
      setNotifications(prev => prev.filter(item => item.id !== id)); 
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const getIcon = (message) => {
    if (message?.toLowerCase().includes("resolved")) {
      return { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-600 bg-green-50" };
    }
    return { icon: <MessageSquare className="h-5 w-5" />, color: "text-blue-600 bg-blue-50" };
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end border-b pb-6 border-slate-100">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 border-slate-200 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 mt-1">Stay updated with your latest ticket activity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-blue-600 hover:bg-blue-50 font-semibold">
              <Check className="h-4 w-4 mr-2" /> Mark all as read
            </Button>
          )}
          
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={deleteAllNotifications} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold">
              <Trash2 className="h-4 w-4 mr-2" /> Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading && notifications.length === 0 ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 w-full animate-pulse bg-slate-50/50" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Bell className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No new activity</h3>
            <p className="text-slate-400">You're all caught up for now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((item) => {
                const { icon, color } = getIcon(item.message);
                const isUnread = !item.read;

                return (
                  <div key={item.id} onClick={() => isUnread && markAsRead(item.id)} className={`relative flex items-start gap-4 p-5 transition-all cursor-pointer group ${isUnread ? "bg-blue-50/40 hover:bg-blue-50/70" : "bg-white hover:bg-slate-50"}`}>
                    <div className={`mt-0.5 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl shadow-sm border border-transparent ${color}`}>
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0 pr-10">
                      <div className="flex justify-between items-start gap-4">
                        <p className={`text-[15px] leading-relaxed ${isUnread ? "font-bold text-slate-900" : "text-slate-600"}`}>
                          {item.message}
                        </p>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                           {item.title?.includes('#') ? `Ticket #${item.title.split('#')[1]}` : 'Update'}
                         </span>
                         {isUnread && <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" />}
                      </div>
                    </div>

                    <button onClick={(e) => deleteNotification(item.id, e)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all" title="Delete notification">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;