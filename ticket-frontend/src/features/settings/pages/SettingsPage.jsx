import React, { useEffect, useState } from "react";
import { ArrowLeft, User, Lock, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";

const Settings = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me");
        setProfile({
          fullName: res.data.fullName,
          email: res.data.email,
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await api.put("/user/me", {
        fullName: profile.fullName,
      });

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    try {
      setLoading(true);

      await api.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="-ml-2 hover:bg-slate-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">
          Account Settings
        </h1>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={profile.email}
                disabled
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="bg-black text-white hover:bg-slate-800"
            >
              <Save className="mr-2 h-4 w-4" /> 
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handlePasswordChange}
              disabled={loading}
              className="bg-black text-white hover:bg-slate-800"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;