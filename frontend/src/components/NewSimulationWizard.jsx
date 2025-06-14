import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  FlaskConical, 
  Droplets, 
  Thermometer, 
  CloudRain,
  Snowflake,
  Waves,
  User,
  Users,
  Wheat,
  Dna,
  Scissors,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { toast } from "sonner";

const NewSimulationWizard = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Wizard data
  const [simulationData, setSimulationData] = useState({
    name: "",
    organism: "",
    climateCondition: null,
    populationTraits: [],
    geneEditingStrategies: []
  });

  // Options from backend
  const [options, setOptions] = useState({
    climateConditions: [],
    populationTraits: [],
    geneEditingStrategies: []
  });

  // Fetch options from backend when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      // Fetch all options in parallel
      const [climateRes, traitsRes, strategiesRes] = await Promise.all([
        fetch(`${backendUrl}/api/simulations/options/climate-conditions`),
        fetch(`${backendUrl}/api/simulations/options/population-traits`),
        fetch(`${backendUrl}/api/simulations/options/gene-editing-strategies`)
      ]);

      const climateConditions = await climateRes.json();
      const populationTraits = await traitsRes.json();
      const geneEditingStrategies = await strategiesRes.json();

      setOptions({
        climateConditions,
        populationTraits,
        geneEditingStrategies
      });
    } catch (error) {
      console.error("Failed to fetch options:", error);
      toast.error("Failed to load simulation options");
    }
  };

  const getClimateIcon = (type) => {
    switch (type) {
      case "drought": return <Droplets className="h-5 w-5" />;
      case "flood": return <CloudRain className="h-5 w-5" />;
      case "heatwave": return <Thermometer className="h-5 w-5" />;
      case "cold_snap": return <Snowflake className="h-5 w-5" />;
      case "salinity": return <Waves className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getOrganismIcon = (organism) => {
    if (organism.toLowerCase().includes("wheat") || organism.toLowerCase().includes("crop")) {
      return <Wheat className="h-5 w-5" />;
    } else if (organism.toLowerCase().includes("human")) {
      return <User className="h-5 w-5" />;
    } else {
      return <Users className="h-5 w-5" />;
    }
  };

  const getStrategyIcon = (type) => {
    switch (type) {
      case "CRISPR": return <Scissors className="h-5 w-5" />;
      case "synthetic_enzymes": return <Zap className="h-5 w-5" />;
      default: return <Dna className="h-5 w-5" />;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClimateSelect = (condition, severity) => {
    setSimulationData(prev => ({
      ...prev,
      climateCondition: {
        ...condition,
        severity,
        duration: "medium",
        description: `${severity} ${condition.name.toLowerCase()} conditions`
      }
    }));
  };

  const handleTraitToggle = (trait, checked) => {
    setSimulationData(prev => ({
      ...prev,
      populationTraits: checked 
        ? [...prev.populationTraits, { ...trait, severity: "moderate", affected_percentage: 50 }]
        : prev.populationTraits.filter(t => t.trait_name !== trait.trait_name)
    }));
  };

  const handleTraitSeverityChange = (traitName, severity) => {
    setSimulationData(prev => ({
      ...prev,
      populationTraits: prev.populationTraits.map(trait =>
        trait.trait_name === traitName ? { ...trait, severity } : trait
      )
    }));
  };

  const handleStrategyToggle = (strategy, checked) => {
    setSimulationData(prev => ({
      ...prev,
      geneEditingStrategies: checked 
        ? [...prev.geneEditingStrategies, { 
            strategy_type: strategy.strategy_type,
            target_genes: strategy.common_genes?.slice(0, 3) || [],
            approach: strategy.approaches[0]?.type || "enhancement",
            success_rate: (strategy.success_rate_range[0] + strategy.success_rate_range[1]) / 2,
            description: strategy.description
          }]
        : prev.geneEditingStrategies.filter(s => s.strategy_type !== strategy.strategy_type)
    }));
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/simulations/run-custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "user-123", // TODO: Get from user context
          simulation_name: simulationData.name,
          organism: simulationData.organism,
          climate_condition: simulationData.climateCondition,
          population_traits: simulationData.populationTraits,
          gene_editing_strategies: simulationData.geneEditingStrategies
        })
      });

      if (!response.ok) {
        throw new Error("Failed to run simulation");
      }

      const result = await response.json();
      
      toast.success("Simulation created successfully! 🧬");
      onClose();
      navigate(`/simulations/${result.simulation_id}`);
    } catch (error) {
      console.error("Failed to run simulation:", error);
      toast.error("Failed to create simulation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return simulationData.name && simulationData.organism;
      case 2:
        return simulationData.climateCondition;
      case 3:
        return simulationData.populationTraits.length > 0;
      case 4:
        return simulationData.geneEditingStrategies.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSimulationData({
      name: "",
      organism: "",
      climateCondition: null,
      populationTraits: [],
      geneEditingStrategies: []
    });
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-purple-600" />
            Create New Simulation
          </DialogTitle>
          <DialogDescription>
            Design a custom genetic modification experiment for climate adaptation
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 5 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? "bg-purple-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="simulation-name">Simulation Name</Label>
                    <Input
                      id="simulation-name"
                      placeholder="e.g., Desert Wheat Adaptation"
                      value={simulationData.name}
                      onChange={(e) => setSimulationData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organism">Target Organism</Label>
                    <Input
                      id="organism"
                      placeholder="e.g., Wheat, Cattle, Humans"
                      value={simulationData.organism}
                      onChange={(e) => setSimulationData(prev => ({ ...prev, organism: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Climate Condition */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Climate Condition</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose the environmental challenge your organism will face
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.climateConditions.map((condition) => (
                    <Card 
                      key={condition.type}
                      className={`cursor-pointer border-2 transition-all ${
                        simulationData.climateCondition?.type === condition.type
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {getClimateIcon(condition.type)}
                          <CardTitle className="text-base">{condition.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {condition.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Severity Level:</Label>
                          <RadioGroup 
                            value={simulationData.climateCondition?.severity || ""}
                            onValueChange={(severity) => handleClimateSelect(condition, severity)}
                          >
                            {condition.severity_options.map((option) => (
                              <div key={option.level} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.level} id={`${condition.type}-${option.level}`} />
                                <Label htmlFor={`${condition.type}-${option.level}`} className="text-xs">
                                  {option.level} - {option.description}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Population Traits */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Population Traits</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select the vulnerable traits your population has
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.populationTraits.map((trait) => (
                    <Card key={trait.trait_name} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <CardTitle className="text-sm">{trait.name}</CardTitle>
                          </div>
                          <Checkbox
                            checked={simulationData.populationTraits.some(t => t.trait_name === trait.trait_name)}
                            onCheckedChange={(checked) => handleTraitToggle(trait, checked)}
                          />
                        </div>
                        <CardDescription className="text-xs">
                          {trait.description}
                        </CardDescription>
                      </CardHeader>
                      {simulationData.populationTraits.some(t => t.trait_name === trait.trait_name) && (
                        <CardContent>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Severity:</Label>
                            <RadioGroup 
                              value={simulationData.populationTraits.find(t => t.trait_name === trait.trait_name)?.severity || "moderate"}
                              onValueChange={(severity) => handleTraitSeverityChange(trait.trait_name, severity)}
                            >
                              {trait.severity_options.map((option) => (
                                <div key={option.level} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.level} id={`${trait.trait_name}-${option.level}`} />
                                  <Label htmlFor={`${trait.trait_name}-${option.level}`} className="text-xs">
                                    {option.level} - {option.description}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Gene Editing Strategies */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Gene Editing Strategies</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose the genetic modification approaches to use
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.geneEditingStrategies.map((strategy) => (
                    <Card key={strategy.strategy_type} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStrategyIcon(strategy.strategy_type)}
                            <CardTitle className="text-sm">{strategy.name}</CardTitle>
                          </div>
                          <Checkbox
                            checked={simulationData.geneEditingStrategies.some(s => s.strategy_type === strategy.strategy_type)}
                            onCheckedChange={(checked) => handleStrategyToggle(strategy, checked)}
                          />
                        </div>
                        <CardDescription className="text-xs">
                          {strategy.description}
                        </CardDescription>
                      </CardHeader>
                      {simulationData.geneEditingStrategies.some(s => s.strategy_type === strategy.strategy_type) && (
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-medium">Success Rate:</Label>
                              <Badge variant="outline" className="text-xs">
                                {strategy.success_rate_range[0]}-{strategy.success_rate_range[1]}%
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              Target genes: {strategy.common_genes?.slice(0, 3).join(", ")}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review and Confirm */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Simulation</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FlaskConical className="h-4 w-4" />
                        {simulationData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getOrganismIcon(simulationData.organism)}
                        <span className="text-sm"><strong>Organism:</strong> {simulationData.organism}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getClimateIcon(simulationData.climateCondition?.type)}
                        <span className="text-sm">
                          <strong>Climate Challenge:</strong> {simulationData.climateCondition?.name} ({simulationData.climateCondition?.severity})
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Population Traits:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {simulationData.populationTraits.map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trait.trait_name} ({trait.severity})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Gene Editing Strategies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {simulationData.geneEditingStrategies.map((strategy, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strategy.strategy_type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            Step {currentStep} of 5
          </span>

          {currentStep < 5 ? (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : (
                <>
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSimulationWizard;