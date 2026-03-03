import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/assets/animations/login-animation";
import { useAuth } from "@/context/AuthContext"
import api from "@/api/axiosConfig"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      })

      const { token, id, username: loggedUsername, roles } = response.data

      // Save token separately
      localStorage.setItem("token", token)

      // Use AuthContext login
      login({
        id,
        username: loggedUsername,
        roles,
      })

      // Role-based redirect
      if (roles?.includes("ROLE_ADMIN")) {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }


    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password")
      } else {
        setError("Server error...")
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">

        {/* Branding / Logo */}
        <div className="flex justify-center md:justify-start mb-8">
          <div className="flex items-center gap-3">

            {/* The Icon Box */}
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-md transition-transform duration-300 hover:scale-110">
              <MessageSquare className="size-6" />
            </div>

            {/* The Stacked Text */}
            <div className="flex flex-col justify-center">
              <span className="font-bold text-2xl tracking-tight leading-none">
                Ticket<span className="text-primary">Flow</span>
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1">
                Real-Time Support Platform
              </span>
            </div>

          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">

            <form onSubmit={handleLogin} className={cn("flex flex-col gap-6")}>

              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your credentials below to login
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold tracking-wide"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              {/* Sign Up Link --- */}
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="underline underline-offset-4 cursor-pointer font-medium hover:text-primary"
                >
                  Sign up
                </span>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Right Side: Lottie Animation */}
      <div className="bg-slate-50 relative hidden lg:block">
        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
          {/* Lottie Container */}
          <div className="w-full max-w-2xl px-10">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </div>
      </div>
    </div>
  )
}