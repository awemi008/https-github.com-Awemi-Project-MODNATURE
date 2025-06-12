import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  ArrowLeft, 
  Scale,
  Users,
  Brain,
  AlertTriangle,
  CheckCircle,
  Globe,
  Heart,
  Building,
  Lightbulb,
  MessageSquare
} from "lucide-react";
import { ethicalScenarios } from "../data/mockData";
import { toast } from "sonner";

const EthicsDetail = () => {
  const { id } = useParams();
  const scenario = ethicalScenarios.find(s => s.id === parseInt(id));
  const [selectedOption, setSelectedOption] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [showResults, setShowResults] = useState(scenario?.completed || false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!scenario) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Scenario not found</h2>
        <Button asChild className="mt-4">
          <Link to="/ethics">Back to Ethics</Link>
        </Button>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Human Enhancement":
        return <Users className="h-5 w-5 text-purple-600" />;
      case "Economic Ethics":
        return <Building className="h-5 w-5 text-blue-600" />;
      case "Environmental":
        return <Globe className="h-5 w-5 text-green-600" />;
      case "Social Justice":
        return <Heart className="h-5 w-5 text-pink-600" />;
      default:
        return <Scale className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleSubmitDecision = () => {
    if (!selectedOption) {
      toast.error("Please select an option before submitting!");
      return;
    }
    
    if (!reasoning.trim()) {
      toast.error("Please provide your reasoning!");
      return;
    }

    setShowResults(true);
    toast.success("Decision submitted! 🎯 Analyzing the consequences...");
    
    // Simulate storing the decision
    setTimeout(() => {
      toast.success("Great thinking! You earned 25 XP for ethical reasoning! 🏆");
    }, 1500);
  };

  const getSelectedOption = () => {
    return scenario.scenario.options.find(opt => opt.id === selectedOption);
  };

  const steps = [
    { title: "Context", icon: <Brain className="h-4 w-4" /> },
    { title: "Decision", icon: <Scale className="h-4 w-4" /> },
    { title: "Results", icon: <CheckCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/ethics" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Ethics
          </Link>
        </Button>
      </div>

      {/* Progress Steps */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStep 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? "text-blue-600" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(scenario.category)}
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30"
            >
              {scenario.category}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-white/10 text-white border-white/30"
            >
              {scenario.difficulty}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{scenario.title}</h1>
          <p className="text-xl text-blue-100 mb-6 max-w-4xl">
            {scenario.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Context */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                The Situation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-base leading-relaxed text-gray-700">
                  {scenario.scenario.context}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* The Decision */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                The Ethical Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 mb-6">
                <p className="text-lg font-medium text-gray-900">
                  {scenario.scenario.question}
                </p>
              </div>

              {!showResults && (
                <div className="space-y-6">
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    <div className="space-y-4">
                      {scenario.scenario.options.map((option) => (
                        <div 
                          key={option.id} 
                          className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                            selectedOption === option.id 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="space-y-3">
                    <Label htmlFor="reasoning" className="text-base font-medium">
                      Explain your reasoning: *
                    </Label>
                    <Textarea
                      id="reasoning"
                      placeholder="Why did you choose this option? Consider the ethical implications, potential consequences, and alternative perspectives..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Think critically about the ethical principles involved and long-term impacts.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSubmitDecision}
                    disabled={!selectedOption || !reasoning.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  >
                    Submit My Decision
                  </Button>
                </div>
              )}

              {showResults && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Your Decision</h3>
                    </div>
                    <p className="text-base text-gray-700 mb-4">
                      {getSelectedOption()?.text || "Decision already submitted"}
                    </p>
                    {reasoning && (
                      <div className="mt-4 p-4 bg-white/60 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Your Reasoning:</p>
                        <p className="text-sm text-gray-600">{reasoning}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-xl bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Consequences</h3>
                    </div>
                    <p className="text-base text-gray-700">
                      {getSelectedOption()?.consequences || "Exploring the long-term impacts of this decision..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => {
                        setShowResults(false);
                        setSelectedOption("");
                        setReasoning("");
                        toast.info("Try making a different decision!");
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Try Different Choice
                    </Button>
                    <Button 
                      onClick={() => toast.success("Analysis saved to your ethics portfolio! 📚")}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Save Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ethical Frameworks */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Consider These Perspectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1">🔬 Scientific Progress</h4>
                  <p className="text-sm text-blue-700">Will this advance human knowledge and capability?</p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-medium text-green-900 mb-1">🌍 Environmental Impact</h4>
                  <p className="text-sm text-green-700">How will this affect our planet and ecosystem?</p>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-1">⚖️ Social Justice</h4>
                  <p className="text-sm text-purple-700">Does this promote equality and fairness?</p>
                </div>
                
                <div className="p-3 rounded-lg bg-pink-50 border border-pink-200">
                  <h4 className="font-medium text-pink-900 mb-1">👥 Human Rights</h4>
                  <p className="text-sm text-pink-700">Are fundamental human rights respected?</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Concepts */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Key Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2 mb-2">Informed Consent</Badge>
                <Badge variant="outline" className="mr-2 mb-2">Genetic Equity</Badge>
                <Badge variant="outline" className="mr-2 mb-2">Risk Assessment</Badge>
                <Badge variant="outline" className="mr-2 mb-2">Precautionary Principle</Badge>
                <Badge variant="outline" className="mr-2 mb-2">Intergenerational Justice</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Scenario */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              {ethicalScenarios.find(s => s.id === scenario.id + 1) ? (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {ethicalScenarios.find(s => s.id === scenario.id + 1).title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {ethicalScenarios.find(s => s.id === scenario.id + 1).description}
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/ethics/${scenario.id + 1}`}>
                      Next Scenario
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Great job! You've completed all available scenarios.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EthicsDetail;