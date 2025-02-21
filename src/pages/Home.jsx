import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to Nasfat Quiz</h1>
      {user && <p>Welcome, {user.username}!</p>}
      <p>Test your knowledge and compete with others!</p>
      {user ? (
        <Link to="/quiz" className="home-btn">Start Quiz</Link>
      ) : (
        <>
          <Link to="/signup" className="home-btn">Sign Up</Link>
          <Link to="/login" className="home-btn">Login</Link>
        </>
      )}
    </div>
  );
};

export default Home;
