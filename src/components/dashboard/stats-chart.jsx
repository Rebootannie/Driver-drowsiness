import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for demo purposes
const generateMockData = (points) => {
  const data = []
  const start = Date.now() - points * 60000
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(start + i * 60000)
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    // Generate random values with some realistic patterns
    const drowsinessValue = Math.max(0, Math.min(100, 
      20 + Math.sin(i / 3) * 15 + Math.random() * 10 + 
      (i > points * 0.7 ? 30 : 0)  // Increase drowsiness near the end
    ))
    
    data.push({
      time: timeString,
      drowsiness: drowsinessValue
    })
  }
  return data
}

export function StatsChart() {
  const [data, setData] = useState(() => generateMockData(24))
  const [activeTab, setActiveTab] = useState("1h")
  
  useEffect(() => {
    let points = 60
    
    if (activeTab === "1h") points = 60
    else if (activeTab === "3h") points = 180
    else if (activeTab === "24h") points = 24 * 60
    
    setData(generateMockData(points / 10))  // Reducing points for demo performance
  }, [activeTab])
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Drowsiness Levels</CardTitle>
        <CardDescription>
          Detection values over time (0-100)
        </CardDescription>
        <Tabs defaultValue="1h" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="1h">1h</TabsTrigger>
            <TabsTrigger value="3h">3h</TabsTrigger>
            <TabsTrigger value="24h">24h</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDrowsiness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="drowsiness"
              name="Drowsiness Level"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorDrowsiness)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}