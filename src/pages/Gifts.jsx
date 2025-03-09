import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/gifts.css";

const Gifts = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [networkType, setNetworkType] = useState("");
  const [isWinner, setIsWinner] = useState(false);
  const { user } = useAuth();
  const sponsorWhatsAppNumber = "YOUR_SPONSOR_WHATSAPP_NUMBER";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(2));
      const querySnapshot = await getDocs(q);
      const topUsers = querySnapshot.docs.map(doc => doc.data().username);
      if (topUsers.includes(user.username)) {
        setIsWinner(true);
      }
    };
    fetchLeaderboard();
  }, [user.username]);

  const handleSubmit = () => {
    const message = `Phone Number: ${phoneNumber}\nNetwork Type: ${networkType}`;
    const whatsappUrl = `https://wa.me/${+2348137207221}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="gifts-container">
      <h1>Claim Your Gift</h1>
      {isWinner ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            required
          />
          <select
            value={networkType}
            onChange={(e) => setNetworkType(e.target.value)}
            required
          >
            <option value="" disabled>Select Network Type</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="Glo">Glo</option>
            <option value="9mobile">9mobile</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Only the top 2 users can claim a gift.</p>
      )}
    </div>
  );
};

export default Gifts;
