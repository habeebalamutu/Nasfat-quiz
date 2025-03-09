import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/leaderboard.css";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scoresArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.username && data.score && data.date) {
          scoresArray.push(data);
        }
      });
      setScores(scoresArray);
    }, (error) => {
      setError(error.message);
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-box">
          <h1>Leaderboard</h1>
          <p>Error loading leaderboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-box">
        <h1>Leaderboard</h1>

        {scores.length === 0 ? (
          <p>No scores yet. Be the first to play!</p>
        ) : (
          <table className="leaderboard-table">
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
                if (index < 2) {
                  rowClass = "winner-row"; // top 2
                } else if (index < 3) {
                  rowClass = "green-row"; // rank 3
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
                    <td>{new Date(entry.date.seconds * 1000).toLocaleString()}</td>
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
