import { Outlet } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreateTicketForm } from "@/features/tickets/components/CreateTicketForm"
import UserSidebar from "@/components/layout/UserSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const DashboardLayout = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      <UserSidebar 
        onCreateClick={() => setIsDialogOpen(true)} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile-Only Top Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shrink-0">
          <div className="font-bold text-lg text-slate-800">TicketFlow</div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 p-4 md:p-12 overflow-y-auto">
          <Outlet context={{ onCreateClick: () => setIsDialogOpen(true), refreshKey }}/>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit a support request.
            </DialogDescription>
          </DialogHeader>
          <CreateTicketForm onClose={() => {setIsDialogOpen(false);triggerRefresh();}} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardLayout