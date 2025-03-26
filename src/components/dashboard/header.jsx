import { Bell, Settings } from "lucide-react"
import { Button } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="font-semibold text-lg flex items-center gap-2">
          <span className="bg-primary text-primary-foreground p-1 rounded">DDD</span>
          <span className="hidden sm:inline-block">Driver Drowsiness Detection</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}