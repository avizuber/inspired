import React, { useState, useEffect } from "react";
import axios from "axios";

const TopicManagement: React.FC = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/topics");
        setTopics(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div>
      <h3>Topic Management</h3>
      <ul>
        {topics.map((topic: any, index: number) => (
          <li key={index}>{topic.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopicManagement;
