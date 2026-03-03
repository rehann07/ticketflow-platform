import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import api from "@/api/axiosConfig"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TicketSummaryCard from "./TicketSummaryCard"

const DashboardHome = () => {
  const navigate = useNavigate()
  const { onCreateClick, refreshKey } = useOutletContext()
  

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets")
        setTickets(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  },[refreshKey])

  const pendingCount = tickets.filter(t => t.status === "OPEN").length
  const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length
  const totalCount = tickets.length

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Portal</h1>
          <p className="text-slate-500 mt-2">
            Track your requests and get help.
          </p>
        </div>

        <Button
          onClick={onCreateClick}
          className="bg-black text-white hover:bg-slate-800 shadow-lg"
        >
          <Plus size={18} className="mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold">{pendingCount}</h2>
            <span className="text-sm font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tickets waiting for support
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold">{resolvedCount}</h2>
            <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              Solved
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Issues resolved successfully
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">{totalCount}</h2>
          <p className="text-sm text-slate-400 mt-1">
            Total tickets created
          </p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Recent Tickets
          </h3>

          <Button
            variant="link"
            className="text-slate-500"
            onClick={() => navigate("/dashboard/tickets")}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Create Card */}
          <button
            onClick={onCreateClick}
            className="group border-2 border-dashed border-slate-200 
                       rounded-2xl h-[220px] flex flex-col p-6
                       hover:border-slate-400 hover:shadow-lg transition-all"
          >
            <div className="mt-auto text-center">
              <Plus className="mx-auto mb-2" />
              <p className="font-semibold">Create New Ticket</p>
            </div>
          </button>

          {loading ? (
            <div className="col-span-3 text-center text-slate-400 py-10">
              Loading tickets...
            </div>
          ) : (
            [...tickets]
              .sort((a, b) => b.id - a.id)
              .slice(0, 3)
              .map(ticket => (
                <TicketSummaryCard key={ticket.id} ticket={ticket} />
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
