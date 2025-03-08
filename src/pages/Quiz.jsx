import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/quiz.css";
import { useAuth } from "../contexts/AuthContext";

const Quiz = () => {
  const [questions, setQuestions] = useState([
    {
      question: "What is the first pillar of Islam?",
      options: ["Shahada", "Salah", "Zakat", "Sawm"],
      correctAnswer: "Shahada",
      type: "objective",
    },
    {
      question: "How many times do Muslims pray each day?",
      options: ["Three", "Four", "Five", "Six"],
      correctAnswer: "Five",
      type: "objective",
    },
    {
      question: "What is the holy book of Islam?",
      options: ["Bible", "Torah", "Quran", "Vedas"],
      correctAnswer: "Quran",
      type: "objective",
    },
    {
      question: "Who is the last prophet in Islam?",
      options: ["Moses", "Jesus", "Muhammad", "Abraham"],
      correctAnswer: "Muhammad",
      type: "objective",
    },
    {
      question: "What is the month of fasting in Islam?",
      options: ["Ramadan", "Shawwal", "Dhul-Hijjah", "Muharram"],
      correctAnswer: "Ramadan",
      type: "objective",
    },
    {
      question: "What is the second pillar of Islam?",
      options: ["Salah", "Zakat", "Sawm", "Hajj"],
      correctAnswer: "Salah",
      type: "objective",
    },
    {
      question: "How many chapters are there in the Quran?",
      options: ["114", "120", "99", "108"],
      correctAnswer: "114",
      type: "objective",
    },
    {
      question: "What is the Arabic term for charity in Islam?",
      options: ["Sadaqah", "Zakat", "Kaffara", "Fidya"],
      correctAnswer: "Zakat",
      type: "objective",
    },
    {
      question: "Which city is considered the holiest in Islam?",
      options: ["Medina", "Jerusalem", "Mecca", "Cairo"],
      correctAnswer: "Mecca",
      type: "objective",
    },
    {
      question: "Describe the significance of the night journey of Prophet Muhammad.",
      type: "essay",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [timer, setTimer] = useState(12);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedUser = storedUsers.find((u) => u.username === user.username);
    if (storedUser && storedUser.hasCompletedQuiz) {
      setHasCompletedQuiz(true);
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
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === "objective") {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "essay") {
      isCorrect = essayAnswer.trim().length > 0; // Simple validation for essay answer
    }

    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) {
      setScore((prevScore) => prevScore + 2);
    }

    setTimeout(() => {
      setAnswerStatus(null);
      setSelectedOption(null);
      setEssayAnswer("");
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(12);
      } else {
        updateLeaderboard();
        setHasCompletedQuiz(true);
        navigate("/leaderboard");
      }
    }, 2000);
  };

  const updateLeaderboard = async () => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        username: user.username,
        score: score,
        date: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    if (selectedOption !== null || essayAnswer.trim().length > 0) {
      handleSubmit();
    }
  }, [selectedOption, essayAnswer]);

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

  if (hasCompletedQuiz) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Quiz Completed!</h1>
        <p>You have already completed the quiz.</p>
        <div className="quiz-buttons">
          <button className="option-btn" onClick={() => navigate("/")}>Go Home</button>
          <button className="option-btn" onClick={() => navigate("/leaderboard")}>See Leaderboard</button>
        </div>
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

  const currentQuestion = questions[currentQuestionIndex];

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
        <p>{currentQuestion.question}</p>
        {currentQuestion.type === "objective" ? (
          <div className="options">
            {currentQuestion.options.map((option, index) => (
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
        ) : (
          <textarea
            className="essay-answer"
            value={essayAnswer}
            onChange={(e) => setEssayAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows="5"
            autoComplete="off"
            onPaste={(e) => e.preventDefault()}
            style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px", fontSize: "16px", border: "1px solid #ccc" }}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
