import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Select from "react-select";

interface TopicOption {
  value: number;
  label: string;
}

interface Quote {
  id: number;
  text: string;
  author: string;
  topics: TopicOption[];
}

const QuoteManagement: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicOption[]>([]);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [editQuoteId, setEditQuoteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuotesAndTopics = async () => {
      try {
        const quotesRes = await axios.get("/api/quotes");
        setQuotes(quotesRes.data);

        const topicsRes = await axios.get("/api/topics");
        setTopics(
          topicsRes.data.map((topic: any) => ({
            value: topic.id,
            label: topic.title,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuotesAndTopics();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("/api/quotes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      setUploadStatus("Failed to upload file.");
    }
  };

  const handleAddQuote = async () => {
    try {
      const newQuote = {
        text: quoteText,
        author: quoteAuthor,
        topicIds: selectedTopics.map((topic) => topic.value),
      };

      await axios.post("/api/quotes", newQuote);
      setQuoteText("");
      setQuoteAuthor("");
      setSelectedTopics([]);
      // Refresh quotes list
      const quotesRes = await axios.get("/api/quotes");
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditQuote = async (quote: Quote) => {
    setEditQuoteId(quote.id);
    setQuoteText(quote.text);
    setQuoteAuthor(quote.author);
    setSelectedTopics(quote.topics);
  };

  const handleUpdateQuote = async () => {
    if (!editQuoteId) {
      return;
    }

    try {
      const updatedQuote = {
        text: quoteText,
        author: quoteAuthor,
        topicIds: selectedTopics.map((topic) => topic.value),
      };

      await axios.put(`/api/quotes/${editQuoteId}`, updatedQuote);
      setEditQuoteId(null);
      setQuoteText("");
      setQuoteAuthor("");
      setSelectedTopics([]);
      // Refresh quotes list
      const quotesRes = await axios.get("/api/quotes");
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    try {
      await axios.delete(`/api/quotes/${quoteId}`);
      // Refresh quotes list
      const quotesRes = await axios.get("/api/quotes");
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Quote Management</h1>
      {/* File upload */}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag and drop a file here, or click to select a file</p>
        )}
      </div>
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>

      {/* Add / Edit quote form */}
      <div>
        <h2>{editQuoteId ? "Edit Quote" : "Add Quote"}</h2>
        <div>
          <label>Quote Text:</label>
          <input
            type="text"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={quoteAuthor}
            onChange={(e) => setQuoteAuthor(e.target.value)}
          />
        </div>
        <div>
          <label>Topics:</label>
          <Select
            isMulti
            value={selectedTopics}
            onChange={(selected) =>
              setSelectedTopics(selected as TopicOption[])
            }
            options={topics}
          />
        </div>
        <button onClick={editQuoteId ? handleUpdateQuote : handleAddQuote}>
          {editQuoteId ? "Update Quote" : "Add Quote"}
        </button>
      </div>

      {/* Quotes list */}
      <div>
        <h2>Quotes</h2>
        {quotes.map((quote) => (
          <div key={quote.id}>
            <p>
              {quote.text} - {quote.author}
            </p>
            <p>Topics: {quote.topics.map((topic) => topic.label).join(", ")}</p>
            <button onClick={() => handleEditQuote(quote)}>Edit</button>
            <button onClick={() => handleDeleteQuote(quote.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteManagement;
