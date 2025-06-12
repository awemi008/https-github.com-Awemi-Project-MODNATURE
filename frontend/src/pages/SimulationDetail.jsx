import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Slider } from "../components/ui/slider";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Dna,
  Activity,
  Thermometer,
  Droplets,
  BarChart3,
  Settings,
  Zap
} from "lucide-react";
import { simulations, experimentData } from "../data/mockData";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const SimulationDetail = () => {
  const { id } = useParams();
  const simulation = simulations.find(s => s.id === parseInt(id));
  const [isRunning, setIsRunning] = useState(false);
  const [currentData, setCurrentData] = useState(experimentData);
  const [geneExpressionLevels, setGeneExpressionLevels] = useState([75, 65, 80]);
  const [environmentalStress, setEnvironmentalStress] = useState([60]);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentData(prev => {
          const newWeek = prev.length + 1;
          const lastData = prev[prev.length - 1];
          
          // Simulate realistic data progression
          const newData = {
            week: newWeek,
            droughtResistance: Math.min(95, lastData.droughtResistance + Math.random() * 8 - 2),
            yieldIncrease: Math.min(80, lastData.yieldIncrease + Math.random() * 6 - 1),
            survivalRate: Math.min(98, lastData.survivalRate + Math.random() * 4 - 1)
          };
          
          return [...prev, newData];
        });
      }, 2000 / simulationSpeed[0]);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  if (!simulation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Simulation not found</h2>
        <Button asChild className="mt-4">
          <Link to="/simulations">Back to Simulations</Link>
        </Button>
      </div>
    );
  }

  const handleStartSimulation = () => {
    setIsRunning(true);
    toast.success("Simulation started! 🧬 Monitoring genetic changes...");
  };

  const handlePauseSimulation = () => {
    setIsRunning(false);
    toast.info("Simulation paused 🛑");
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setCurrentData(experimentData);
    toast.success("Simulation reset! 🔄 Ready to start fresh.");
  };

  const handleGeneExpressionChange = (geneIndex, value) => {
    const newLevels = [...geneExpressionLevels];
    newLevels[geneIndex] = value[0];
    setGeneExpressionLevels(newLevels);
    toast.info(`${simulation.genes[geneIndex]} expression: ${value[0]}%`);
  };

  const getTraitIcon = (trait) => {
    if (trait.includes("Drought")) return <Droplets className="h-5 w-5 text-blue-600" />;
    if (trait.includes("Heat")) return <Thermometer className="h-5 w-5 text-red-600" />;
    if (trait.includes("Salt")) return <Activity className="h-5 w-5 text-green-600" />;
    return <Dna className="h-5 w-5 text-purple-600" />;
  };

  const latestData = currentData[currentData.length - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/simulations" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Simulations
          </Link>
        </Button>
      </div>

      {/* Simulation Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {getTraitIcon(simulation.targetTrait)}
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30"
            >
              {simulation.status}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-white/10 text-white border-white/30"
            >
              Level {simulation.currentLevel}/{simulation.maxLevel}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{simulation.name}</h1>
          <p className="text-xl text-blue-100 mb-6">
            Engineering {simulation.organism} for enhanced {simulation.targetTrait.toLowerCase()}
          </p>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={isRunning ? handlePauseSimulation : handleStartSimulation}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button 
              onClick={handleResetSimulation}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Droplets className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-blue-900">{Math.round(latestData.droughtResistance)}%</p>
                    <p className="text-xs text-blue-700">Drought Resistance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-green-900">+{Math.round(latestData.yieldIncrease)}%</p>
                    <p className="text-xs text-green-700">Yield Increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-purple-900">{Math.round(latestData.survivalRate)}%</p>
                    <p className="text-xs text-purple-700">Survival Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Performance Over Time
              </CardTitle>
              <CardDescription>
                Track the progression of genetic modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="droughtResistance" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                      name="Drought Resistance (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="yieldIncrease" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                      name="Yield Increase (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="survivalRate" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                      name="Survival Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gene Expression Visualization */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-purple-600" />
                Gene Expression Levels
              </CardTitle>
              <CardDescription>
                Monitor and adjust the expression of target genes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulation.genes.map((gene, index) => ({
                    gene,
                    expression: geneExpressionLevels[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gene" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="expression" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Simulation Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Simulation Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Simulation Speed
                </label>
                <Slider
                  value={simulationSpeed}
                  onValueChange={setSimulationSpeed}
                  max={5}
                  min={0.5}
                  step={0.5}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">{simulationSpeed[0]}x speed</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Environmental Stress Level
                </label>
                <Slider
                  value={environmentalStress}
                  onValueChange={setEnvironmentalStress}
                  max={100}
                  min={0}
                  step={5}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">{environmentalStress[0]}% stress conditions</p>
              </div>
            </CardContent>
          </Card>

          {/* Gene Controls */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Gene Expression Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulation.genes.map((gene, index) => (
                <div key={gene}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {gene}
                    </label>
                    <span className="text-sm text-gray-500">
                      {geneExpressionLevels[index]}%
                    </span>
                  </div>
                  <Slider
                    value={[geneExpressionLevels[index]]}
                    onValueChange={(value) => handleGeneExpressionChange(index, value)}
                    max={100}
                    min={0}
                    step={5}
                    className="mb-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Simulation Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Simulation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Organism:</span>
                  <span className="text-sm font-medium">{simulation.organism}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target Trait:</span>
                  <span className="text-sm font-medium">{simulation.targetTrait}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Development Level:</span>
                  <span className="text-sm font-medium">
                    {simulation.currentLevel}/{simulation.maxLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {simulation.status}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                <Progress 
                  value={(simulation.currentLevel / simulation.maxLevel) * 100} 
                  className="mb-2" 
                />
                <p className="text-xs text-gray-500">
                  {Math.round((simulation.currentLevel / simulation.maxLevel) * 100)}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Export Results */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <Button 
                className="w-full"
                onClick={() => toast.success("Results exported! 📊 Download starting...")}
              >
                Export Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulationDetail;