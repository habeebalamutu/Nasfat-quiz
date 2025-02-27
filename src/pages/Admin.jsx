import { useState, useEffect } from "react";

const Admin = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [startTime, setStartTime] = useState("");
  const [gifts, setGifts] = useState(["", "", "", "", ""]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setStartTime(tomorrow.toISOString().slice(0, 16));
  }, []);

  const addQuestion = () => {
    const question = {
      question: newQuestion,
      options: newOptions,
      correctAnswer: correctAnswer,
    };
    setQuestions([...questions, question]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleGiftChange = (index, value) => {
    const newGifts = [...gifts];
    newGifts[index] = value;
    setGifts(newGifts);
  };

  const saveSettings = () => {
    // Save settings to local storage or server
    localStorage.setItem("quizStartTime", startTime);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    localStorage.setItem("quizGifts", JSON.stringify(gifts));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>Manage Questions</h2>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="New Question"
        />
        {newOptions.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const options = [...newOptions];
              options[index] = e.target.value;
              setNewOptions(options);
            }}
            placeholder={`Option ${index + 1}`}
          />
        ))}
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
        />
        <button onClick={addQuestion}>Add Question</button>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              {question.question}
              <ul>
                {question.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Set Quiz Start Time</h2>
        <input
          type="datetime-local"
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </div>
      <div>
        <h2>Manage Gifts</h2>
        {["First", "Second", "Third", "Fourth", "Fifth"].map((position, index) => (
          <div key={index}>
            <label>{position} Place Gift:</label>
            <input
              type="text"
              value={gifts[index]}
              onChange={(e) => handleGiftChange(index, e.target.value)}
              placeholder={`Gift for ${position} place`}
            />
          </div>
        ))}
      </div>
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
};

export default Admin;
