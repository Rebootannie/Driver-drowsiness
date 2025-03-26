import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useToast } from "@/lib/use-toast"

export function CameraView() {
  const [isActive, setIsActive] = useState(false)
  const canvasRef = useRef(null)
  const { toast } = useToast()
  
  // Function to simulate camera feed with a mock visualization
  const simulateCameraFeed = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw simulated face outline
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    
    // Face oval
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 80, 100, 0, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Eyes
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2 - 30, canvas.height / 2 - 20, 15, 10, 0, 0, 2 * Math.PI)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2 + 30, canvas.height / 2 - 20, 15, 10, 0, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Mouth
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height / 2 + 30, 25, 10, 0, 0, Math.PI)
    ctx.stroke()
    
    // Detection points
    ctx.fillStyle = '#4ade80'
    
    // Eye landmarks
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.arc(
        canvas.width / 2 - 30 - 15 + i * 6, 
        canvas.height / 2 - 20, 
        2, 0, 2 * Math.PI
      )
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(
        canvas.width / 2 + 30 - 15 + i * 6, 
        canvas.height / 2 - 20, 
        2, 0, 2 * Math.PI
      )
      ctx.fill()
    }
    
    // Add detection status text
    ctx.fillStyle = '#fff'
    ctx.font = '14px sans-serif'
    ctx.fillText('Status: Active', 10, 20)
    
    // Add eye openness metrics
    const randomEyeOpenness = Math.random() * 0.3 + 0.7 // 0.7 to 1.0
    ctx.fillText(`Eye Openness: ${randomEyeOpenness.toFixed(2)}`, 10, 40)
    
    // Add bounding box
    ctx.strokeStyle = '#8884d8'
    ctx.strokeRect(
      canvas.width / 2 - 100, 
      canvas.height / 2 - 120, 
      200, 
      240
    )
  }
  
  useEffect(() => {
    let animationId
    
    if (isActive) {
      const animate = () => {
        simulateCameraFeed()
        animationId = requestAnimationFrame(animate)
      }
      
      animate()
      
      toast({
        title: "Camera Feed Active",
        description: "Live detection is now running"
      })
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isActive, toast])
  
  const handleToggleCamera = () => {
    setIsActive(prev => !prev)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative mb-4 w-full max-w-md overflow-hidden rounded-lg border border-border">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full bg-black"
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
              <div className="text-center">
                <p className="mb-2">Camera Feed Inactive</p>
                <Button onClick={handleToggleCamera}>
                  Start Camera
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {isActive && (
          <Button onClick={handleToggleCamera} variant="outline">
            Stop Camera
          </Button>
        )}
      </CardContent>
    </Card>
  )
}