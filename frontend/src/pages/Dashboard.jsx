import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  BookOpen, 
  FlaskConical, 
  Scale, 
  MessageCircle, 
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Flame,
  ChevronRight
} from "lucide-react";
import { lessons, simulations, achievements, userData } from "../data/mockData";

const Dashboard = () => {
  const recentLessons = lessons.slice(0, 3);
  const activeSimulations = simulations.filter(s => s.status === "Active" || s.status === "In Progress").slice(0, 2);
  const recentAchievements = achievements.filter(a => a.unlocked).slice(-2);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userData.name.split(' ')[0]}! 🧬</h1>
          <p className="text-xl text-blue-100 mb-6">
            Ready to explore the future of genetic adaptation?
          </p>
          <Button 
            asChild
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link to="/lessons">Continue Learning</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{userData.level}</div>
            <p className="text-xs text-blue-600">
              {userData.totalPoints} XP earned
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Learning Streak</CardTitle>
            <Flame className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{userData.streak} days</div>
            <p className="text-xs text-green-600">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-750">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {userData.completedLessons}/{userData.totalLessons}
            </div>
            <Progress value={(userData.completedLessons / userData.totalLessons) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Simulations Run</CardTitle>
            <FlaskConical className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{userData.simulationsRun}</div>
            <p className="text-xs text-orange-600">
              +3 this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          asChild
          variant="outline" 
          className="h-20 flex-col gap-2 bg-white/80 backdrop-blur border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
        >
          <Link to="/lessons">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">Lessons</span>
          </Link>
        </Button>

        <Button 
          asChild
          variant="outline" 
          className="h-20 flex-col gap-2 bg-white/80 backdrop-blur border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:scale-105"
        >
          <Link to="/simulations">
            <FlaskConical className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium">Simulations</span>
          </Link>
        </Button>

        <Button 
          asChild
          variant="outline" 
          className="h-20 flex-col gap-2 bg-white/80 backdrop-blur border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 hover:scale-105"
        >
          <Link to="/ethics">
            <Scale className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">Ethics</span>
          </Link>
        </Button>

        <Button 
          asChild
          variant="outline" 
          className="h-20 flex-col gap-2 bg-white/80 backdrop-blur border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 hover:scale-105"
        >
          <Link to="/ai-chat">
            <MessageCircle className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-medium">AI Chat</span>
          </Link>
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Lessons */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Recent Lessons
                </CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/lessons" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  lesson.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {lesson.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={lesson.completed ? "default" : "secondary"} className="text-xs">
                      {lesson.completed ? "Completed" : `${lesson.progress}%`}
                    </Badge>
                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Simulations */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-purple-600" />
                  Active Simulations
                </CardTitle>
                <CardDescription>Monitor your experiments</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/simulations" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSimulations.map((sim) => (
              <div key={sim.id} className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{sim.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {sim.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">{sim.organism} - {sim.targetTrait}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress: Level {sim.currentLevel}/{sim.maxLevel}</span>
                    <span>{Math.round((sim.currentLevel / sim.maxLevel) * 100)}%</span>
                  </div>
                  <Progress value={(sim.currentLevel / sim.maxLevel) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Survival: {sim.survivalRate}%</span>
                    <span>Yield: +{sim.yieldIncrease}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest accomplishments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Analytics */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Quick Stats
            </CardTitle>
            <CardDescription>Your progress this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Study Time</span>
                <span className="text-sm font-medium">4.2 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Concepts Learned</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scenarios Completed</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Interactions</span>
                <span className="text-sm font-medium">18</span>
              </div>
            </div>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/analytics">View Detailed Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;