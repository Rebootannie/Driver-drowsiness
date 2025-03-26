// src/components/dashboard/stats-chart.jsx
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import drowsinessService from "../../lib/drowsiness-service"

// Format timestamp for display
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Process raw data for chart display
const processChartData = (rawData) => {
  return rawData.map(item => ({
    time: formatTime(item.timestamp),
    drowsiness: item.isDrowsy ? 100 : 0, // Convert boolean to numeric for display
    alertState: item.isDrowsy ? "Drowsy" : "Alert"
  }));
};

export function StatsChart() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("1h");
  const [drowsyPercentage, setDrowsyPercentage] = useState(0);
  
  // Data update callback
  const updateData = useCallback((rawData) => {
    let filteredData = rawData;
    
    // Filter by time range based on active tab
    const hours = activeTab === "1h" ? 1 : activeTab === "3h" ? 3 : 24;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    filteredData = rawData.filter(d => new Date(d.timestamp) >= cutoff);
    
    // Calculate percentage of time spent drowsy
    const drowsyPoints = filteredData.filter(d => d.isDrowsy).length;
    const percentage = filteredData.length > 0 ? 
      Math.round((drowsyPoints / filteredData.length) * 100) : 0;
    setDrowsyPercentage(percentage);
    
    // Process for chart display
    setData(processChartData(filteredData));
  }, [activeTab]);
  
  // Subscribe to drowsiness service
  useEffect(() => {
    // Initial data load
    drowsinessService.fetchHistory(
      activeTab === "1h" ? 1 : activeTab === "3h" ? 3 : 24
    );
    
    // Subscribe to updates
    const unsubscribe = drowsinessService.addListener(updateData);
    return unsubscribe;
  }, [activeTab, updateData]);
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Drowsiness States</CardTitle>
        <CardDescription>
          Drowsy time: {drowsyPercentage}% of selected period
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
                <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} ticks={[0, 100]} tickFormatter={(value) => value === 100 ? 'Drowsy' : 'Alert'} />
            <Tooltip formatter={(value, name) => [value === 100 ? 'Drowsy' : 'Alert', 'State']} />
            <Area
              type="stepAfter"
              dataKey="drowsiness"
              name="Drowsiness State"
              stroke="#ff4d4f"
              fillOpacity={1}
              fill="url(#colorDrowsiness)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}