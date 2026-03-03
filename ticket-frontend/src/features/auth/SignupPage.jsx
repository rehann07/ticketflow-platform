import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import api from "@/api/axiosConfig";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

const Signup = ({ className }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Send Data to Backend
      await api.post("/auth/signup", {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      // Redirect to Login
      navigate("/");

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Registration failed"
        );
      } else {
        setError("Something went wrong. Is the backend running?");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn(
      "min-h-screen bg-slate-50 animate-in fade-in duration-500",
      className
    )}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">

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

          <div className="w-full rounded-xl border shadow-lg bg-white p-6">
            <div className="flex flex-col space-y-1.5 mb-6 text-center">
              <h1 className="font-semibold tracking-tight text-xl">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to get started
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe123"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold tracking-wide"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="font-medium text-primary hover:underline cursor-pointer"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;