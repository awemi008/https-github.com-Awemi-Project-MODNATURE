from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
openai_api_key = os.environ['OPENAI_API_KEY']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="GeneAdapt API", description="Interactive Educational App for Gene Editing and Climate Adaptation")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    grade: str
    school: str
    level: int = 1
    total_points: int = 0
    streak: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: str
    grade: str
    school: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    grade: Optional[str] = None
    school: Optional[str] = None

class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    duration: str
    difficulty: str
    topics: List[str]
    content: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LessonCreate(BaseModel):
    title: str
    description: str
    duration: str
    difficulty: str
    topics: List[str]
    content: Dict[str, Any]

class UserLessonProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    lesson_id: str
    progress: int = 0
    completed: bool = False
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ClimateCondition(BaseModel):
    type: str  # "drought", "flood", "heatwave", "cold_snap", "salinity"
    severity: str  # "mild", "moderate", "severe", "extreme"
    duration: str  # "short", "medium", "long", "permanent"
    description: str

class PopulationTrait(BaseModel):
    trait_name: str  # "weak_lungs", "low_melanin", "low_immunity", "heat_sensitivity", "cold_sensitivity"
    severity: str  # "mild", "moderate", "severe"
    affected_percentage: float  # 0-100
    description: str

class GeneEditingStrategy(BaseModel):
    strategy_type: str  # "CRISPR", "GMO_crops", "synthetic_enzymes", "gene_therapy", "selective_breeding"
    target_genes: List[str]
    approach: str  # "enhancement", "suppression", "modification", "insertion"
    success_rate: float  # 0-100
    description: str

class Simulation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    organism: str
    target_trait: str
    genes: List[str]
    max_level: int
    description: str
    # New fields for custom simulations
    climate_condition: Optional[ClimateCondition] = None
    population_traits: List[PopulationTrait] = []
    gene_editing_strategies: List[GeneEditingStrategy] = []
    is_custom: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SimulationCreate(BaseModel):
    name: str
    organism: str
    target_trait: str
    genes: List[str]
    max_level: int
    description: str
    # New optional fields for custom simulations
    climate_condition: Optional[ClimateCondition] = None
    population_traits: List[PopulationTrait] = []
    gene_editing_strategies: List[GeneEditingStrategy] = []
    is_custom: bool = False

class UserSimulation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    simulation_id: str
    current_level: int = 1
    survival_rate: float = 0.0
    yield_increase: float = 0.0
    gene_expression_levels: List[float] = []
    status: str = "Starting"
    # Enhanced fields for custom simulations
    adaptation_success: bool = False
    resistance_level: float = 0.0
    population_health: float = 0.0
    environmental_impact: float = 0.0
    simulation_results: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EthicalScenario(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    difficulty: str
    scenario: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EthicalScenarioCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    scenario: Dict[str, Any]

class UserEthicalDecision(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    scenario_id: str
    selected_option: str
    reasoning: str
    completed: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    message: str
    sender: str  # 'user' or 'ai'
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSessionCreate(BaseModel):
    user_id: str
    message: str

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Achievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    icon: str
    criteria: Dict[str, Any]
    points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserAchievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    achievement_id: str
    unlocked: bool = False
    progress: float = 0.0
    unlocked_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    type: str  # "Presentation", "Report", "Infographic"
    content: Dict[str, Any] = {}
    status: str = "Draft"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    type: str
    content: Optional[Dict[str, Any]] = {}

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
        return doc
    return None

# User Management Endpoints
@api_router.get("/users", response_model=List[User])
async def get_users(skip: int = 0, limit: int = 100):
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(user) for user in users]

@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    user = User(**user_data.dict())
    await db.users.insert_one(user.dict())
    return user

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    # Try to find by UUID first
    user = await db.users.find_one({"id": user_id})
    if not user:
        # If not found, try by MongoDB _id
        try:
            user = await db.users.find_one({"_id": user_id})
        except:
            pass
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return serialize_doc(user)

@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user_data: UserUpdate):
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    update_data['updated_at'] = datetime.utcnow()
    
    # Try to update by UUID first
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        # If not found, try by MongoDB _id
        try:
            result = await db.users.update_one(
                {"_id": user_id},
                {"$set": update_data}
            )
        except:
            pass
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Try to find by UUID first
    user = await db.users.find_one({"id": user_id})
    if not user:
        # If not found, try by MongoDB _id
        try:
            user = await db.users.find_one({"_id": user_id})
        except:
            pass
    
    return serialize_doc(user)

# Lesson Management
@api_router.get("/lessons", response_model=List[Lesson])
async def get_lessons(skip: int = 0, limit: int = 100):
    lessons = await db.lessons.find().skip(skip).limit(limit).to_list(limit)
    return [serialize_doc(lesson) for lesson in lessons]

@api_router.get("/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    lesson = await db.lessons.find_one({"id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return serialize_doc(lesson)

@api_router.post("/lessons", response_model=Lesson)
async def create_lesson(lesson_data: LessonCreate):
    lesson = Lesson(**lesson_data.dict())
    await db.lessons.insert_one(lesson.dict())
    return lesson

# User Lesson Progress
@api_router.get("/users/{user_id}/lessons/progress")
async def get_user_lesson_progress(user_id: str):
    progress = await db.user_lesson_progress.find({"user_id": user_id}).to_list(1000)
    return [serialize_doc(p) for p in progress]

@api_router.post("/users/{user_id}/lessons/{lesson_id}/progress")
async def update_lesson_progress(user_id: str, lesson_id: str, progress: int):
    existing = await db.user_lesson_progress.find_one({"user_id": user_id, "lesson_id": lesson_id})
    
    if existing:
        update_data = {
            "progress": progress,
            "completed": progress >= 100,
            "updated_at": datetime.utcnow()
        }
        if progress >= 100:
            update_data["completed_at"] = datetime.utcnow()
            
        await db.user_lesson_progress.update_one(
            {"user_id": user_id, "lesson_id": lesson_id},
            {"$set": update_data}
        )
    else:
        progress_data = UserLessonProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            progress=progress,
            completed=progress >= 100,
            completed_at=datetime.utcnow() if progress >= 100 else None
        )
        await db.user_lesson_progress.insert_one(progress_data.dict())
    
    return {"message": "Progress updated successfully"}

# Simulations
@api_router.get("/simulations", response_model=List[Simulation])
async def get_simulations():
    simulations = await db.simulations.find().to_list(1000)
    return [serialize_doc(sim) for sim in simulations]

@api_router.get("/simulations/{simulation_id}", response_model=Simulation)
async def get_simulation(simulation_id: str):
    simulation = await db.simulations.find_one({"id": simulation_id})
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return serialize_doc(simulation)

@api_router.post("/simulations", response_model=Simulation)
async def create_simulation(simulation_data: SimulationCreate):
    simulation = Simulation(**simulation_data.dict())
    await db.simulations.insert_one(simulation.dict())
    return simulation

# New endpoints for custom simulation creation
@api_router.get("/simulations/options/climate-conditions")
async def get_climate_conditions():
    """Get available climate conditions for simulation creation"""
    return [
        {
            "type": "drought",
            "name": "Drought",
            "description": "Extended periods of below-normal precipitation causing water scarcity",
            "severity_options": [
                {"level": "mild", "description": "10-20% below normal rainfall"},
                {"level": "moderate", "description": "20-40% below normal rainfall"},
                {"level": "severe", "description": "40-60% below normal rainfall"},
                {"level": "extreme", "description": "60%+ below normal rainfall"}
            ]
        },
        {
            "type": "flood",
            "name": "Flood",
            "description": "Excessive water causing waterlogged conditions and soil erosion",
            "severity_options": [
                {"level": "mild", "description": "Minor flooding with good drainage"},
                {"level": "moderate", "description": "Significant flooding affecting root systems"},
                {"level": "severe", "description": "Major flooding with soil displacement"},
                {"level": "extreme", "description": "Catastrophic flooding destroying ecosystems"}
            ]
        },
        {
            "type": "heatwave",
            "name": "Heatwave",
            "description": "Prolonged periods of excessively hot weather",
            "severity_options": [
                {"level": "mild", "description": "2-5°C above normal temperatures"},
                {"level": "moderate", "description": "5-8°C above normal temperatures"},
                {"level": "severe", "description": "8-12°C above normal temperatures"},
                {"level": "extreme", "description": "12°C+ above normal temperatures"}
            ]
        },
        {
            "type": "cold_snap",
            "name": "Cold Snap",
            "description": "Sudden drop in temperature causing frost damage",
            "severity_options": [
                {"level": "mild", "description": "Light frost conditions"},
                {"level": "moderate", "description": "Hard frost with ice formation"},
                {"level": "severe", "description": "Deep freeze affecting plant tissues"},
                {"level": "extreme", "description": "Arctic conditions causing cell damage"}
            ]
        },
        {
            "type": "salinity",
            "name": "Soil Salinity",
            "description": "High salt concentration in soil affecting plant growth",
            "severity_options": [
                {"level": "mild", "description": "Slightly elevated salt levels"},
                {"level": "moderate", "description": "Moderate salt stress affecting growth"},
                {"level": "severe", "description": "High salinity causing plant stress"},
                {"level": "extreme", "description": "Extreme salinity preventing growth"}
            ]
        }
    ]

@api_router.get("/simulations/options/population-traits")
async def get_population_traits():
    """Get available population traits for simulation creation"""
    return [
        {
            "trait_name": "weak_lungs",
            "name": "Respiratory Weakness",
            "description": "Reduced lung capacity and respiratory efficiency",
            "organism_types": ["humans", "mammals"],
            "severity_options": [
                {"level": "mild", "description": "Slightly reduced lung capacity (10-20%)"},
                {"level": "moderate", "description": "Moderately reduced lung capacity (20-40%)"},
                {"level": "severe", "description": "Severely reduced lung capacity (40%+)"}
            ]
        },
        {
            "trait_name": "low_melanin",
            "name": "Reduced Melanin Production",
            "description": "Decreased melanin production affecting UV protection",
            "organism_types": ["humans", "mammals"],
            "severity_options": [
                {"level": "mild", "description": "Slightly reduced melanin (fair skin)"},
                {"level": "moderate", "description": "Moderately reduced melanin (very fair skin)"},
                {"level": "severe", "description": "Severely reduced melanin (albinism-like)"}
            ]
        },
        {
            "trait_name": "low_immunity",
            "name": "Compromised Immune System",
            "description": "Weakened immune response to environmental stressors",
            "organism_types": ["humans", "mammals", "plants"],
            "severity_options": [
                {"level": "mild", "description": "Slightly weakened immune response"},
                {"level": "moderate", "description": "Moderately compromised immunity"},
                {"level": "severe", "description": "Severely compromised immune system"}
            ]
        },
        {
            "trait_name": "heat_sensitivity",
            "name": "Heat Sensitivity",
            "description": "Reduced ability to regulate body temperature in heat",
            "organism_types": ["all"],
            "severity_options": [
                {"level": "mild", "description": "Slightly reduced heat tolerance"},
                {"level": "moderate", "description": "Moderately reduced heat tolerance"},
                {"level": "severe", "description": "Severely reduced heat tolerance"}
            ]
        },
        {
            "trait_name": "cold_sensitivity",
            "name": "Cold Sensitivity",
            "description": "Reduced ability to maintain function in cold conditions",
            "organism_types": ["all"],
            "severity_options": [
                {"level": "mild", "description": "Slightly reduced cold tolerance"},
                {"level": "moderate", "description": "Moderately reduced cold tolerance"},
                {"level": "severe", "description": "Severely reduced cold tolerance"}
            ]
        },
        {
            "trait_name": "salt_sensitivity",
            "name": "Salt Sensitivity",
            "description": "Poor tolerance to high salinity conditions",
            "organism_types": ["plants", "crops"],
            "severity_options": [
                {"level": "mild", "description": "Slightly reduced salt tolerance"},
                {"level": "moderate", "description": "Moderately reduced salt tolerance"},
                {"level": "severe", "description": "Severely reduced salt tolerance"}
            ]
        }
    ]

@api_router.get("/simulations/options/gene-editing-strategies")
async def get_gene_editing_strategies():
    """Get available gene editing strategies for simulation creation"""
    return [
        {
            "strategy_type": "CRISPR",
            "name": "CRISPR-Cas9 Gene Editing",
            "description": "Precise DNA editing using CRISPR-Cas9 technology",
            "approaches": [
                {"type": "enhancement", "description": "Enhance existing gene expression"},
                {"type": "suppression", "description": "Reduce or silence gene expression"},
                {"type": "modification", "description": "Modify existing gene sequences"},
                {"type": "insertion", "description": "Insert new genetic material"}
            ],
            "target_applications": ["humans", "animals", "plants"],
            "success_rate_range": [70, 95],
            "common_genes": ["HSP70", "DREB2", "PRLR", "ABA1", "LEA3", "SOD1"]
        },
        {
            "strategy_type": "GMO_crops",
            "name": "GMO Crop Development",
            "description": "Creating genetically modified crops with enhanced traits",
            "approaches": [
                {"type": "enhancement", "description": "Enhance crop yield and nutrition"},
                {"type": "insertion", "description": "Insert genes from other species"},
                {"type": "modification", "description": "Modify existing crop genetics"}
            ],
            "target_applications": ["crops", "plants"],
            "success_rate_range": [60, 85],
            "common_genes": ["Bt", "CP4", "BADH", "SPS", "P5CS", "DREB1A"]
        },
        {
            "strategy_type": "synthetic_enzymes",
            "name": "Synthetic Enzyme Engineering",
            "description": "Design artificial enzymes for specific functions",
            "approaches": [
                {"type": "enhancement", "description": "Enhance metabolic pathways"},
                {"type": "insertion", "description": "Add new enzymatic functions"},
                {"type": "modification", "description": "Modify existing enzyme activity"}
            ],
            "target_applications": ["all"],
            "success_rate_range": [50, 80],
            "common_genes": ["CAT", "APX", "GST", "POX", "PAL", "CHS"]
        },
        {
            "strategy_type": "gene_therapy",
            "name": "Gene Therapy",
            "description": "Therapeutic delivery of genetic material to treat conditions",
            "approaches": [
                {"type": "enhancement", "description": "Enhance cellular functions"},
                {"type": "insertion", "description": "Insert therapeutic genes"},
                {"type": "modification", "description": "Correct genetic defects"}
            ],
            "target_applications": ["humans", "animals"],
            "success_rate_range": [40, 75],
            "common_genes": ["CFTR", "ADA", "p53", "VEGF", "IGF1", "BDNF"]
        },
        {
            "strategy_type": "selective_breeding",
            "name": "Advanced Selective Breeding",
            "description": "Accelerated breeding programs using genetic markers",
            "approaches": [
                {"type": "enhancement", "description": "Select for enhanced traits"},
                {"type": "modification", "description": "Combine beneficial alleles"}
            ],
            "target_applications": ["animals", "plants"],
            "success_rate_range": [80, 95],
            "common_genes": ["QTL markers", "SNP markers", "Breeding indices"]
        }
    ]

@api_router.post("/simulations/run-custom")
async def run_custom_simulation(
    user_id: str,
    simulation_name: str,
    organism: str,
    climate_condition: dict,
    population_traits: List[dict],
    gene_editing_strategies: List[dict]
):
    """Run a custom simulation with specified parameters"""
    
    # Create custom simulation
    custom_sim = Simulation(
        name=simulation_name,
        organism=organism,
        target_trait=f"Adaptation to {climate_condition.get('type', 'environmental stress')}",
        genes=[gene for strategy in gene_editing_strategies for gene in strategy.get('target_genes', [])],
        max_level=5,
        description=f"Custom simulation for {organism} adaptation to {climate_condition.get('type')} conditions",
        climate_condition=ClimateCondition(**climate_condition),
        population_traits=[PopulationTrait(**trait) for trait in population_traits],
        gene_editing_strategies=[GeneEditingStrategy(**strategy) for strategy in gene_editing_strategies],
        is_custom=True
    )
    
    # Save simulation
    await db.simulations.insert_one(custom_sim.dict())
    
    # Calculate simulation results based on parameters
    base_success_rate = 50.0
    
    # Adjust success rate based on climate severity
    climate_severity_impact = {
        "mild": 0.9, "moderate": 0.7, "severe": 0.5, "extreme": 0.3
    }
    climate_multiplier = climate_severity_impact.get(climate_condition.get('severity'), 0.7)
    
    # Adjust based on population trait severity
    trait_impact = 1.0
    for trait in population_traits:
        trait_severity_impact = {
            "mild": 0.95, "moderate": 0.85, "severe": 0.7
        }
        trait_impact *= trait_severity_impact.get(trait.get('severity'), 0.85)
    
    # Adjust based on gene editing strategy success rates
    strategy_success = sum([
        strategy.get('success_rate', 70) for strategy in gene_editing_strategies
    ]) / len(gene_editing_strategies) if gene_editing_strategies else 70
    
    # Calculate final metrics
    adaptation_success = (base_success_rate * climate_multiplier * trait_impact * (strategy_success / 100)) > 40
    final_survival_rate = min(95, max(10, base_success_rate * climate_multiplier * trait_impact))
    resistance_level = min(100, max(0, strategy_success * climate_multiplier))
    population_health = min(100, max(20, 80 * trait_impact))
    
    # Create user simulation record
    user_sim = UserSimulation(
        user_id=user_id,
        simulation_id=custom_sim.id,
        survival_rate=final_survival_rate,
        adaptation_success=adaptation_success,
        resistance_level=resistance_level,
        population_health=population_health,
        environmental_impact=min(100, max(0, 100 - (final_survival_rate * 0.8))),
        status="Completed",
        simulation_results={
            "climate_adaptation": resistance_level,
            "population_survival": final_survival_rate,
            "trait_improvement": population_health,
            "overall_success": adaptation_success,
            "recommendations": generate_simulation_recommendations(
                climate_condition, population_traits, gene_editing_strategies, adaptation_success
            )
        }
    )
    
    await db.user_simulations.insert_one(user_sim.dict())
    
    return {
        "simulation_id": custom_sim.id,
        "user_simulation_id": user_sim.id,
        "results": {
            "adaptation_successful": adaptation_success,
            "survival_rate": round(final_survival_rate, 1),
            "resistance_level": round(resistance_level, 1),
            "population_health": round(population_health, 1),
            "environmental_impact": round(user_sim.environmental_impact, 1),
            "detailed_results": user_sim.simulation_results
        }
    }

def generate_simulation_recommendations(climate_condition, population_traits, strategies, success):
    """Generate recommendations based on simulation results"""
    recommendations = []
    
    if success:
        recommendations.append("✅ Genetic modifications successfully improved adaptation")
        recommendations.append("🧬 Current gene editing strategies are effective")
        recommendations.append("📈 Population shows strong resilience to environmental stress")
    else:
        recommendations.append("⚠️ Additional genetic modifications may be needed")
        recommendations.append("🔬 Consider combining multiple gene editing approaches")
        recommendations.append("📊 Monitor population closely for stress indicators")
    
    # Climate-specific recommendations
    climate_type = climate_condition.get('type')
    if climate_type == 'drought':
        recommendations.append("💧 Focus on water retention and root development genes")
    elif climate_type == 'heatwave':
        recommendations.append("🌡️ Enhance heat shock protein expression")
    elif climate_type == 'flood':
        recommendations.append("🌊 Improve anaerobic respiration pathways")
    
    return recommendations

@api_router.get("/users/{user_id}/simulations")
async def get_user_simulations(user_id: str):
    user_sims = await db.user_simulations.find({"user_id": user_id}).to_list(1000)
    return [serialize_doc(sim) for sim in user_sims]

@api_router.post("/users/{user_id}/simulations/{simulation_id}/start")
async def start_user_simulation(user_id: str, simulation_id: str):
    user_sim = UserSimulation(
        user_id=user_id,
        simulation_id=simulation_id,
        status="Active"
    )
    await db.user_simulations.insert_one(user_sim.dict())
    return {"message": "Simulation started successfully"}

# Ethical Scenarios
@api_router.get("/ethics/scenarios", response_model=List[EthicalScenario])
async def get_ethical_scenarios():
    scenarios = await db.ethical_scenarios.find().to_list(1000)
    return [serialize_doc(scenario) for scenario in scenarios]

@api_router.get("/ethics/scenarios/{scenario_id}", response_model=EthicalScenario)
async def get_ethical_scenario(scenario_id: str):
    scenario = await db.ethical_scenarios.find_one({"id": scenario_id})
    if not scenario:
        raise HTTPException(status_code=404, detail="Ethical scenario not found")
    return serialize_doc(scenario)

@api_router.post("/ethics/scenarios", response_model=EthicalScenario)
async def create_ethical_scenario(scenario_data: EthicalScenarioCreate):
    scenario = EthicalScenario(**scenario_data.dict())
    await db.ethical_scenarios.insert_one(scenario.dict())
    return scenario

@api_router.post("/users/{user_id}/ethics/{scenario_id}/decision")
async def submit_ethical_decision(user_id: str, scenario_id: str, selected_option: str, reasoning: str):
    decision = UserEthicalDecision(
        user_id=user_id,
        scenario_id=scenario_id,
        selected_option=selected_option,
        reasoning=reasoning
    )
    await db.user_ethical_decisions.insert_one(decision.dict())
    return {"message": "Decision submitted successfully"}

@api_router.get("/users/{user_id}/ethics/decisions")
async def get_user_ethical_decisions(user_id: str):
    decisions = await db.user_ethical_decisions.find({"user_id": user_id}).to_list(1000)
    return [serialize_doc(decision) for decision in decisions]

# AI Chat System
@api_router.post("/chat/sessions")
async def create_chat_session(chat_data: ChatSessionCreate):
    session_id = str(uuid.uuid4())
    
    # Create LLM chat instance
    chat = LlmChat(
        api_key=openai_api_key,
        session_id=session_id,
        system_message="You are an expert biology tutor specializing in gene editing, CRISPR technology, climate adaptation, and ethical considerations in biotechnology. You help high school students understand complex genetic concepts through clear explanations, examples, and interactive discussions. You can provide quizzes, explain ethical dilemmas, and guide students through genetic engineering applications for climate change adaptation."
    ).with_model("openai", "gpt-4o").with_max_tokens(4096)
    
    # Store user message
    user_message = ChatMessage(
        user_id=chat_data.user_id,
        session_id=session_id,
        message=chat_data.message,
        sender="user"
    )
    await db.chat_messages.insert_one(user_message.dict())
    
    try:
        # Get AI response
        ai_response = await chat.send_message(UserMessage(text=chat_data.message))
        
        # Store AI message
        ai_message = ChatMessage(
            user_id=chat_data.user_id,
            session_id=session_id,
            message=ai_response,
            sender="ai"
        )
        await db.chat_messages.insert_one(ai_message.dict())
        
        return {
            "session_id": session_id,
            "user_message": user_message.dict(),
            "ai_response": ai_message.dict()
        }
        
    except Exception as e:
        # If AI fails, provide a fallback response
        fallback_response = "I'm sorry, I'm having trouble processing your question right now. Could you please try rephrasing your question about gene editing or climate adaptation?"
        
        ai_message = ChatMessage(
            user_id=chat_data.user_id,
            session_id=session_id,
            message=fallback_response,
            sender="ai"
        )
        await db.chat_messages.insert_one(ai_message.dict())
        
        return {
            "session_id": session_id,
            "user_message": user_message.dict(),
            "ai_response": ai_message.dict()
        }

@api_router.post("/chat/sessions/{session_id}/message")
async def send_chat_message(session_id: str, user_id: str, message: str):
    # Store user message
    user_message = ChatMessage(
        user_id=user_id,
        session_id=session_id,
        message=message,
        sender="user"
    )
    await db.chat_messages.insert_one(user_message.dict())
    
    try:
        # Create LLM chat instance with existing session
        chat = LlmChat(
            api_key=openai_api_key,
            session_id=session_id,
            system_message="You are an expert biology tutor specializing in gene editing, CRISPR technology, climate adaptation, and ethical considerations in biotechnology. You help high school students understand complex genetic concepts through clear explanations, examples, and interactive discussions. You can provide quizzes, explain ethical dilemmas, and guide students through genetic engineering applications for climate change adaptation."
        ).with_model("openai", "gpt-4o").with_max_tokens(4096)
        
        # Get AI response
        ai_response = await chat.send_message(UserMessage(text=message))
        
        # Store AI message
        ai_message = ChatMessage(
            user_id=user_id,
            session_id=session_id,
            message=ai_response,
            sender="ai"
        )
        await db.chat_messages.insert_one(ai_message.dict())
        
        return {
            "user_message": user_message.dict(),
            "ai_response": ai_message.dict()
        }
        
    except Exception as e:
        # Fallback response
        fallback_response = "I'm experiencing some technical difficulties. Let me try to help you with a general response about gene editing and climate adaptation."
        
        ai_message = ChatMessage(
            user_id=user_id,
            session_id=session_id,
            message=fallback_response,
            sender="ai"
        )
        await db.chat_messages.insert_one(ai_message.dict())
        
        return {
            "user_message": user_message.dict(),
            "ai_response": ai_message.dict()
        }

@api_router.get("/chat/sessions/{session_id}/messages")
async def get_chat_messages(session_id: str):
    messages = await db.chat_messages.find({"session_id": session_id}).sort("timestamp", 1).to_list(1000)
    return [serialize_doc(message) for message in messages]

# Projects
@api_router.get("/users/{user_id}/projects")
async def get_user_projects(user_id: str):
    projects = await db.projects.find({"user_id": user_id}).to_list(1000)
    return [serialize_doc(project) for project in projects]

@api_router.post("/users/{user_id}/projects", response_model=Project)
async def create_project(user_id: str, project_data: ProjectCreate):
    project = Project(user_id=user_id, **project_data.dict())
    await db.projects.insert_one(project.dict())
    return project

@api_router.put("/projects/{project_id}")
async def update_project(project_id: str, project_data: ProjectUpdate):
    update_data = {k: v for k, v in project_data.dict().items() if v is not None}
    update_data['updated_at'] = datetime.utcnow()
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project updated successfully"}

# Analytics
@api_router.get("/users/{user_id}/analytics")
async def get_user_analytics(user_id: str):
    # Get lesson progress
    lesson_progress = await db.user_lesson_progress.find({"user_id": user_id}).to_list(1000)
    completed_lessons = len([p for p in lesson_progress if p.get('completed')])
    
    # Get simulations
    user_simulations = await db.user_simulations.find({"user_id": user_id}).to_list(1000)
    
    # Get ethical decisions
    ethical_decisions = await db.user_ethical_decisions.find({"user_id": user_id}).to_list(1000)
    
    # Get projects
    user_projects = await db.projects.find({"user_id": user_id}).to_list(1000)
    
    return {
        "completed_lessons": completed_lessons,
        "total_simulations": len(user_simulations),
        "ethical_decisions": len(ethical_decisions),
        "projects_created": len(user_projects),
        "lesson_progress": [serialize_doc(p) for p in lesson_progress],
        "simulations": [serialize_doc(s) for s in user_simulations],
        "ethical_decisions": [serialize_doc(d) for d in ethical_decisions],
        "projects": [serialize_doc(p) for p in user_projects]
    }

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "GeneAdapt API is running", "version": "1.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialize sample data
@app.on_event("startup")
async def initialize_sample_data():
    # Check if we already have data
    lesson_count = await db.lessons.count_documents({})
    if lesson_count == 0:
        # Add sample lessons
        sample_lessons = [
            {
                "id": "1",
                "title": "Introduction to Gene Editing",
                "description": "Understanding CRISPR, gene therapy, and modern biotechnology",
                "duration": "45 min",
                "difficulty": "Intermediate",
                "topics": ["CRISPR-Cas9", "Gene therapy", "Biotechnology basics"],
                "content": {
                    "sections": [
                        {"title": "CRISPR Basics", "content": "Introduction to CRISPR technology"},
                        {"title": "Applications", "content": "Real-world applications of gene editing"}
                    ]
                },
                "created_at": datetime.utcnow()
            },
            {
                "id": "2", 
                "title": "Climate Change & Genetic Adaptation",
                "description": "How organisms adapt genetically to environmental changes",
                "duration": "60 min",
                "difficulty": "Advanced",
                "topics": ["Climate adaptation", "Natural selection", "Genetic variation"],
                "content": {
                    "sections": [
                        {"title": "Climate Pressures", "content": "Understanding environmental pressures"},
                        {"title": "Genetic Responses", "content": "How genes respond to climate change"}
                    ]
                },
                "created_at": datetime.utcnow()
            }
        ]
        await db.lessons.insert_many(sample_lessons)
        
        # Add sample simulations
        sample_simulations = [
            {
                "id": "1",
                "name": "Drought-Resistant Wheat",
                "organism": "Wheat",
                "target_trait": "Drought Resistance",
                "genes": ["ABA1", "DREB2", "LEA3"],
                "max_level": 5,
                "description": "Engineer wheat to survive water scarcity conditions",
                "created_at": datetime.utcnow()
            },
            {
                "id": "2",
                "name": "Heat-Tolerant Cattle",
                "organism": "Cattle", 
                "target_trait": "Heat Tolerance",
                "genes": ["HSP70", "SLICK", "PRLR"],
                "max_level": 4,
                "description": "Modify cattle genetics for better heat resistance",
                "created_at": datetime.utcnow()
            }
        ]
        await db.simulations.insert_many(sample_simulations)
        
        # Add sample ethical scenarios
        sample_scenarios = [
            {
                "id": "1",
                "title": "Human Heat Adaptation",
                "description": "Should we edit human genes to increase heat tolerance as global temperatures rise?",
                "category": "Human Enhancement",
                "difficulty": "Complex",
                "scenario": {
                    "context": "By 2050, average global temperatures are projected to increase by 2-4°C. Some regions will become nearly uninhabitable without air conditioning. Scientists have identified genes that could increase human heat tolerance by 15-20%.",
                    "question": "A biotech company offers to edit these genes in embryos. What should society decide?",
                    "options": [
                        {
                            "id": "a",
                            "text": "Approve the editing - it's necessary for human survival",
                            "consequences": "Increased survival rates but raises questions about genetic equality and access"
                        },
                        {
                            "id": "b",
                            "text": "Ban the editing - focus on environmental solutions instead", 
                            "consequences": "Maintains genetic integrity but may leave populations vulnerable"
                        },
                        {
                            "id": "c",
                            "text": "Allow it only for high-risk populations with strict regulations",
                            "consequences": "Balanced approach but creates potential for discrimination"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            }
        ]
        await db.ethical_scenarios.insert_many(sample_scenarios)
        
        logger.info("Sample data initialized successfully")