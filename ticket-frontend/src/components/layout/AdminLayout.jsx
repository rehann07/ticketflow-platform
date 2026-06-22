import { Outlet } from "react-router-dom"
import { useState } from "react"
import AdminSidebar from "@/components/layout/AdminSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile-Only Top Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shrink-0 shadow-sm">
          <div className="font-bold text-lg text-slate-800">Admin Panel</div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout