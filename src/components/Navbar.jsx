import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/nasfat-logo.png";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </button>
      <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        {!user && <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>}
        <li><Link to="/quiz" onClick={() => setMenuOpen(false)}>Quiz</Link></li>
        <li><Link to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</Link></li>
        <li><Link to="/gifts" onClick={() => setMenuOpen(false)}>Gifts</Link></li>
        {user ? (
          <>
            {user.role === "admin" && <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>}
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
        )}
      </ul>
      <img src={logo} alt="Nasfat Logo" className="logo" />
    </header>
  );
}

export default Navbar;
