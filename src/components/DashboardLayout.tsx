import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const navItems = [
  { label: 'Catalog', path: '/admin/catalog', section: 'Admin' },
  { label: 'Explore', path: '/vendor/explore', section: 'Vendor' },
  { label: 'Inventory', path: '/vendor/inventory', section: 'Vendor' },
  { label: 'Sales', path: '/sales', section: 'Sales' },
];

const DashboardLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <span className="text-sm font-semibold tracking-tight text-foreground">Inventory Client</span>
        </div>

        <nav className="flex-1 py-2 space-y-4">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div className="px-4 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {section}
              </div>
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                    location.pathname === item.path
                      ? 'bg-accent text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
