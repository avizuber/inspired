import api from "../utils/api";

export async function getAllTopics() {
  const response = await api.get("/topics");
  return response.data;
}

// Add other topic-related API calls as needed.
