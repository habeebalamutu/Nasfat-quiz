import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import "../styles/leaderboard.css";
import { useAuth } from "../contexts/AuthContext";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = data ? Object.values(data) : [];
      setUsers(usersList);
    });
  }, []);

  const getBackgroundColor = (index) => {
    if (index < 3) return "green";
    if (index < 6) return "yellow";
    if (index < 10) return "red";
    return "black";
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <h2 className="leaderboard-subtitle">Congratulations! Here are your points:</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userItem, index) => (
            <tr key={index} className={getBackgroundColor(index)}>
              <td>{userItem.username}</td>
              <td>{userItem.score}</td>
            </tr>
          ))}
          {user && (
            <tr className="current-user">
              <td>{user.username}</td>
              <td>{users.find((u) => u.username === user.username)?.score || 0}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
