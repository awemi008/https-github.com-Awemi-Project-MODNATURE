import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  Scale, 
  Users,
  Globe,
  Brain,
  Search,
  Filter,
  CheckCircle,
  Circle,
  ChevronRight,
  AlertTriangle,
  Heart,
  Building
} from "lucide-react";
import { ethicalScenarios, userData } from "../data/mockData";

const Ethics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredScenarios = ethicalScenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || scenario.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || scenario.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && scenario.completed) ||
                         (statusFilter === "not-completed" && !scenario.completed);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const completedCount = ethicalScenarios.filter(s => s.completed).length;
  const totalScenarios = ethicalScenarios.length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Human Enhancement":
        return <Users className="h-4 w-4" />;
      case "Economic Ethics":
        return <Building className="h-4 w-4" />;
      case "Environmental":
        return <Globe className="h-4 w-4" />;
      case "Social Justice":
        return <Heart className="h-4 w-4" />;
      default:
        return <Scale className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Human Enhancement":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Economic Ethics":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Environmental":
        return "bg-green-100 text-green-800 border-green-200";
      case "Social Justice":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Simple":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Complex":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Ethical Decision Quests
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Navigate complex moral dilemmas in genetic engineering and climate adaptation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <Scale className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-900">{totalScenarios}</p>
                  <p className="text-xs text-blue-700">Total Scenarios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-900">{userData.ethicalScenariosCompleted}</p>
                  <p className="text-xs text-purple-700">Decisions Made</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-orange-900">3</p>
                  <p className="text-xs text-orange-700">Complex Dilemmas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Introduction Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Why Ethics Matter in Gene Editing</h3>
              <p className="text-blue-100 mb-4">
                Every genetic modification decision has far-reaching consequences. Practice making informed, 
                ethical choices that balance scientific progress with human values and social justice.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Real-world scenarios</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  <span>Multiple perspectives</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  <span>Critical thinking</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-6xl">⚖️</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Human Enhancement">Human Enhancement</SelectItem>
                <SelectItem value="Economic Ethics">Economic Ethics</SelectItem>
                <SelectItem value="Environmental">Environmental</SelectItem>
                <SelectItem value="Social Justice">Social Justice</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Simple">Simple</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Complex">Complex</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-completed">Not Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {scenario.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <Badge className={getCategoryColor(scenario.category)}>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(scenario.category)}
                        {scenario.category}
                      </div>
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(scenario.difficulty)}
                    >
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors mb-2">
                    {scenario.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {scenario.description}
                  </CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Scenario Preview */}
              {scenario.scenario && (
                <div className="p-4 rounded-xl bg-gray-50 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {scenario.scenario.context}
                  </p>
                </div>
              )}

              {/* Decision Options Preview */}
              {scenario.scenario?.options && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Decision Options:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {scenario.scenario.options.slice(0, 2).map((option, index) => (
                      <div key={option.id} className="p-2 bg-white rounded-lg border border-gray-200 text-xs">
                        <span className="font-medium">Option {index + 1}:</span> {option.text.substring(0, 50)}...
                      </div>
                    ))}
                    {scenario.scenario.options.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{scenario.scenario.options.length - 2} more options...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  {scenario.completed ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Awaiting Decision</span>
                    </div>
                  )}
                </div>
                <Button 
                  asChild
                  size="sm"
                  className={`${
                    scenario.completed 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  <Link to={`/ethics/${scenario.id}`}>
                    {scenario.completed ? "Review Decision" : "Make Decision"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="text-center py-12">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ethics;