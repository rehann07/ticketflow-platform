import React, { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
  const matchesSearch =
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm);

  const matchesStatus =
    statusFilter === "ALL" || t.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="-ml-2 hover:bg-slate-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Tickets
            </h1>
          </div>

          <p className="text-slate-500 text-sm ml-9">
            Manage and track your support requests
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">

  {/* Search */}
  <div className="relative w-full md:w-[250px]">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder="Search by subject or ID..."
      className="pl-9 bg-white border-slate-200 focus-visible:ring-slate-400"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white"
  >
    <option value="ALL">All Status</option>
    <option value="OPEN">Open</option>
    <option value="RESOLVED">Resolved</option>
  </select>

  {/* Reset Button */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
      setSearchTerm("");
      setStatusFilter("ALL");
    }}
  >
    Reset
  </Button>

</div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="w-[100px] h-11 text-slate-500 font-semibold pl-6">
                ID
              </TableHead>
              <TableHead className="h-11 text-slate-500 font-semibold">
                Subject
              </TableHead>
              <TableHead className="w-[120px] h-11 text-slate-500 font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[80px] h-11 text-right pr-6" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-slate-500"
                >
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-slate-100 p-4 rounded-full mb-3">
                      <Inbox className="h-8 w-8 text-slate-400" />
                    </div>

                    <p className="font-medium text-slate-900">
                      {searchTerm
                        ? "No tickets match your search"
                        : "No tickets found"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  onClick={() =>
                    navigate(`/dashboard/tickets/${ticket.id}`)
                  }
                >
                  <TableCell className="pl-6 py-4">
                    <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      #{ticket.id}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {ticket.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {ticket.description}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={`font-medium ${
                        ticket.status === "OPEN"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-blue-600"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyTickets;
