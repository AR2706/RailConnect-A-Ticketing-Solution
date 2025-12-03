import { Link } from 'react-router-dom';

const Navbar = ({ isAdmin, user, onLogout }) => {
    return (
        <nav className="navbar">
            <h2>🚆 RailConnect</h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                
                {/* Logic: Show User Name or Login Button */}
                {user ? (
                    <span style={{marginLeft: '20px'}}>👤 {user.name}</span>
                ) : !isAdmin && (
                    <Link to="/login">User Login</Link>
                )}

                {/* Logic: Admin or Logout */}
                {!isAdmin && !user ? (
                    <Link to="/admin" className="admin-link">Admin</Link>
                ) : (
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                )}
            </div>
        </nav>
    );
};
export default Navbar;