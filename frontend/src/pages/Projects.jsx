import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { 
  FolderOpen, 
  Plus,
  FileText,
  Presentation,
  Image,
  Search,
  Filter,
  Calendar,
  Edit,
  Trash2,
  Download,
  Share,
  Eye,
  ChevronRight
} from "lucide-react";
import { projects } from "../data/mockData";
import { toast } from "sonner";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    type: "Presentation"
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "Presentation":
        return <Presentation className="h-4 w-4" />;
      case "Report":
        return <FileText className="h-4 w-4" />;
      case "Infographic":
        return <Image className="h-4 w-4" />;
      default:
        return <FolderOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateProject = () => {
    if (!newProject.title.trim()) {
      toast.error("Please enter a project title!");
      return;
    }

    const project = {
      id: projects.length + 1,
      ...newProject,
      status: "Draft",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    toast.success(`${newProject.type} project created! 📝 Ready to start working!`);
    setShowCreateDialog(false);
    setNewProject({ title: "", description: "", type: "Presentation" });
  };

  const handleProjectAction = (action, projectTitle) => {
    switch (action) {
      case "edit":
        toast.success(`Opening ${projectTitle} for editing! ✏️`);
        break;
      case "delete":
        toast.success(`${projectTitle} deleted! 🗑️`);
        break;
      case "download":
        toast.success(`Downloading ${projectTitle}! 📥`);
        break;
      case "share":
        toast.success(`Share link copied to clipboard! 🔗`);
        break;
      case "preview":
        toast.success(`Opening ${projectTitle} preview! 👁️`);
        break;
      default:
        break;
    }
  };

  const projectTypes = ["Presentation", "Report", "Infographic", "Research Paper", "Data Visualization"];
  const completedCount = projects.filter(p => p.status === "Completed").length;
  const inProgressCount = projects.filter(p => p.status === "In Progress").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Project Toolkit
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Create presentations, reports, and infographics based on your learning
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new presentation, report, or infographic project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder="Enter project title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Project Type</Label>
                  <Select 
                    value={newProject.type} 
                    onValueChange={(value) => setNewProject({...newProject, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(type)}
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Brief description of your project..."
                    className="resize-none"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateProject} className="flex-1">
                    Create Project
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-900">{projects.length}</p>
                  <p className="text-xs text-green-700">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Edit className="h-8 w-8 text-blue-600" />
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
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-900">{completedCount}</p>
                  <p className="text-xs text-purple-700">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Templates */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Quick Start Templates</h3>
              <p className="text-blue-100 mb-4">
                Use pre-designed templates to jumpstart your projects with professional layouts and content suggestions.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Gene Editing Report", "Ethics Presentation", "Simulation Results", "Research Poster"].map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => toast.success(`${template} template loaded! 📋`)}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-6xl">📋</div>
            </div>
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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(project.type)}
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Project Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.lastModified).toLocaleDateString()}
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.type}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handleProjectAction("edit", project.title)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {project.status === "Draft" ? "Edit" : "Continue"}
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => handleProjectAction("preview", project.title)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => handleProjectAction("download", project.title)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => handleProjectAction("share", project.title)}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try adjusting your search or filters" : "Create your first project to get started"}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projects;