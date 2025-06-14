import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Search,
  Filter,
  CheckCircle,
  Circle,
  ChevronRight,
  Play
} from "lucide-react";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/lessons`);
      
      if (response.ok) {
        const lessonsData = await response.json();
        // Add mock progress data for demo purposes
        const lessonsWithProgress = lessonsData.map((lesson, index) => ({
          ...lesson,
          progress: index === 0 ? 100 : index === 1 ? 100 : index === 2 ? 65 : 0,
          completed: index < 2
        }));
        setLessons(lessonsWithProgress);
      } else {
        console.error("Failed to fetch lessons");
        setLessons([]);
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || lesson.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && lesson.completed) ||
                         (statusFilter === "in-progress" && !lesson.completed && lesson.progress > 0) ||
                         (statusFilter === "not-started" && lesson.progress === 0);
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const completedCount = lessons.filter(l => l.completed).length;
  const inProgressCount = lessons.filter(l => !l.completed && l.progress > 0).length;
  const totalLessons = lessons.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive Lessons
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Master the fundamentals of gene editing and climate adaptation with comprehensive, research-based content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-900">{completedCount}</p>
                  <p className="text-xs text-green-700">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-900">{inProgressCount}</p>
                  <p className="text-xs text-blue-700">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-900">{totalLessons}</p>
                  <p className="text-xs text-purple-700">Total Lessons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : lesson.progress > 0 ? (
                      <Play className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <Badge 
                      variant={lesson.difficulty === "Advanced" ? "destructive" : 
                              lesson.difficulty === "Intermediate" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {lesson.description}
                  </CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {lesson.topics?.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Progress */}
              {lesson.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{lesson.progress}%</span>
                  </div>
                  <Progress value={lesson.progress} className="h-2" />
                </div>
              )}

              {/* Lesson Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.duration}
                </div>
                <Button 
                  asChild
                  size="sm"
                  className={`${
                    lesson.completed 
                      ? "bg-green-600 hover:bg-green-700" 
                      : lesson.progress > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-purple-600 hover:bg-purple-700"
                  } text-white`}
                >
                  <Link to={`/lessons/${lesson.id}`}>
                    {lesson.completed ? "Review" : lesson.progress > 0 ? "Continue" : "Start"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lessons;