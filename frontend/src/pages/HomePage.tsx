import React, { useState, useEffect } from "react";
import axios from "axios";
import QuoteSearch from "../components/QuoteSearch";
import QuoteDisplay from "../components/QuoteDisplay";

const HomePage: React.FC = () => {
  const [randomQuote, setRandomQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const getRandomQuote = async () => {
      try {
        const response = await axios.get("/api/quotes/random");
        setRandomQuote(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getRandomQuote();
  }, []);

  return (
    <div>
      <h2>Random Quote</h2>
      <QuoteDisplay quote={randomQuote} />
      <h2>Search Quotes by Topic</h2>
      <QuoteSearch />
    </div>
  );
};

export default HomePage;
