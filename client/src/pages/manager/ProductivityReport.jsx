import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import React, { useState, useEffect } from 'react';
import OverviewChart from '../../components/charts/OverviewChart';

import SalespersonDetail from '../../components/charts/SalespersonDetail';
import RankTable from '../../components/charts/RankTable';
import FeedbackCard from '../../components/charts/FeedbackCard';
import { generateData } from '../../utils/mockData';

import './ProductivityReport.css';

function App() {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const initialData = generateData();
    setData(initialData);
    if (initialData.length > 0) {
      setSelectedUser(initialData[0]);
    }
  }, []);

  const handleUserSelect = (userData) => {
    setSelectedUser(userData);
  };

  return (
    
    <div className="container">
      <Sidebar />
      <div className="main">
        <Header />
      
    <div className="app-container">
      {/* Left Column: Chart (Top 50%) + Rank Table (Bottom 50%) */}
      <div className="left-column">
        <div className="chart-section">
          <OverviewChart data={data} onSelectUser={handleUserSelect} />
        </div>
        <div className="table-section">
          <RankTable
            data={data}
            onSelectUser={handleUserSelect}
            selectedId={selectedUser?.id}
          />
        </div>
      </div>

      {/* Right Column: Detail (Top) + Feedback (Bottom) */}
      <div className="right-column">
        {selectedUser ? (
          <div className="right-panel-content">
            <div className="detail-section">
              <SalespersonDetail data={selectedUser} />
            </div>
            <div className="feedback-section">
              <FeedbackCard score={selectedUser.score} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#888' }}>Loading...</div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}

export default App;
