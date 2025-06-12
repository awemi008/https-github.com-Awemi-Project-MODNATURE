import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Award,
  BookOpen,
  Lightbulb,
  Target,
  ChevronRight
} from "lucide-react";
import { lessons } from "../data/mockData";
import { toast } from "sonner";

const LessonDetail = () => {
  const { id } = useParams();
  const lesson = lessons.find(l => l.id === parseInt(id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(lesson?.progress || 0);
  const [completedSections, setCompletedSections] = useState([]);

  useEffect(() => {
    if (lesson) {
      setCurrentProgress(lesson.progress);
      // Simulate completed sections based on progress
      const sectionsCount = Math.floor((lesson.progress / 100) * 4);
      setCompletedSections(Array.from({ length: sectionsCount }, (_, i) => i));
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
        <Button asChild className="mt-4">
          <Link to="/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  const sections = [
    {
      id: 0,
      title: "Introduction & Overview",
      duration: "8 min",
      type: "video",
      description: "Understanding the basics and real-world applications"
    },
    {
      id: 1,
      title: "Core Concepts",
      duration: "15 min",
      type: "interactive",
      description: "Deep dive into the scientific principles"
    },
    {
      id: 2,
      title: "Case Studies",
      duration: "12 min",
      type: "reading",
      description: "Real-world examples and applications"
    },
    {
      id: 3,
      title: "Practice & Assessment",
      duration: "10 min",
      type: "quiz",
      description: "Test your understanding with interactive questions"
    }
  ];

  const handleStartLesson = () => {
    setIsPlaying(true);
    toast.success("Lesson started! 🎯");
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        const newProgress = Math.min(prev + 5, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          setIsPlaying(false);
          toast.success("Lesson completed! 🎉 You earned 50 XP!");
        }
        return newProgress;
      });
    }, 1000);
  };

  const handleSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      toast.success("Section completed! Great progress! 📚");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/lessons" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>
      </div>

      {/* Lesson Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30"
            >
              {lesson.difficulty}
            </Badge>
            <div className="flex items-center text-blue-100">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.duration}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl">
            {lesson.description}
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-3 bg-white/20" />
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleStartLesson}
            disabled={isPlaying}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                In Progress...
              </>
            ) : currentProgress === 100 ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Completed
              </>
            ) : currentProgress > 0 ? (
              <>
                <Play className="h-5 w-5 mr-2" />
                Continue Learning
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Sections */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Lesson Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    completedSections.includes(section.id)
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSectionComplete(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {completedSections.includes(section.id) ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium">{section.id + 1}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {section.duration}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interactive Content Simulation */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Interactive Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🧬 Gene Editing Visualization</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Watch how CRISPR-Cas9 identifies and cuts specific DNA sequences
                  </p>
                  <div className="relative h-32 bg-white rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Interactive Animation</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🌱 Climate Adaptation Examples</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore real-world applications in drought-resistant crops
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Wheat", "Rice", "Corn"].map((crop) => (
                      <div key={crop} className="p-3 bg-white rounded-lg border text-center">
                        <div className="text-2xl mb-1">🌾</div>
                        <p className="text-xs font-medium">{crop}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Objectives */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Understand CRISPR-Cas9 mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Learn climate adaptation strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analyze real-world applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Evaluate ethical considerations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Topics Covered */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lesson.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Lesson */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.find(l => l.id === lesson.id + 1) ? (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {lessons.find(l => l.id === lesson.id + 1).title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {lessons.find(l => l.id === lesson.id + 1).description}
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/lessons/${lesson.id + 1}`}>
                      Next Lesson
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Congratulations! You've completed all available lessons.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;