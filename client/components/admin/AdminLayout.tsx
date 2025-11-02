import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut as authSignOut } from '@/lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const signOut = async () => {
    await authSignOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin"
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              location.pathname === '/admin'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/admin/restaurants"
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-md',
              location.pathname.startsWith('/admin/restaurants')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <User className="mr-3 h-5 w-5" />
            Restaurant Users
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={signOut}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
