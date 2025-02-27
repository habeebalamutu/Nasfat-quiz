import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import { useAuth } from "../contexts/AuthContext";

const Quiz = () => {
  const [questions, setQuestions] = useState([
    {
      question: "What is the first pillar of Islam?",
      options: ["Shahada", "Salah", "Zakat", "Sawm"],
      correctAnswer: "Shahada",
    },
    {
      question: "How many times do Muslims pray each day?",
      options: ["Three", "Four", "Five", "Six"],
      correctAnswer: "Five",
    },
    {
      question: "What is the holy book of Islam?",
      options: ["Bible", "Torah", "Quran", "Vedas"],
      correctAnswer: "Quran",
    },
    {
      question: "Who is the last prophet in Islam?",
      options: ["Moses", "Jesus", "Muhammad", "Abraham"],
      correctAnswer: "Muhammad",
    },
    {
      question: "What is the month of fasting in Islam?",
      options: ["Ramadan", "Shawwal", "Dhul-Hijjah", "Muharram"],
      correctAnswer: "Ramadan",
    },
    {
      question: "What is the second pillar of Islam?",
      options: ["Salah", "Zakat", "Sawm", "Hajj"],
      correctAnswer: "Salah",
    },
    {
      question: "How many chapters are there in the Quran?",
      options: ["114", "120", "99", "108"],
      correctAnswer: "114",
    },
    {
      question: "What is the Arabic term for charity in Islam?",
      options: ["Sadaqah", "Zakat", "Kaffara", "Fidya"],
      correctAnswer: "Zakat",
    },
    {
      question: "Which city is considered the holiest in Islam?",
      options: ["Medina", "Jerusalem", "Mecca", "Cairo"],
      correctAnswer: "Mecca",
    },
    {
      question: "What is the night journey of Prophet Muhammad called?",
      options: ["Hijra", "Isra and Mi'raj", "Badr", "Uhud"],
      correctAnswer: "Isra and Mi'raj",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(12);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmit();
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) {
      setScore((prevScore) => prevScore + 2);
    }

    setTimeout(() => {
      setAnswerStatus(null);
      setSelectedOption(null);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(12);
      } else {
        updateLeaderboard();
        navigate("/leaderboard");
      }
    }, 2000);
  };

  const updateLeaderboard = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex((storedUser) => storedUser.username === user.username);
    if (userIndex !== -1) {
      storedUsers[userIndex].score = score;
    } else {
      storedUsers.push({ username: user.username, score: score });
    }
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  useEffect(() => {
    if (selectedOption !== null) {
      handleSubmit();
    }
  }, [selectedOption]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmit();
    }
  }, [timer]);

  if (!user) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Please Log In</h1>
        <p>You must be logged in to play the quiz.</p>
        <button className="option-btn" onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">No Questions Available</h1>
        <p>Please check back later.</p>
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Quiz Completed!</h1>
        <div className="quiz-buttons">
          <button className="option-btn" onClick={() => navigate("/")}>Go Home</button>
          <button className="option-btn" onClick={() => navigate("/leaderboard")}>See Leaderboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz</h1>
      <div className="quiz-header">
        <div className="timer" style={{ color: timer <= 3 ? 'red' : 'black' }}>Time Left: {timer}s</div>
        <div className="quiz-indicator">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      <div className={`question-card ${answerStatus}`}>
        <p>{questions[currentQuestionIndex].question}</p>
        <div className="options">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionChange(option)}
              style={{ width: "48%", margin: "1%" }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
