import React, { useState, useEffect } from "react";
import axios from "axios";
import QuoteDisplay from "./QuoteDisplay";
import Select from "react-select";

type OptionType = {
  value: string;
  label: string;
};

const QuoteSearch: React.FC = () => {
  const [searchTerms, setSearchTerms] = useState<OptionType[]>([]);
  const [quotes, setQuotes] = useState([]);
  const [topics, setTopics] = useState<OptionType[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/topics");
        const topicsData = response.data.map((topic: any) => ({
          value: topic.title,
          label: topic.title,
        }));
        setTopics(topicsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopics();
  }, []);

  const handleSearch = async () => {
    try {
      const topicsQuery = searchTerms.map((term) => term.value).join(",");
      const response = await axios.get(
        `/api/quotes/topics?titles=${topicsQuery}`
      );
      setQuotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Select
        options={topics}
        onChange={(selectedOptions) =>
          setSearchTerms(selectedOptions as OptionType[])
        }
        isMulti
        placeholder="Select topics"
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {quotes.map((quote: any, index: number) => (
          <QuoteDisplay key={index} quote={quote} />
        ))}
      </div>
    </div>
  );
};

export default QuoteSearch;
