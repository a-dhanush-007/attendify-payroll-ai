
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Clock,
  DollarSign,
  Settings,
  Users,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  requiresRole?: string[];
  active?: boolean;
}

const NavItem = ({ to, icon, label, active, requiresRole }: NavItemProps) => {
  const { hasRole } = useAuth();
  
  if (requiresRole && !hasRole(requiresRole as any)) {
    return null;
  }
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
        active
          ? "text-attendify-700 bg-attendify-50 dark:text-attendify-100 dark:bg-attendify-900/40"
          : "text-gray-700 hover:text-attendify-700 hover:bg-attendify-50 dark:text-gray-300 dark:hover:text-attendify-100 dark:hover:bg-attendify-900/40"
      )}
    >
      <div className={cn(
        "mr-3 h-6 w-6",
        active 
          ? "text-attendify-600 dark:text-attendify-300" 
          : "text-gray-500 group-hover:text-attendify-600 dark:text-gray-400 dark:group-hover:text-attendify-300"
      )}>
        {icon}
      </div>
      {label}
    </Link>
  );
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-card shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-attendify-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-attendify-800 dark:text-attendify-100">
              AttendifyPro
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <NavItem 
              to="/dashboard" 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              active={location.pathname === "/dashboard"} 
            />
            <NavItem 
              to="/attendance" 
              icon={<Clock />} 
              label="Attendance" 
              active={location.pathname.startsWith("/attendance")} 
            />
            <NavItem 
              to="/payroll" 
              icon={<DollarSign />} 
              label="Payroll" 
              active={location.pathname.startsWith("/payroll")} 
            />
            <NavItem 
              to="/reports" 
              icon={<FileText />} 
              label="Reports" 
              active={location.pathname.startsWith("/reports")} 
              requiresRole={["admin", "supervisor"]} 
            />
            <NavItem 
              to="/workers" 
              icon={<Users />} 
              label="Workers" 
              active={location.pathname.startsWith("/workers")} 
              requiresRole={["admin", "supervisor"]} 
            />
            <NavItem 
              to="/settings" 
              icon={<Settings />} 
              label="Settings" 
              active={location.pathname.startsWith("/settings")} 
              requiresRole={["admin"]} 
            />
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-attendify-100 text-attendify-800 dark:bg-attendify-800 dark:text-attendify-100">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                AttendifyPro
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
