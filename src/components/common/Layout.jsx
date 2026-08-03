import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const n = useNavigate();

  return (
    <div className="shell">
      <aside>
        <NavLink to="/" className="brand">
          Clause<span>IQ</span>
        </NavLink>
        <p>Legal clarity, made simple.</p>
        <nav>
          <NavLink end to="/">
            Overview
          </NavLink>
          <NavLink to="/history">Document history</NavLink>
        </nav>
        <div className="profile">
          <b>{user?.name}</b>
          <small>{user?.email}</small>
          <button
            onClick={async () => {
              await signOut();
              n('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}