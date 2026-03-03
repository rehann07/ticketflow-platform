import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";

import {
  Sparkles,
  Search,
  Inbox,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const AdminDashboardHome = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/admin/tickets");
      setTickets(res.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (id) => {
    navigate(`/admin/tickets/${id}`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/${id}/status?status=${newStatus}`, null);
      fetchTickets();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };
  const handleDeleteTicket = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/tickets/${id}`);
      fetchTickets(); // refresh table after delete
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredTickets = tickets.filter((t) => {

    const matchesSearch =
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" ||
      t.status?.toUpperCase() === statusFilter.toUpperCase();

    const matchesSentiment =
      sentimentFilter === "ALL" ||
      t.sentiment?.toUpperCase() === sentimentFilter.toUpperCase();

    const matchesCategory =
      categoryFilter === "ALL" ||
      t.category?.toUpperCase() === categoryFilter.toUpperCase();

    const matchesPriority =
      priorityFilter === "ALL" ||
      t.priority?.toUpperCase() === priorityFilter.toUpperCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSentiment &&
      matchesCategory &&
      matchesPriority
    );
  });

  // 1. Sort the filtered tickets so the newest (highest ID) are at the top
  const sortedTickets = [...filteredTickets].sort((a, b) => b.id - a.id);

  // 2. Do the pagination math on the SORTED tickets
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTickets.length / ticketsPerPage)
  );

  const pendingCount = tickets.filter((t) => t.status === "OPEN").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const sentimentCounts = tickets.reduce(
    (acc, ticket) => {
      const s = ticket.sentiment?.toUpperCase() || "NEUTRAL";
      if (s === "ANGRY") acc.angry++;
      else if (s === "FRUSTRATED") acc.frustrated++;
      else if (s === "POSITIVE") acc.positive++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, frustrated: 0, angry: 0 }
  );

  const sentimentChartData = [
    { name: "Positive", value: sentimentCounts.positive, color: "#22c55e" },
    { name: "Neutral", value: sentimentCounts.neutral, color: "#94a3b8" },
    { name: "Frustrated", value: sentimentCounts.frustrated, color: "#f97316" },
    { name: "Angry", value: sentimentCounts.angry, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // STATUS CHART DATA
  const statusChartData = [
    { name: "Open", value: pendingCount },
    { name: "Resolved", value: resolvedCount },
  ];

  // CATEGORY CHART DATA
  const categoryCounts = tickets.reduce((acc, ticket) => {
    const cat = ticket.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  // PRIORITY CHART DATA
  const priorityCounts = tickets.reduce(
    (acc, ticket) => {
      const p = ticket.priority?.toUpperCase() || "LOW";
      if (p === "HIGH") acc.high++;
      else if (p === "MEDIUM") acc.medium++;
      else acc.low++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const priorityChartData = [
    { name: "High", value: priorityCounts.high, color: "#ef4444" },
    { name: "Medium", value: priorityCounts.medium, color: "#f97316" },
    { name: "Low", value: priorityCounts.low, color: "#3b82f6" },
  ].filter(d => d.value > 0);

  const categoryChartData = Object.keys(categoryCounts).map((key) => ({
    name: key,
    value: categoryCounts[key],
  }));
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "bg-slate-100 text-slate-500 border-slate-200";
    const s = sentiment.toUpperCase();
    if (s === "ANGRY") return "bg-red-100 text-red-700 border-red-200";
    if (s === "FRUSTRATED") return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "POSITIVE") return "bg-green-100 text-green-700 border-green-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, sentimentFilter, priorityFilter]);
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <p className="text-slate-500">
              Real-time AI insights and system monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* STATS & VISUALS */}
      <div className="space-y-6">

        {/* SMALL CLEAN STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-slate-500 font-semibold">Open Tickets</p>
              <p className="text-2xl font-bold mt-1">{pendingCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-slate-500 font-semibold">Resolved</p>
              <p className="text-2xl font-bold mt-1">{resolvedCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-slate-500 font-semibold">Total Tickets</p>
              <p className="text-2xl font-bold mt-1">{tickets.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* STATUS BAR CHART */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-4">Ticket Status</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CATEGORY BAR CHART */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-4">Categories</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SENTIMENT DONUT */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-4">AI Sentiment</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={sentimentChartData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {sentimentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* PRIORITY DONUT */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-4">Ticket Priority</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={priorityChartData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* TABLE CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

        {/* SEARCH */}
        <div className="relative w-full lg:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2">

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* CATEGORY FILTER */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing</option>
            <option value="ACCOUNT">Account</option>
            <option value="FEATURE">Feature</option>
          </select>

          {/* PRIORITY FILTER */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* SENTIMENT FILTER */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Sentiment</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="FRUSTRATED">Frustrated</option>
            <option value="ANGRY">Angry</option>
          </select>

          {/* RESET BUTTON */}
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("ALL");
              setCategoryFilter("ALL");
              setPriorityFilter("ALL");
              setSentimentFilter("ALL");
              setSearchTerm("");
            }}
          >
            Reset
          </Button>

        </div>
      </div>
      <p className="text-sm text-slate-500">
        Showing {filteredTickets.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, filteredTickets.length)} of {filteredTickets.length} tickets
      </p>
      {/* TICKETS TABLE */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[120px]">Priority</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                  <div className="flex justify-center mb-2">
                    <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  Loading tickets...
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                  <Inbox className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-medium text-slate-900">No tickets found</p>
                </TableCell>
              </TableRow>
            )}

            {!loading && currentTickets.map((t) => (
              <TableRow
                key={t.id}
                onClick={() => handleViewTicket(t.id)}
                className="cursor-pointer hover:bg-slate-50 transition"
              >
                <TableCell className="font-mono text-xs text-slate-500 pt-5 align-top">
                  #{t.id}
                </TableCell>

                <TableCell className="py-4">
                  <div className="font-semibold text-slate-900">
                    {t.title}
                  </div>

                  {t.sentiment && (
                    <Badge
                      variant="outline"
                      className={`mt-1.5 text-[10px] px-1.5 py-0 uppercase font-bold tracking-wider ${getSentimentColor(t.sentiment)}`}
                    >
                      {t.sentiment}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="pt-5 align-top text-sm text-slate-600 font-medium">
                  {t.category || "General"}
                </TableCell>

                {/* PRIORITY COLUMN */}
                <TableCell className="pt-5 align-top">
                  <Badge
                    variant="outline"
                    className={
                      t.priority === "HIGH"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : t.priority === "MEDIUM"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {t.priority || "LOW"}
                  </Badge>
                </TableCell>

                {/* STATUS COLUMN */}
                <TableCell className="pt-5 align-top">
                  <Badge
                    variant="secondary"
                    className={
                      t.status === "OPEN"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right pt-4 align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTicket(t.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4 text-slate-500" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(
                            t.id,
                            t.status === "OPEN" ? "RESOLVED" : "OPEN"
                          );
                        }}
                      >
                        {t.status === "OPEN" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                            Mark Resolved
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
                            Mark Open
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(t.id);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-6">

        <p className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardHome;