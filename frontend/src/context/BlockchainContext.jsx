// src/context/BlockchainContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { blockchainService } from '../services/apiServices';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: false,
    blockHeight: 0,
    peers: 0,
    lastUpdate: null
  });
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [confirmedTransactions, setConfirmedTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check network status
  const checkNetworkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await blockchainService.getNetworkStatus();
      setNetworkStatus({
        isConnected: status.connected,
        blockHeight: status.blockHeight,
        peers: status.peers,
        lastUpdate: new Date()
      });
      setError(null);
    } catch (err) {
      console.error('Network status check failed:', err);
      setError('Unable to connect to blockchain network');
      setNetworkStatus(prev => ({ ...prev, isConnected: false }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit transaction to blockchain
  const submitTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      
      // Add to pending transactions
      const pendingTx = {
        id: Date.now().toString(),
        ...transactionData,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setPendingTransactions(prev => [...prev, pendingTx]);

      // Submit to blockchain
      const result = await blockchainService.submitTransaction(transactionData);
      
      // Move from pending to confirmed
      setPendingTransactions(prev => prev.filter(tx => tx.id !== pendingTx.id));
      setConfirmedTransactions(prev => [...prev, {
        ...pendingTx,
        ...result,
        status: 'confirmed',
        txHash: result.transactionHash,
        blockNumber: result.blockNumber
      }]);

      return result;
    } catch (err) {
      console.error('Transaction submission failed:', err);
      setError('Transaction failed: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify transaction
  const verifyTransaction = useCallback(async (txHash) => {
    try {
      setLoading(true);
      const verification = await blockchainService.verifyTransaction(txHash);
      return verification;
    } catch (err) {
      console.error('Transaction verification failed:', err);
      setError('Verification failed: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Query blockchain data
  const queryBlockchain = useCallback(async (queryParams) => {
    try {
      setLoading(true);
      const result = await blockchainService.queryWorldState(queryParams);
      return result;
    } catch (err) {
      console.error('Blockchain query failed:', err);
      setError('Query failed: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get transaction history
  const getTransactionHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const history = await blockchainService.getTransactionHistory(filters);
      return history;
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
      setError('Failed to load transaction history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize network status check
  useEffect(() => {
    checkNetworkStatus();
    
    // Set up periodic network status checks
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkNetworkStatus]);

  // WebSocket for real-time updates
  useEffect(() => {
    let ws;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    
    const connectWebSocket = () => {
      // Skip WebSocket connection in development if no backend is configured
      if (import.meta.env.DEV && !import.meta.env.VITE_BLOCKCHAIN_WS_URL) {
        console.log('Blockchain WebSocket disabled - no backend configured');
        return;
      }
      
      try {
        ws = new WebSocket(import.meta.env.VITE_BLOCKCHAIN_WS_URL || 'ws://localhost:4001/blockchain-updates');
        
        ws.onopen = () => {
          console.log('Blockchain WebSocket connected');
          reconnectAttempts = 0; // Reset on successful connection
          setError(null);
        };
        
        ws.onmessage = (event) => {
          try {
            const update = JSON.parse(event.data);
            
            switch (update.type) {
              case 'TRANSACTION_CONFIRMED':
                // Move transaction from pending to confirmed
                setPendingTransactions(prev => 
                  prev.filter(tx => tx.id !== update.transactionId)
                );
                setConfirmedTransactions(prev => [...prev, update.transaction]);
                break;
                
              case 'NETWORK_STATUS':
                setNetworkStatus(prev => ({
                  ...prev,
                  ...update.status,
                  lastUpdate: new Date()
                }));
                break;
                
              case 'NEW_BLOCK':
                setNetworkStatus(prev => ({
                  ...prev,
                  blockHeight: update.blockHeight,
                  lastUpdate: new Date()
                }));
                break;
                
              default:
                console.log('Unknown blockchain update:', update);
            }
          } catch (err) {
            console.error('Error processing blockchain update:', err);
          }
        };
        
        ws.onerror = (error) => {
          // Only log error if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts) {
            console.warn('Blockchain WebSocket connection failed - retrying...');
          }
        };
        
        ws.onclose = () => {
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Blockchain WebSocket disconnected - retry ${reconnectAttempts}/${maxReconnectAttempts}`);
            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
          } else {
            console.log('Blockchain WebSocket connection failed - operating in offline mode');
            setError('Operating in offline mode');
          }
        };
      } catch (err) {
        if (reconnectAttempts === 0) {
          console.warn('Blockchain WebSocket unavailable - operating in offline mode');
          setError('Operating in offline mode');
        }
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const value = {
    // State
    networkStatus,
    pendingTransactions,
    confirmedTransactions,
    loading,
    error,
    
    // Actions
    submitTransaction,
    verifyTransaction,
    queryBlockchain,
    getTransactionHistory,
    checkNetworkStatus,
    clearError,
    
    // Computed values
    isConnected: networkStatus.isConnected,
    totalTransactions: pendingTransactions.length + confirmedTransactions.length,
    pendingCount: pendingTransactions.length,
    confirmedCount: confirmedTransactions.length
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};