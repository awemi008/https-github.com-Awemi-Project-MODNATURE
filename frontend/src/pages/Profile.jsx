import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { 
  User, 
  Award,
  Trophy,
  Settings,
  Bell,
  Shield,
  Download,
  Edit,
  Calendar,
  Mail,
  School,
  Target,
  BookOpen,
  FlaskConical,
  Scale,
  MessageCircle,
  Flame,
  Star
} from "lucide-react";
import { userData, achievements, lessons, simulations } from "../data/mockData";
import { toast } from "sonner";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: "alex.thompson@school.edu",
    school: userData.school,
    grade: userData.grade,
    bio: "Passionate about genetic engineering and its potential to solve climate challenges. Aspiring biotechnologist working towards a sustainable future."
  });
  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    chatMessages: true
  });

  const handleSaveProfile = () => {
    setEditMode(false);
    toast.success("Profile updated successfully! ✨");
  };

  const handleExportData = () => {
    toast.success("Learning data exported! 📊 Download will start shortly...");
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked);
  
  const stats = [
    { 
      label: "Current Level", 
      value: userData.level, 
      icon: <Trophy className="h-5 w-5" />,
      color: "text-yellow-600 bg-yellow-100"
    },
    { 
      label: "Total XP", 
      value: userData.totalPoints, 
      icon: <Star className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100"
    },
    { 
      label: "Study Streak", 
      value: `${userData.streak} days`, 
      icon: <Flame className="h-5 w-5" />,
      color: "text-orange-600 bg-orange-100"
    },
    { 
      label: "Lessons Done", 
      value: `${userData.completedLessons}/${userData.totalLessons}`, 
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-green-600 bg-green-100"
    }
  ];

  const activityStats = [
    { label: "Lessons Completed", value: userData.completedLessons, icon: BookOpen, max: userData.totalLessons },
    { label: "Simulations Run", value: userData.simulationsRun, icon: FlaskConical, max: 50 },
    { label: "Ethics Scenarios", value: userData.ethicalScenariosCompleted, icon: Scale, max: 20 },
    { label: "AI Conversations", value: 47, icon: MessageCircle, max: 100 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile & Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your account, track achievements, and customize your learning experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {editMode ? "Save" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={profileData.school}
                    onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                    disabled={!editMode}
                    className={!editMode ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={profileData.grade}
                    onChange={(e) => setProfileData({...profileData, grade: e.target.value})}
                    disabled={!editMode}
                    className={!editMode ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!editMode}
                  className={!editMode ? "bg-gray-50 resize-none" : "resize-none"}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Analytics */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Learning Progress
              </CardTitle>
              <CardDescription>Your activity across different learning modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activityStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const percentage = (stat.value / stat.max) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">{stat.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">{stat.value}/{stat.max}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Gallery */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievement Gallery
              </CardTitle>
              <CardDescription>
                {unlockedAchievements.length} of {achievements.length} achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      achievement.unlocked 
                        ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md" 
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="text-sm font-medium mb-1">{achievement.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <Badge variant="default" className="text-xs">Unlocked</Badge>
                    ) : (
                      <div className="space-y-1">
                        <Progress value={achievement.progress || 0} className="h-1" />
                        <span className="text-xs text-gray-500">{achievement.progress || 0}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </h4>
                <div className="space-y-3">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotifications({...notifications, [key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Data & Privacy
                </h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Learning Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info("Privacy settings will open soon! 🔒")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Completed "Climate Adaptation" lesson</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Started wheat simulation experiment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Unlocked "Ethical Thinker" badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Discussed gene patents with AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Created ethics presentation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Complete all lessons</span>
                    <span className="text-xs text-green-600">8/15</span>
                  </div>
                  <Progress value={(8/15)*100} className="h-2" />
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Run 30 simulations</span>
                    <span className="text-xs text-blue-600">23/30</span>
                  </div>
                  <Progress value={(23/30)*100} className="h-2" />
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">All ethics scenarios</span>
                    <span className="text-xs text-purple-600">5/12</span>
                  </div>
                  <Progress value={(5/12)*100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Account settings will open soon! ⚙️")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Help center will open soon! 💬")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;