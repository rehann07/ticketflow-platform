import React from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const TicketSummaryCard = ({ ticket }) => {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
      className={`group relative cursor-pointer border 
      rounded-2xl hover:shadow-lg transition-all duration-200 
      h-[220px] flex flex-col p-6
      ${ticket.status === "OPEN"
        ? "border-l-4 border-l-orange-400"
        : "border-l-4 border-l-green-400"
      }`}
    >
      
      {/* Top Section */}
      <div className="flex justify-between items-start shrink-0">
        <Badge
          variant="secondary"
          className="text-xs font-normal bg-slate-100 text-slate-500"
        >
          #{ticket.id}
        </Badge>

        {ticket.status === "CLOSED" && (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        )}
      </div>

      {/* Title Section */}
      <div className="mt-4 flex-1 min-h-0">
        <h3 
          className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors" 
          title={ticket.title}
        >
          {ticket.title}
        </h3>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex justify-between items-center pt-2 shrink-0">
        <div>
          <p className="text-xs text-slate-400">Status</p>
          <p
            className={`text-sm font-semibold ${
              ticket.status === "OPEN"
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {ticket.status}
          </p>
        </div>

        <div
          className="h-9 w-9 rounded-full bg-slate-100 
                      flex items-center justify-center 
                      group-hover:bg-black group-hover:text-white 
                      transition-colors shrink-0"
        >
          →
        </div>
      </div>
    </Card>
  )
}

export default TicketSummaryCard