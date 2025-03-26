import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const MOCK_ALERTS = [
  {
    id: "alert-1",
    timestamp: "2025-03-25 13:25:30",
    type: "drowsiness",
    message: "High drowsiness level detected",
    severity: "high"
  },
  {
    id: "alert-2",
    timestamp: "2025-03-25 13:14:12",
    type: "distraction",
    message: "Driver distraction detected",
    severity: "medium"
  },
  {
    id: "alert-3",
    timestamp: "2025-03-25 12:59:45",
    type: "drowsiness",
    message: "Increasing drowsiness level",
    severity: "medium"
  },
  {
    id: "alert-4",
    timestamp: "2025-03-25 12:45:21",
    type: "system",
    message: "System calibration complete",
    severity: "low"
  },
  {
    id: "alert-5",
    timestamp: "2025-03-25 12:30:08",
    type: "system",
    message: "Detection system started",
    severity: "low"
  }
]

export function RecentAlerts() {
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
          {MOCK_ALERTS.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
              <div className={`${getSeverityClass(alert.severity)} text-white p-2 rounded-md mt-1`}>
                {getTypeIcon(alert.type)}
              </div>
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}