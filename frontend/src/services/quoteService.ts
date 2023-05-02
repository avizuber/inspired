import api from "../utils/api";

interface SearchQuotesData {
  topics: string[];
}

export async function getAllQuotes() {
  const response = await api.get("/quotes");
  return response.data;
}

export async function searchQuotes(data: SearchQuotesData) {
  const response = await api.post("/quotes/search", data);
  return response.data;
}

// Add other quote-related API calls as needed.
