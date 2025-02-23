import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Navbar from "./components/Navbar";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Gifts from "./pages/Gifts";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css";
import "./styles/auth.css";
import "./styles/quiz.css";
import "./styles/leaderboard.css";
import "./styles/countdown.css";
import "./styles/home.css";
import "./styles/signup.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/gifts" element={<Gifts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
