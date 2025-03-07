import { useEffect, useState } from "react";
import "../styles/leaderboard.css";

function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // 1. Retrieve scoreboard from localStorage
    const stored = JSON.parse(localStorage.getItem("scoreboard")) || [];
    // 2. Sort by highest score first
    stored.sort((a, b) => b.score - a.score);
    // 3. Take only top 10
    const topTen = stored.slice(0, 10);
    setScores(topTen);
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-box">
        <h1>Leaderboard</h1>

        {scores.length === 0 ? (
          <p>No scores yet. Be the first to play!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, index) => {
                // Decide the row class based on rank (index)
                let rowClass = "";
                if (index < 3) {
                  rowClass = "green-row"; // top 3
                } else if (index >= 3 && index < 7) {
                  rowClass = "yellow-row"; // rank 4-7
                } else {
                  rowClass = "red-row"; // rank 8-10
                }

                return (
                  <tr key={index} className={rowClass}>
                    <td>{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.score}</td>
                    <td>{new Date(entry.date).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <a href="/">Go Home</a>
      </div>
    </div>
  );
}

export default Leaderboard;
