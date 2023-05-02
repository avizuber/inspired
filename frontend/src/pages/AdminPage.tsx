import React from "react";
import QuoteManagement from "../components/QuoteManagement";
import TopicManagement from "../components/TopicManagement";

const AdminPage: React.FC = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <QuoteManagement />
      <TopicManagement />
    </div>
  );
};

export default AdminPage;
