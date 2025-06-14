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
  ChevronRight,
  FileText,
  BarChart3,
  Beaker,
  Video,
  Users,
  Globe,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonData();
  }, [id]);

  const fetchLessonData = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/lessons/${id}`);
      
      if (response.ok) {
        const lessonData = await response.json();
        setLesson(lessonData);
        setCurrentProgress(lessonData.progress || 0);
        
        // Calculate completed sections based on progress
        const sectionsCount = lessonData.content?.sections?.length || 4;
        const completedCount = Math.floor((lessonData.progress || 0) / 100 * sectionsCount);
        setCompletedSections(Array.from({ length: completedCount }, (_, i) => i));
      } else {
        // Fallback to mock data if lesson not found in backend
        console.log("Lesson not found in backend, using mock data");
        setLesson(null);
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
        <p className="text-gray-600 mt-2">This lesson may not be available yet or the content is being updated.</p>
        <Button asChild className="mt-4">
          <Link to="/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  const getSectionIcon = (type) => {
    switch (type) {
      case "theory": return <BookOpen className="h-4 w-4" />;
      case "interactive": return <Zap className="h-4 w-4" />;
      case "comparison": return <BarChart3 className="h-4 w-4" />;
      case "case_studies": return <FileText className="h-4 w-4" />;
      case "data_analysis": return <BarChart3 className="h-4 w-4" />;
      case "molecular_biology": return <Beaker className="h-4 w-4" />;
      case "plant_biology": return <Lightbulb className="h-4 w-4" />;
      case "genetic_engineering": return <Beaker className="h-4 w-4" />;
      case "animal_physiology": return <Users className="h-4 w-4" />;
      case "philosophical_analysis": return <Target className="h-4 w-4" />;
      case "social_ethics": return <Globe className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

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

  const handleSectionClick = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
      toast.success("Section completed! Great progress! 📚");
    }
  };

  const renderSectionContent = (section) => {
    const content = section.content;
    
    return (
      <div className="space-y-6">
        {/* Text content */}
        {content.text && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{content.text}</p>
          </div>
        )}

        {/* Key points */}
        {content.key_points && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Key Points:</h4>
            <ul className="space-y-2">
              {content.key_points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison table */}
        {content.comparison_table && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Technique</th>
                  <th className="px-4 py-2 text-left font-semibold">Precision</th>
                  <th className="px-4 py-2 text-left font-semibold">Ease of Use</th>
                  <th className="px-4 py-2 text-left font-semibold">Applications</th>
                </tr>
              </thead>
              <tbody>
                {content.comparison_table.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 font-medium">{row.technique}</td>
                    <td className="px-4 py-2">{row.precision}</td>
                    <td className="px-4 py-2">{row.ease_of_use}</td>
                    <td className="px-4 py-2">{row.applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Case studies */}
        {content.case_studies && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Case Studies:</h4>
            {content.case_studies.map((study, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-green-900 mb-2">{study.title}</h5>
                  <p className="text-gray-700 text-sm mb-2">{study.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div><span className="font-medium">Outcome:</span> {study.outcome}</div>
                    <div><span className="font-medium">Significance:</span> {study.significance}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Interactive elements */}
        {content.interactive_elements && (
          <div className="space-y-4">
            {content.interactive_elements.map((element, index) => (
              <Card key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {element.title}
                  </h5>
                  <p className="text-purple-800 text-sm mb-3">{element.description}</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Play className="h-3 w-3 mr-1" />
                    Start Interactive
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sections = lesson.content?.sections || [];

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

          {lesson.content?.overview && (
            <p className="text-lg text-blue-100 mb-6 max-w-4xl">
              {lesson.content.overview}
            </p>
          )}

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
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    completedSections.includes(index)
                      ? "border-green-200 bg-green-50"
                      : index === currentSection 
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSectionClick(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {completedSections.includes(index) ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          {getSectionIcon(section.type)}
                          {section.title}
                        </h4>
                        <p className="text-sm text-gray-500">{section.duration} • {section.type}</p>
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

          {/* Current Section Content */}
          {sections[currentSection] && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSectionIcon(sections[currentSection].type)}
                  {sections[currentSection].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSectionContent(sections[currentSection])}
              </CardContent>
            </Card>
          )}

          {/* Quiz Section */}
          {lesson.content?.quiz && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.content.quiz.map((question, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">{question.question}</h4>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            optIndex === question.correct 
                              ? "bg-green-200 text-green-900" 
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-green-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Objectives */}
          {lesson.content?.learning_objectives && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.content.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Topics Covered */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lesson.topics?.map((topic, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          {lesson.content?.additional_resources && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lesson.content.additional_resources.map((resource, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Next Lesson */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Heat-Tolerant Livestock</h4>
                <p className="text-sm text-gray-600">
                  Learn about genetic modifications for temperature adaptation in farm animals
                </p>
                <Button size="sm" className="w-full">
                  Next Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;