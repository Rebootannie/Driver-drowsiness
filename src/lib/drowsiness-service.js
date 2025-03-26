// src/lib/drowsiness-service.js

class DrowsinessService {
    constructor() {
      this.listeners = [];
      this.data = [];
      this.isConnected = false;
      this.ws = null;
      this.connect();
      
      // Track state changes for additional metrics
      this.stateChanges = [];
      this.currentState = false;
      this.drowsyStartTime = null;
      this.totalDrowsyTime = 0;
      this.lastUpdateTime = null;
    }
  
    connect() {
      this.ws = new WebSocket('ws://localhost:5000');
  
      this.ws.onopen = () => {
        console.log('Connected to drowsiness service');
        this.isConnected = true;
      };
  
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'data') {
          // Single data point update
          const newData = message.data;
          this.data.push(newData);
          
          // Limit array size to prevent memory issues
          if (this.data.length > 1000) this.data.shift();
          
          // Process state changes
          this.processStateChange(newData);
          
          // Notify listeners
          this.notifyListeners();
        } else if (message.type === 'history') {
          // Historical data
          this.data = message.data;
          this.notifyListeners();
        }
      };
  
      this.ws.onclose = () => {
        console.log('Disconnected from drowsiness service');
        this.isConnected = false;
        
        // Attempt to reconnect after delay
        setTimeout(() => this.connect(), 5000);
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.ws.close();
      };
    }
    
    // Track state changes and calculate durations
    processStateChange(dataPoint) {
      const now = new Date(dataPoint.timestamp);
      
      // First data point
      if (this.lastUpdateTime === null) {
        this.currentState = dataPoint.isDrowsy;
        this.lastUpdateTime = now;
        
        if (dataPoint.isDrowsy) {
          this.drowsyStartTime = now;
        }
        return;
      }
      
      // State changed from not drowsy to drowsy
      if (!this.currentState && dataPoint.isDrowsy) {
        this.drowsyStartTime = now;
        this.stateChanges.push({
          type: 'drowsy-start',
          timestamp: now
        });
      } 
      // State changed from drowsy to not drowsy
      else if (this.currentState && !dataPoint.isDrowsy) {
        if (this.drowsyStartTime) {
          const duration = now - this.drowsyStartTime;
          this.totalDrowsyTime += duration;
          
          this.stateChanges.push({
            type: 'drowsy-end',
            timestamp: now,
            duration: duration
          });
          
          this.drowsyStartTime = null;
        }
      }
      
      this.currentState = dataPoint.isDrowsy;
      this.lastUpdateTime = now;
    }
  
    // Get drowsiness statistics
    getStatistics() {
      return {
        isDrowsy: this.currentState,
        totalDrowsyTime: this.totalDrowsyTime,
        drowsyStartTime: this.drowsyStartTime,
        stateChanges: this.stateChanges.length,
        drowsyPercentage: this.calculateDrowsyPercentage()
      };
    }
    
    // Calculate percentage of time spent drowsy in recent period
    calculateDrowsyPercentage(hours = 1) {
      if (this.data.length < 2) return 0;
      
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      const recentData = this.data.filter(d => new Date(d.timestamp) >= cutoff);
      if (recentData.length === 0) return 0;
      
      const drowsyPoints = recentData.filter(d => d.isDrowsy).length;
      return Math.round((drowsyPoints / recentData.length) * 100);
    }
  
    addListener(callback) {
      this.listeners.push(callback);
      // Immediately send current data to new listener
      if (this.data.length > 0) {
        callback(this.data);
      }
      
      // Return function to remove listener
      return () => {
        this.listeners = this.listeners.filter(l => l !== callback);
      };
    }
  
    notifyListeners() {
      this.listeners.forEach(listener => listener(this.data));
    }
  
    // Get filtered data for different time ranges
    getDataForTimeRange(hours) {
      if (!hours) return this.data;
      
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      return this.data.filter(d => new Date(d.timestamp) >= cutoff);
    }
  
    // Fetch historical data if needed
    async fetchHistory(hours) {
      try {
        const response = await fetch(`http://localhost:5000/api/drowsiness/history?hours=${hours}`);
        const data = await response.json();
        this.data = data;
        this.notifyListeners();
        return data;
      } catch (error) {
        console.error('Error fetching drowsiness history:', error);
        return [];
      }
    }
  }
  
  // Create singleton instance
  const drowsinessService = new DrowsinessService();
  export default drowsinessService;