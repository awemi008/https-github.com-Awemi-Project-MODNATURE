import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Home, 
  BookOpen, 
  FlaskConical, 
  Scale, 
  MessageCircle, 
  BarChart3, 
  FolderOpen,
  User,
  Menu,
  X,
  Dna,
  Trophy
} from "lucide-react";
import { userData } from "../data/mockData";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Lessons", href: "/lessons", icon: BookOpen },
    { name: "Simulations", href: "/simulations", icon: FlaskConical },
    { name: "Ethics", href: "/ethics", icon: Scale },
    { name: "AI Chat", href: "/ai-chat", icon: MessageCircle },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Dna className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GeneAdapt
                </h1>
                <p className="text-xs text-gray-500">Climate Genetics Lab</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500">{userData.grade}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Level {userData.level}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {userData.totalPoints} XP
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="text-xs text-gray-500 text-center">
              <p>🧬 Building the future through genetics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 shadow-sm lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Online</span>
            </Badge>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;