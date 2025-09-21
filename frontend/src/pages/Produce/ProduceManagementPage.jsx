import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProduceManagement } from '../../components/Produce';

const ProduceManagementPage = () => {
  const navigate = useNavigate();

  const handleAddProduce = () => {
    navigate('/produce/add');
  };

  const handleViewTrace = (produceId) => {
    if (produceId) {
      navigate(`/produce/trace/${produceId}`);
    } else {
      navigate('/produce/trace');
    }
  };

  const handleTransferOwnership = (produceId) => {
    if (produceId) {
      navigate(`/produce/transfer/${produceId}`);
    } else {
      navigate('/produce/transfer');
    }
  };

  const handleQualityInspection = (produceId) => {
    if (produceId) {
      navigate(`/produce/inspect/${produceId}`);
    } else {
      navigate('/produce/inspect');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProduceManagement 
        onAddProduce={handleAddProduce}
        onViewTrace={handleViewTrace}
        onTransferOwnership={handleTransferOwnership}
        onQualityInspection={handleQualityInspection}
      />
    </div>
  );
};

export default ProduceManagementPage;