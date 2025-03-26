import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function DriverStatus({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case "awake":
        return "bg-green-500"
      case "drowsy":
        return "bg-red-500"
      case "distracted":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "awake":
        return "Driver is Alert"
      case "drowsy":
        return "Driver is Drowsy!"
      case "distracted":
        return "Driver is Distracted"
      default:
        return "Status Unknown"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${getStatusColor()} text-white`}>
        <CardTitle className="text-lg font-bold text-center">Driver Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center flex-col">
          <div className={`h-16 w-16 rounded-full ${getStatusColor()} flex items-center justify-center mb-4`}>
            <StatusIcon status={status} />
          </div>
          <h3 className="text-xl font-bold mb-2">{getStatusText()}</h3>
          <p className="text-sm text-muted-foreground">
            {status === "drowsy" && "Warning: Take a break soon!"}
            {status === "distracted" && "Warning: Keep eyes on the road!"}
            {status === "awake" && "Safe driving detected"}
            {status === "unknown" && "Waiting for detection data..."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusIcon({ status }) {
  if (status === "awake") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M12 18a6 6 0 0 0 0-12" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    )
  }
  
  if (status === "drowsy") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M6 16c.6.5 1.2 1.5 3 2.5 2.5 1.5 5.5.5 8-1.5" />
        <path d="M19 9c-.2-1-1.5-3-5.5-1-4.5 2.1-8.5 0-8.5-3" />
        <path d="M4 22V2" />
      </svg>
    )
  }
  
  if (status === "distracted") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  }
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 15h8"/>
      <circle cx="8" cy="9" r="0.5" fill="currentColor"/>
      <circle cx="16" cy="9" r="0.5" fill="currentColor"/>
    </svg>
  )
}