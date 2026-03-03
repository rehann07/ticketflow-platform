import { Outlet } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreateTicketForm } from "@/features/tickets/components/CreateTicketForm"
import UserSidebar from "@/components/layout/UserSidebar"

const DashboardLayout = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <UserSidebar onCreateClick={() => setIsDialogOpen(true)} />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <Outlet context={{ onCreateClick: () => setIsDialogOpen(true),refreshKey }}/>
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
