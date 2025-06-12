import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  FlaskConical, 
  Dna,
  TrendingUp,
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Activity,
  Droplets,
  Thermometer
} from "lucide-react";
import { simulations } from "../data/mockData";
import { toast } from "sonner";

const Simulations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [organismFilter, setOrganismFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sim.organism.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sim.targetTrait.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganism = organismFilter === "all" || sim.organism === organismFilter;
    const matchesStatus = statusFilter === "all" || sim.status === statusFilter;
    
    return matchesSearch && matchesOrganism && matchesStatus;
  });

  const activeCount = simulations.filter(s => s.status === "Active" || s.status === "In Progress").length;
  const completedCount = simulations.filter(s => s.status === "Completed").length;

  const handleStartSimulation = (simId) => {
    toast.success("Simulation started! 🧬 Running genetic modifications...");
  };

  const getTraitIcon = (trait) => {
    if (trait.includes("Drought")) return <Droplets className="h-4 w-4" />;
    if (trait.includes("Heat")) return <Thermometer className="h-4 w-4" />;
    if (trait.includes("Salt")) return <Activity className="h-4 w-4" />;
    return <Dna className="h-4 w-4" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Starting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gene Editing Simulations
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Design and test genetic modifications for climate adaptation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-900">{activeCount}</p>
                  <p className="text-xs text-blue-700">Active Simulations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FlaskConical className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-900">{simulations.length}</p>
                  <p className="text-xs text-purple-700">Total Experiments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-900">78%</p>
                  <p className="text-xs text-green-700">Average Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create New Simulation */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Create New Simulation</h3>
              <p className="text-blue-100">Design your own genetic modification experiment</p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => toast.success("Simulation designer coming soon! 🚀")}
            >
              <FlaskConical className="h-5 w-5 mr-2" />
              New Simulation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search simulations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            <Select value={organismFilter} onValueChange={setOrganismFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Organism" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organisms</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Cattle">Cattle</SelectItem>
                <SelectItem value="Corn">Corn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Starting">Starting</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Simulations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSimulations.map((simulation) => (
          <Card 
            key={simulation.id} 
            className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTraitIcon(simulation.targetTrait)}
                    <Badge className={getStatusColor(simulation.status)}>
                      {simulation.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {simulation.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {simulation.organism} • {simulation.targetTrait}
                  </CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Gene Information */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Target Genes:</p>
                <div className="flex flex-wrap gap-1">
                  {simulation.genes.map((gene, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      {gene}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Development Progress</span>
                  <span className="font-medium">Level {simulation.currentLevel}/{simulation.maxLevel}</span>
                </div>
                <Progress value={(simulation.currentLevel / simulation.maxLevel) * 100} className="h-2" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{simulation.survivalRate}%</p>
                  <p className="text-xs text-gray-500">Survival Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">+{simulation.yieldIncrease}%</p>
                  <p className="text-xs text-gray-500">Yield Increase</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  asChild
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Link to={`/simulations/${simulation.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => handleStartSimulation(simulation.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => toast.info("Simulation reset! 🔄")}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSimulations.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="text-center py-12">
            <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No simulations found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new simulation</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Simulations;