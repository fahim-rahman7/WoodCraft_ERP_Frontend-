import { Outlet, Link, useNavigate } from 'react-router-dom';

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: '#1e293b', color: '#fff', padding: '1rem' }}>
        <h3>Woodcraft ERP</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
          <Link to="/inventory" style={{ color: '#fff' }}>Inventory</Link>
          <Link to="/sales" style={{ color: '#fff' }}>Sales</Link>
          <button onClick={handleLogout} style={{ marginTop: 'auto', padding: '0.5rem' }}>Logout</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', background: '#f8fafc' }}>
        <Outlet />
      </main>
    </div>
  );
};