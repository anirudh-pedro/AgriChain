// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    enablePush: true,
    enableEmail: true,
    enableSMS: false,
    transactionAlerts: true,
    priceAlerts: true,
    inventoryAlerts: true,
    deliveryAlerts: true
  });

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      read: false,
      persistent: false,
      autoHide: true,
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide notification if enabled
    if (newNotification.autoHide && !newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Predefined notification methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title: 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title: 'Error',
      message,
      persistent: true,
      autoHide: false,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Warning',
      message,
      duration: 8000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Information',
      message,
      ...options
    });
  }, [addNotification]);

  // Business-specific notification methods
  const showTransactionUpdate = useCallback((transaction) => {
    const message = transaction.status === 'confirmed' 
      ? `Transaction ${transaction.txHash?.slice(0, 8)}... confirmed on blockchain`
      : `Transaction ${transaction.id} is ${transaction.status}`;
    
    return addNotification({
      type: transaction.status === 'confirmed' ? NOTIFICATION_TYPES.SUCCESS : NOTIFICATION_TYPES.INFO,
      title: 'Transaction Update',
      message,
      data: transaction,
      category: 'transaction'
    });
  }, [addNotification]);

  const showPriceAlert = useCallback((produce) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Price Alert',
      message: `${produce.name} price changed to ₹${produce.currentPrice}/kg`,
      data: produce,
      category: 'price'
    });
  }, [addNotification]);

  const showInventoryAlert = useCallback((product) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Low Inventory',
      message: `${product.name} is running low (${product.quantity} remaining)`,
      data: product,
      category: 'inventory'
    });
  }, [addNotification]);

  const showDeliveryUpdate = useCallback((delivery) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Delivery Update',
      message: `Your order ${delivery.orderId} is ${delivery.status}`,
      data: delivery,
      category: 'delivery'
    });
  }, [addNotification]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear notifications by category
  const clearByCategory = useCallback((category) => {
    setNotifications(prev => 
      prev.filter(notification => notification.category !== category)
    );
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    
    // Save to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify({
      ...preferences,
      ...newPreferences
    }));
  }, [preferences]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notification-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to load notification preferences:', err);
      }
    }
  }, []);

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showError('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      showWarning('Notifications are blocked. Please enable them in browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showSuccess('Notifications enabled successfully!');
        updatePreferences({ enablePush: true });
        return true;
      } else {
        showWarning('Notification permission denied');
        updatePreferences({ enablePush: false });
        return false;
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      showError('Failed to request notification permission');
      return false;
    }
  }, [showError, showWarning, showSuccess, updatePreferences]);

  // Send browser push notification
  const sendPushNotification = useCallback((title, options = {}) => {
    if (!preferences.enablePush || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        tag: 'agrichain-notification',
        renotify: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (err) {
      console.error('Failed to send push notification:', err);
    }
  }, [preferences.enablePush]);

  // WebSocket for real-time notifications
  useEffect(() => {
    let ws;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    
    const connectWebSocket = () => {
      // Skip WebSocket connection in development if no backend is configured
      if (import.meta.env.DEV && !import.meta.env.VITE_NOTIFICATIONS_WS_URL) {
        console.log('WebSocket notifications disabled - no backend configured');
        return;
      }
      
      try {
        ws = new WebSocket(import.meta.env.VITE_NOTIFICATIONS_WS_URL || 'ws://localhost:4001/notifications');
        
        ws.onopen = () => {
          console.log('Notifications WebSocket connected');
          reconnectAttempts = 0; // Reset on successful connection
        };
        
        ws.onmessage = (event) => {
          try {
            const notification = JSON.parse(event.data);
            
            // Add to notification list
            addNotification(notification);
            
            // Send push notification if enabled
            if (preferences.enablePush && notification.pushEnabled !== false) {
              sendPushNotification(notification.title, {
                body: notification.message,
                data: notification.data
              });
            }
            
          } catch (err) {
            console.error('Error processing notification:', err);
          }
        };
        
        ws.onerror = (error) => {
          // Only log error if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts) {
            console.warn('Notifications WebSocket connection failed - retrying...');
          }
        };
        
        ws.onclose = () => {
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Notifications WebSocket disconnected - retry ${reconnectAttempts}/${maxReconnectAttempts}`);
            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
          } else {
            console.log('Notifications WebSocket connection failed - operating in offline mode');
          }
        };
      } catch (err) {
        if (reconnectAttempts === 0) {
          console.warn('WebSocket notifications unavailable - operating in offline mode');
        }
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [addNotification, preferences.enablePush, sendPushNotification]);

  const value = {
    // State
    notifications,
    preferences,
    
    // Basic methods
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByCategory,
    
    // Typed notification methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Business-specific methods
    showTransactionUpdate,
    showPriceAlert,
    showInventoryAlert,
    showDeliveryUpdate,
    
    // Settings
    updatePreferences,
    requestPushPermission,
    sendPushNotification,
    
    // Computed values
    unreadCount: notifications.filter(n => !n.read).length,
    hasUnread: notifications.some(n => !n.read),
    recentNotifications: notifications.slice(0, 5),
    
    // Constants
    NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};