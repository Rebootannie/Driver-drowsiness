import { useState } from 'react'
import { Activity, AlertTriangle, Clock } from 'lucide-react'
import { Header } from './components/dashboard/header'
import { StatusCard } from './components/dashboard/status-card'
import { DriverStatus } from './components/dashboard/driver-status'
import { StatsChart } from './components/dashboard/stats-chart'
import { RecentAlerts } from './components/dashboard/recent-alerts'
import { CameraView } from './components/dashboard/camera-view'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {

  const [driverStatus] = useState('awake')
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col">

      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">

        {/* top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-center">
          <StatusCard
            title="Detection Status"
            value="Active"
            description="System is monitoring"
            icon={<Activity className="h-4 w-4" />}
          />
          
          <StatusCard
            title="Current Session"
            value="01:24:56"
            description="Time since session start"
            icon={<Clock className="h-4 w-4" />}
          />
          
        </div>
        
        {/* middle chart and sleep status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DriverStatus status={driverStatus} />
          </div>
          <div className="lg:col-span-3">
            <StatsChart />
          </div>
        </div>
        
        {/* bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <CameraView />
          
          <Card className="md:col-span-1">

            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Hardware monitoring</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Raspberry Pi CPU</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[42%] rounded-full bg-primary"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Raspberry Pi Memory</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[68%] rounded-full bg-primary"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Camera Status</span>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Arduino Connection</span>
                    <span className="text-sm text-green-500">Connected</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Buzzer</span>
                    <span className="text-sm text-green-500">Ready</span>
                  </div>
                </div>
              </div>
            </CardContent>

          </Card>
          
          <RecentAlerts />

        </div>

      </main>

    </div>
  )
  // -----------------------------------------------------------------------
}

export default App