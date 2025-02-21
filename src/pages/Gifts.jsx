import { useState, useEffect } from "react";
import "../styles/gifts.css";

const Gifts = ({ position }) => {
  const [gifts, setGifts] = useState(["", "", "", "", ""]);

  useEffect(() => {
    // Fetch gifts from the server or local storage
    const fetchedGifts = ["Gift1.png", "Gift2.png", "Gift3.png", "Gift4.png", "Gift5.png"];
    setGifts(fetchedGifts);
  }, []);

  const userPosition = position - 1; // Assuming position is 1-based

  return (
    <div className="gifts-container">
      <h1>Your Gift</h1>
      <div className="gifts-grid">
        <div className="gift-card">

          <img src={gifts[userPosition]} alt={`Gift for ${position} place`} />
          <p>{["First", "Second", "Third", "Fourth", "Fifth"][userPosition]} Place</p>
        </div>
      </div>
    </div>
  );
};

export default Gifts;
