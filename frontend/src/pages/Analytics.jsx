import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  BarChart3, 
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Download,
  Activity,
  Brain,
  Zap
} from "lucide-react";
import { userData, lessons, simulations, achievements, experimentData } from "../data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { toast } from "sonner";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [metricType, setMetricType] = useState("all");

  // Generate mock analytics data
  const weeklyProgress = [
    { day: "Mon", studyTime: 45, concepts: 3, xp: 120 },
    { day: "Tue", studyTime: 60, concepts: 5, xp: 180 },
    { day: "Wed", studyTime: 30, concepts: 2, xp: 90 },
    { day: "Thu", studyTime: 75, concepts: 6, xp: 200 },
    { day: "Fri", studyTime: 50, concepts: 4, xp: 160 },
    { day: "Sat", studyTime: 90, concepts: 7, xp: 250 },
    { day: "Sun", studyTime: 40, concepts: 3, xp: 130 }
  ];

  const skillProgress = [
    { skill: "CRISPR", progress: 85, color: "#3B82F6" },
    { skill: "Ethics", progress: 72, color: "#10B981" },
    { skill: "Climate Science", progress: 68, color: "#8B5CF6" },
    { skill: "Gene Expression", progress: 55, color: "#F59E0B" },
    { skill: "Data Analysis", progress: 63, color: "#EF4444" }
  ];

  const learningCategories = [
    { name: "Lessons", value: 40, color: "#3B82F6" },
    { name: "Simulations", value: 30, color: "#10B981" },
    { name: "Ethics", value: 20, color: "#8B5CF6" },
    { name: "AI Chat", value: 10, color: "#F59E0B" }
  ];

  const performanceMetrics = [
    { metric: "Overall Progress", value: 78, target: 80, unit: "%" },
    { metric: "Study Streak", value: userData.streak, target: 14, unit: "days" },
    { metric: "Concepts Mastered", value: 24, target: 30, unit: "" },
    { metric: "Simulation Success", value: 85, target: 90, unit: "%" }
  ];

  const monthlyTrends = [
    { month: "Jan", lessons: 12, simulations: 8, ethics: 5 },
    { month: "Feb", lessons: 15, simulations: 12, ethics: 7 },
    { month: "Mar", lessons: 18, simulations: 15, ethics: 9 },
    { month: "Apr", lessons: 22, simulations: 18, ethics: 12 },
    { month: "May", lessons: 25, simulations: 20, ethics: 14 },
    { month: "Jun", lessons: 28, simulations: 23, ethics: 16 }
  ];

  const handleExportData = () => {
    toast.success("Analytics data exported! 📊 Download starting...");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Analytics
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Track your progress and identify areas for improvement
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {index === 0 && <TrendingUp className="h-5 w-5 text-blue-600" />}
                  {index === 1 && <Clock className="h-5 w-5 text-green-600" />}
                  {index === 2 && <Brain className="h-5 w-5 text-purple-600" />}
                  {index === 3 && <Target className="h-5 w-5 text-orange-600" />}
                </div>
                <Badge variant={metric.value >= metric.target ? "default" : "secondary"}>
                  {metric.value >= metric.target ? "On Track" : "Needs Focus"}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
                </div>
                
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {metric.value}{metric.unit}</span>
                  <span>Target: {metric.target}{metric.unit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Your daily learning patterns this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="studyTime" fill="#3B82F6" name="Study Time (min)" />
                  <Bar dataKey="xp" fill="#10B981" name="XP Earned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Progress */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Skill Development
            </CardTitle>
            <CardDescription>Your mastery level in key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillProgress.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <span className="text-sm text-gray-500">{skill.progress}%</span>
                  </div>
                  <Progress 
                    value={skill.progress} 
                    className="h-2"
                    style={{ 
                      background: `${skill.color}20`,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Distribution */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Time Distribution
            </CardTitle>
            <CardDescription>How you spend your learning time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={learningCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {learningCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Learning Trends
            </CardTitle>
            <CardDescription>Your progress over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="lessons" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Lessons Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="simulations" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Simulations Run"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ethics" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Ethics Scenarios"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Sessions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Study Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Sessions:</span>
                <span className="text-sm font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Duration:</span>
                <span className="text-sm font-medium">52 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longest Streak:</span>
                <span className="text-sm font-medium">18 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Best Day:</span>
                <span className="text-sm font-medium">Saturday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Peak Hour:</span>
                <span className="text-sm font-medium">2-4 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Progress */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.name}</p>
                  {achievement.unlocked ? (
                    <Badge variant="default" className="text-xs">Unlocked</Badge>
                  ) : (
                    <div className="space-y-1">
                      <Progress value={achievement.progress || 0} className="h-1" />
                      <p className="text-xs text-gray-500">{achievement.progress || 0}%</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Recommendations */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Focus Area</p>
                <p className="text-xs text-blue-700">Spend more time on Gene Expression concepts</p>
              </div>
              
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-900">Great Progress</p>
                <p className="text-xs text-green-700">Your CRISPR understanding is excellent!</p>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="text-sm font-medium text-purple-900">Challenge Yourself</p>
                <p className="text-xs text-purple-700">Try advanced simulation scenarios</p>
              </div>
              
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-sm font-medium text-orange-900">Study Habit</p>
                <p className="text-xs text-orange-700">Maintain your weekend study routine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;