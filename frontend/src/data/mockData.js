// Mock data for gene editing educational app

export const lessons = [
  {
    id: 1,
    title: "Introduction to Gene Editing",
    description: "Understanding CRISPR, gene therapy, and modern biotechnology",
    duration: "45 min",
    difficulty: "Intermediate",
    topics: ["CRISPR-Cas9", "Gene therapy", "Biotechnology basics"],
    completed: true,
    progress: 100
  },
  {
    id: 2,
    title: "Climate Change & Genetic Adaptation",
    description: "How organisms adapt genetically to environmental changes",
    duration: "60 min", 
    difficulty: "Advanced",
    topics: ["Climate adaptation", "Natural selection", "Genetic variation"],
    completed: true,
    progress: 100
  },
  {
    id: 3,
    title: "Drought-Resistant Crops",
    description: "Engineering plants to survive water scarcity",
    duration: "50 min",
    difficulty: "Advanced", 
    topics: ["Crop modification", "Water stress response", "Agricultural biotechnology"],
    completed: false,
    progress: 65
  },
  {
    id: 4,
    title: "Heat-Tolerant Livestock",
    description: "Genetic modifications for temperature adaptation",
    duration: "55 min",
    difficulty: "Advanced",
    topics: ["Animal genetics", "Heat shock proteins", "Metabolic adaptation"],
    completed: false,
    progress: 0
  }
];

export const simulations = [
  {
    id: 1,
    name: "Drought-Resistant Wheat",
    organism: "Wheat",
    targetTrait: "Drought Resistance",
    genes: ["ABA1", "DREB2", "LEA3"],
    currentLevel: 3,
    maxLevel: 5,
    survivalRate: 78,
    yieldIncrease: 45,
    status: "In Progress"
  },
  {
    id: 2,
    name: "Heat-Tolerant Cattle", 
    organism: "Cattle",
    targetTrait: "Heat Tolerance",
    genes: ["HSP70", "SLICK", "PRLR"],
    currentLevel: 2,
    maxLevel: 4,
    survivalRate: 65,
    yieldIncrease: 28,
    status: "Active"
  },
  {
    id: 3,
    name: "Salt-Resistant Rice",
    organism: "Rice", 
    targetTrait: "Salt Tolerance",
    genes: ["SOS1", "HKT1", "NHX1"],
    currentLevel: 1,
    maxLevel: 4,
    survivalRate: 45,
    yieldIncrease: 12,
    status: "Starting"
  }
];

export const ethicalScenarios = [
  {
    id: 1,
    title: "Human Heat Adaptation",
    description: "Should we edit human genes to increase heat tolerance as global temperatures rise?",
    category: "Human Enhancement",
    difficulty: "Complex",
    completed: false,
    scenario: {
      context: "By 2050, average global temperatures are projected to increase by 2-4°C. Some regions will become nearly uninhabitable without air conditioning. Scientists have identified genes that could increase human heat tolerance by 15-20%.",
      question: "A biotech company offers to edit these genes in embryos. What should society decide?",
      options: [
        {
          id: "a",
          text: "Approve the editing - it's necessary for human survival",
          consequences: "Increased survival rates but raises questions about genetic equality and access"
        },
        {
          id: "b", 
          text: "Ban the editing - focus on environmental solutions instead",
          consequences: "Maintains genetic integrity but may leave populations vulnerable"
        },
        {
          id: "c",
          text: "Allow it only for high-risk populations with strict regulations",
          consequences: "Balanced approach but creates potential for discrimination"
        }
      ]
    }
  },
  {
    id: 2,
    title: "Corporate Crop Control",
    description: "Who should own and control genetically modified climate-resistant crops?",
    category: "Economic Ethics",
    difficulty: "Moderate",
    completed: true,
    scenario: {
      context: "A major corporation has developed drought-resistant crops that could save millions from famine. However, they want to patent the genes and charge licensing fees.",
      question: "How should society handle ownership of life-saving genetic modifications?",
      options: [
        {
          id: "a",
          text: "Allow full corporate ownership and patents",
          consequences: "Incentivizes innovation but limits access for poor farmers"
        },
        {
          id: "b",
          text: "Force open-source sharing of all climate-adaptation genes", 
          consequences: "Ensures equal access but may reduce private investment"
        },
        {
          id: "c",
          text: "Create a government-funded alternative with public ownership",
          consequences: "Public access but requires massive taxpayer investment"
        }
      ]
    }
  }
];

export const aiConversations = [
  {
    id: 1,
    message: "Hi! I'm your AI biology tutor. I can help explain gene editing concepts, discuss ethical dilemmas, or quiz you on genetics. What would you like to explore today?",
    sender: "ai",
    timestamp: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    message: "Can you explain how CRISPR actually cuts DNA?",
    sender: "user", 
    timestamp: "2024-01-15T10:01:00Z"
  },
  {
    id: 3,
    message: "Absolutely! CRISPR works like molecular scissors. The Cas9 protein is guided by a piece of RNA to find the exact DNA sequence you want to edit. Think of it like using GPS to find a specific address, then cutting precisely at that location. The cell's natural repair mechanisms then fix the cut, often incorporating new genetic material you provide. Would you like me to explain the guide RNA process in more detail?",
    sender: "ai",
    timestamp: "2024-01-15T10:01:30Z"
  }
];

export const achievements = [
  {
    id: 1,
    name: "Gene Detective",
    description: "Complete your first genetic analysis",
    icon: "🔬",
    unlocked: true,
    unlockedDate: "2024-01-10"
  },
  {
    id: 2,
    name: "Ethical Thinker", 
    description: "Complete 3 ethical scenarios",
    icon: "⚖️",
    unlocked: true,
    unlockedDate: "2024-01-12"
  },
  {
    id: 3,
    name: "Climate Warrior",
    description: "Design a climate-adapted organism",
    icon: "🌱",
    unlocked: false,
    progress: 75
  },
  {
    id: 4,
    name: "Simulation Master",
    description: "Run 10 successful gene editing simulations", 
    icon: "⚗️",
    unlocked: false,
    progress: 30
  }
];

export const userData = {
  name: "Alex Thompson",
  grade: "11th Grade",
  school: "Central High School",
  totalPoints: 2450,
  level: 7,
  streak: 12,
  completedLessons: 8,
  totalLessons: 15,
  simulationsRun: 23,
  ethicalScenariosCompleted: 5
};

export const experimentData = [
  {
    week: 1,
    droughtResistance: 45,
    yieldIncrease: 12,
    survivalRate: 78
  },
  {
    week: 2, 
    droughtResistance: 52,
    yieldIncrease: 18,
    survivalRate: 82
  },
  {
    week: 3,
    droughtResistance: 61,
    yieldIncrease: 25,
    survivalRate: 86
  },
  {
    week: 4,
    droughtResistance: 68,
    yieldIncrease: 32,
    survivalRate: 89
  },
  {
    week: 5,
    droughtResistance: 74,
    yieldIncrease: 38,
    survivalRate: 91
  },
  {
    week: 6,
    droughtResistance: 78,
    yieldIncrease: 45,
    survivalRate: 94
  }
];

export const projects = [
  {
    id: 1,
    title: "Climate Adaptation Presentation",
    description: "Analysis of drought-resistant crop modifications",
    type: "Presentation",
    status: "Completed",
    createdDate: "2024-01-08",
    lastModified: "2024-01-14"
  },
  {
    id: 2,
    title: "Ethical Dilemma Report",
    description: "Human genetic enhancement for climate adaptation",
    type: "Report", 
    status: "In Progress",
    createdDate: "2024-01-12",
    lastModified: "2024-01-15"
  },
  {
    id: 3,
    title: "Gene Editing Infographic",
    description: "Visual guide to CRISPR applications in agriculture",
    type: "Infographic",
    status: "Draft",
    createdDate: "2024-01-15",
    lastModified: "2024-01-15"
  }
];