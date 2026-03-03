import React, { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightCircle,
  Sparkles,
  BrainCircuit,
  Tags,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TicketDetails = ({ isAdmin = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/tickets/${id}`);

        if (typeof response.data === "object" && response.data !== null) {
          setTicket(response.data);
        } else {
          setError("Invalid data received from server.");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p>Loading ticket details...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  if (!ticket)
    return (
      <div className="p-10 text-center text-slate-500">
        Ticket not found
      </div>
    );

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "bg-slate-100 text-slate-500 border-slate-200";
    const s = String(sentiment).toLowerCase();
    if (s.includes("angry") || s.includes("frustrated") || s.includes("negative"))
      return "bg-red-50 text-red-700 border-red-200";
    if (s.includes("happy") || s.includes("positive"))
      return "bg-green-50 text-green-700 border-green-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- Navigation --- */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-slate-900 flex items-center gap-1 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-900">
          Ticket #{ticket.id}
        </span>
      </div>

      {/* --- Layout Grid --- */}
      <div className={`grid grid-cols-1 ${isAdmin ? "lg:grid-cols-3" : ""} gap-8`}>

        {/* ================= LEFT SIDE (MAIN CONTENT) ================= */}
        <div className={isAdmin ? "lg:col-span-2 space-y-6" : "space-y-6"}>

          <Card className="border shadow-sm">
            <CardContent className="p-8 space-y-6">

              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="font-mono bg-slate-100 px-3 py-1 rounded-md border">
                    #{ticket.id}
                  </span>

                  <Badge
                    className={`px-3 py-1 text-xs font-semibold ${
                      ticket.status === "OPEN"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {ticket.status === "OPEN" ? "Open" : "Closed"}
                  </Badge>

                  {/* ADMIN ONLY: Opened By */}
                  {isAdmin && (
                     <div className="flex items-center gap-1.5 text-slate-500 ml-auto bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Clock className="h-3.5 w-3.5" />
                        <span>By {ticket?.username || 'User'}</span>
                     </div>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 leading-snug">
                  {ticket.title}
                </h1>

                {ticket.createdAt && (
                  <div className="text-xs text-slate-400">
                    Created on {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-6 border-t">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Discussion Section */}
          <Card className="border shadow-sm">
             <CardHeader className="pb-3 bg-slate-50/50 rounded-t-xl">
               <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                   Discussion
                   <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">0</span>
               </h3>
             </CardHeader>
             <Separator />
             <CardContent className="py-12 text-center">
                <div className="bg-slate-50 inline-block p-4 rounded-full mb-3 border border-slate-100">
                   <LayoutDashboard className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Chat functionality coming soon...</p>
             </CardContent>
          </Card>

        </div>

        {/* ================= RIGHT SIDE (ADMIN SIDEBAR ) ================= */}
        {isAdmin && (ticket.priority || ticket.aiSummary || ticket.sentiment) && (
          <div className="space-y-6">
            
            <Card className="border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white shadow-sm relative overflow-hidden">
                {/* Subtle background icon */}
                <div className="absolute top-2 right-2 text-indigo-100 pointer-events-none">
                    <BrainCircuit className="h-24 w-24 opacity-20" />
                </div>
                
                <CardHeader className="pb-3 relative z-10 border-b border-indigo-50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    AI Ticket Analysis
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-5 space-y-6 relative z-10">

                  {/* Metadata Row (Priority, Sentiment, Category) */}
                  <div className="grid grid-cols-2 gap-4">
                      
                      {/* Priority */}
                      {ticket.priority && (
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                                <Activity className="h-3.5 w-3.5" /> Priority
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                {ticket.priority === "HIGH" && <ArrowUpCircle className="h-4 w-4 text-red-500" />}
                                {ticket.priority === "MEDIUM" && <ArrowRightCircle className="h-4 w-4 text-orange-500" />}
                                {ticket.priority === "LOW" && <ArrowDownCircle className="h-4 w-4 text-blue-500" />}
                                {ticket.priority}
                            </div>
                        </div>
                      )}

                      {/* Sentiment */}
                      {ticket.sentiment && (
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                                <BrainCircuit className="h-3.5 w-3.5" /> Mood
                            </div>
                            <Badge variant="secondary" className={`px-2 py-0.5 text-xs font-semibold border ${getSentimentColor(ticket.sentiment)}`}>
                                {ticket.sentiment}
                            </Badge>
                        </div>
                      )}

                      {/* Category */}
                      {ticket.category && (
                        <div className="col-span-2 bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Tags className="h-3.5 w-3.5" /> Category
                            </div>
                            <div className="font-medium text-sm text-slate-900">
                                {ticket.category}
                            </div>
                        </div>
                      )}
                  </div>
                  
                  <Separator className="bg-indigo-50" />

                  {/* AI Summary */}
                  {ticket.aiSummary && (
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Auto-Summary
                      </h4>
                      <div className="bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100 text-sm text-indigo-950 leading-relaxed font-medium">
                        {ticket.aiSummary}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default TicketDetails;