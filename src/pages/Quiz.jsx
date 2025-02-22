import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import { useAuth } from "../contexts/AuthContext";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [timer, setTimer] = useState(12);
  const [quizStarted, setQuizStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const quizStartTime = localStorage.getItem("quizStartTime");
    const currentTime = new Date().toISOString();
    if (quizStartTime && currentTime >= quizStartTime) {
      setQuizStarted(true);
      const fetchedQuestions = JSON.parse(localStorage.getItem("quizQuestions"));
      setQuestions(fetchedQuestions);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const startTime = tomorrow.getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = startTime - now;
        if (distance < 0) {
          clearInterval(interval);
          setQuizStarted(true);
          const fetchedQuestions = JSON.parse(localStorage.getItem("quizQuestions"));
          setQuestions(fetchedQuestions);
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmit();
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setAnswerStatus(null);
      setSelectedOption(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(12);
    }, 2000);
  };

  useEffect(() => {
    if (selectedOption !== null) {
      handleSubmit();
    }
  }, [selectedOption]);

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Quiz Countdown</h1>
        <p className="countdown-text">The quiz will start in: {countdown}</p>
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
        <div className="timer">Time Left: {timer}s</div>
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
