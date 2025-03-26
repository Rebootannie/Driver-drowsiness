

// ------------------------------------------
// src/components/dashboard/recent-alerts.jsx
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import drowsinessService from "../../lib/drowsiness-service"

export function RecentAlerts() {
  const [alerts, setAlerts] = useState([])
  
  useEffect(() => {
    const unsubscribe = drowsinessService.addListener((data) => {
      if (data.length < 2) return;
      
      // Look for state transitions to drowsy
      const alertEvents = [];
      
      for (let i = 1; i < data.length; i++) {
        // If state changed from alert to drowsy
        if (!data[i-1].isDrowsy && data[i].isDrowsy) {
          alertEvents.push({
            id: `alert-${i}-${data[i].timestamp}`,
            timestamp: data[i].timestamp,
            type: "drowsiness",
            message: "Drowsiness detected!",
            severity: "high"
          });
        }
      }
      
      // Sort by most recent and take only the 5 most recent alerts
      const recentAlerts = alertEvents
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      
      setAlerts(recentAlerts);
    });
    
    return unsubscribe;
  }, []);

  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch (e) {
      return isoString;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }
  
  // Keep existing getTypeIcon function...
  
  const getTypeIcon = (type) => {
    switch (type) {
      case "drowsiness":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16c.6.5 1.2 1.5 3 2.5 2.5 1.5 5.5.5 8-1.5" />
            <path d="M19 9c-.2-1-1.5-3-5.5-1-4.5 2.1-8.5 0-8.5-3" />
          </svg>
        )
      case "distraction":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
    }
  }


  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                <div className={`${getSeverityClass(alert.severity)} text-white p-2 rounded-md mt-1`}>
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No recent alerts</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
