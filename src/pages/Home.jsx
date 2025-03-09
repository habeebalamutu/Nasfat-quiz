import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/home.css";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [countdown, setCountdown] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchQuizStartTime = async () => {
      const docRef = doc(db, "settings", "quizStartTime");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const startTime = docSnap.data().startTime.toDate();
          console.log("Quiz start time:", startTime);
          const now = new Date();
          console.log("Current time:", now);

          // Set the quiz start time to 8:45 PM today
          const quizStartTime = new Date();
          quizStartTime.setHours(20, 45, 0, 0);

          // Set the quiz end time to 10:00 PM today
          const quizEndTime = new Date();
          quizEndTime.setHours(22, 0, 0, 0);

          if (now < quizStartTime) {
            setCountdown(Math.floor((quizStartTime - now) / 1000));
          } else if (now >= quizStartTime && now <= quizEndTime) {
            setCountdown(0); // Quiz is currently available
          } else {
            // Set the countdown to the next day's quiz start time
            const nextDayQuizStartTime = new Date(quizStartTime);
            nextDayQuizStartTime.setDate(nextDayQuizStartTime.getDate() + 1);
            setCountdown(Math.floor((nextDayQuizStartTime - now) / 1000));
          }
        }
      });
      return () => unsubscribe();
    };
    fetchQuizStartTime();
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
        console.log("Countdown:", countdown);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (!user) {
    return (
      <div className="home-container">
        <h1 className="home-title">Welcome to the Quiz</h1>
        <p>Please log in to participate in the quiz.</p>
        <button className="option-btn" onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (localStorage.getItem("hasCompletedQuiz") === "true") {
    return (
      <div className="home-container">
        <h1 className="home-title">Quiz Completed!</h1>
        <p>You have already completed the quiz today.</p>
        <p>Next quiz will be available in: {formatCountdown(countdown)}</p>
        <div className="home-buttons">
          <button className="option-btn" onClick={() => navigate("/leaderboard")}>See Leaderboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Quiz</h1>
      <p>Get ready to test your knowledge!</p>
      <button className="option-btn" onClick={() => navigate("/quiz")}>Start Quiz</button>
      <div className="home-buttons">
        <button className="option-btn" onClick={() => navigate("/leaderboard")}>See Leaderboard</button>
      </div>
    </div>
  );
};

export default Home;
