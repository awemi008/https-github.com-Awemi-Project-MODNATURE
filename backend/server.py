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

class CustomSimulationRequest(BaseModel):
    user_id: str
    simulation_name: str
    organism: str
    climate_condition: Dict[str, Any]
    population_traits: List[Dict[str, Any]]
    gene_editing_strategies: List[Dict[str, Any]]

@api_router.post("/simulations/run-custom")
async def run_custom_simulation(request: CustomSimulationRequest):
    """Run a custom simulation with specified parameters"""
    
    # Create custom simulation
    try:
        custom_sim = Simulation(
            name=request.simulation_name,
            organism=request.organism,
            target_trait=f"Adaptation to {request.climate_condition.get('type', 'environmental stress')}",
            genes=[gene for strategy in request.gene_editing_strategies for gene in strategy.get('target_genes', [])],
            max_level=5,
            description=f"Custom simulation for {request.organism} adaptation to {request.climate_condition.get('type')} conditions",
            climate_condition=ClimateCondition(**request.climate_condition) if request.climate_condition else None,
            population_traits=[PopulationTrait(**trait) for trait in request.population_traits],
            gene_editing_strategies=[GeneEditingStrategy(**strategy) for strategy in request.gene_editing_strategies],
            is_custom=True
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid simulation data: {str(e)}")
    
    # Save simulation
    await db.simulations.insert_one(custom_sim.dict())
    
    # Calculate simulation results based on parameters
    base_success_rate = 50.0
    
    # Adjust success rate based on climate severity
    climate_severity_impact = {
        "mild": 0.9, "moderate": 0.7, "severe": 0.5, "extreme": 0.3
    }
    climate_multiplier = climate_severity_impact.get(request.climate_condition.get('severity'), 0.7)
    
    # Adjust based on population trait severity
    trait_impact = 1.0
    for trait in request.population_traits:
        trait_severity_impact = {
            "mild": 0.95, "moderate": 0.85, "severe": 0.7
        }
        trait_impact *= trait_severity_impact.get(trait.get('severity'), 0.85)
    
    # Adjust based on gene editing strategy success rates
    strategy_success = sum([
        strategy.get('success_rate', 70) for strategy in request.gene_editing_strategies
    ]) / len(request.gene_editing_strategies) if request.gene_editing_strategies else 70
    
    # Calculate final metrics
    adaptation_success = (base_success_rate * climate_multiplier * trait_impact * (strategy_success / 100)) > 40
    final_survival_rate = min(95, max(10, base_success_rate * climate_multiplier * trait_impact))
    resistance_level = min(100, max(0, strategy_success * climate_multiplier))
    population_health = min(100, max(20, 80 * trait_impact))
    
    # Create user simulation record
    user_sim = UserSimulation(
        user_id=request.user_id,
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
                request.climate_condition, request.population_traits, request.gene_editing_strategies, adaptation_success
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
        # Add comprehensive lesson data
        comprehensive_lessons = [
            {
                "id": "1",
                "title": "Introduction to Gene Editing",
                "description": "Understanding CRISPR, gene therapy, and modern biotechnology fundamentals",
                "duration": "45 min",
                "difficulty": "Intermediate",
                "topics": ["CRISPR-Cas9", "Gene therapy", "Biotechnology basics", "DNA structure", "Protein synthesis"],
                "content": {
                    "overview": "Gene editing represents one of the most revolutionary advances in modern biology, offering unprecedented precision in modifying genetic material. This lesson introduces the fundamental concepts and technologies that make precise genetic modifications possible.",
                    "learning_objectives": [
                        "Understand the basic principles of gene editing technology",
                        "Learn how CRISPR-Cas9 system works at the molecular level",
                        "Identify different types of gene editing approaches",
                        "Recognize real-world applications of gene editing",
                        "Evaluate the potential and limitations of current technologies"
                    ],
                    "sections": [
                        {
                            "id": 1,
                            "title": "Introduction & DNA Fundamentals",
                            "duration": "10 min",
                            "type": "theory",
                            "content": {
                                "text": "DNA (Deoxyribonucleic acid) is the blueprint of life, containing instructions for building and maintaining every living organism. Understanding DNA structure is crucial for comprehending how gene editing works.",
                                "key_points": [
                                    "DNA consists of four nucleotide bases: A, T, G, C",
                                    "Genes are specific sequences of DNA that code for proteins",
                                    "Mutations in genes can cause diseases or beneficial traits",
                                    "Gene editing allows us to make precise changes to DNA sequences"
                                ],
                                "interactive_elements": [
                                    {
                                        "type": "visualization",
                                        "title": "DNA Double Helix Structure",
                                        "description": "Explore the 3D structure of DNA and how bases pair together"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 2,
                            "title": "CRISPR-Cas9 Mechanism",
                            "duration": "15 min",
                            "type": "interactive",
                            "content": {
                                "text": "CRISPR-Cas9 is like molecular scissors guided by GPS. It consists of two main components: a guide RNA (gRNA) that recognizes the target DNA sequence, and the Cas9 protein that cuts the DNA.",
                                "key_points": [
                                    "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats",
                                    "Guide RNA directs Cas9 to the specific DNA location",
                                    "Cas9 creates a double-strand break in the DNA",
                                    "Cell's repair mechanisms can introduce desired changes",
                                    "Process is highly specific and efficient"
                                ],
                                "interactive_elements": [
                                    {
                                        "type": "step_by_step",
                                        "title": "CRISPR Editing Process",
                                        "steps": [
                                            "Design guide RNA complementary to target sequence",
                                            "Deliver CRISPR components into cells",
                                            "Guide RNA finds matching DNA sequence",
                                            "Cas9 cuts both strands of DNA",
                                            "Cell repairs the break, incorporating changes"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "id": 3,
                            "title": "Types of Gene Editing",
                            "duration": "12 min",
                            "type": "comparison",
                            "content": {
                                "text": "Various gene editing techniques offer different advantages for specific applications. Understanding these differences helps choose the right tool for each task.",
                                "comparison_table": [
                                    {
                                        "technique": "CRISPR-Cas9",
                                        "precision": "High",
                                        "ease_of_use": "Easy",
                                        "cost": "Low",
                                        "applications": "Research, therapeutics, agriculture"
                                    },
                                    {
                                        "technique": "TALENs",
                                        "precision": "Very High",
                                        "ease_of_use": "Moderate",
                                        "cost": "Medium",
                                        "applications": "Therapeutics, precise edits"
                                    },
                                    {
                                        "technique": "Zinc Finger Nucleases",
                                        "precision": "High",
                                        "ease_of_use": "Difficult",
                                        "cost": "High",
                                        "applications": "Early therapeutics"
                                    },
                                    {
                                        "technique": "Base Editing",
                                        "precision": "Very High",
                                        "ease_of_use": "Moderate",
                                        "cost": "Medium",
                                        "applications": "Single nucleotide changes"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 4,
                            "title": "Real-World Applications",
                            "duration": "8 min",
                            "type": "case_studies",
                            "content": {
                                "text": "Gene editing is already making significant impacts in medicine, agriculture, and research. These real-world applications demonstrate the transformative potential of the technology.",
                                "case_studies": [
                                    {
                                        "title": "Sickle Cell Disease Treatment",
                                        "description": "CRISPR therapy successfully treats patients by editing their own blood cells to produce healthy hemoglobin",
                                        "outcome": "Clinical trials show 95% reduction in pain crises",
                                        "significance": "First successful gene editing cure for genetic disease"
                                    },
                                    {
                                        "title": "Drought-Resistant Crops",
                                        "description": "Scientists engineer crops to survive with less water by modifying genes controlling water retention",
                                        "outcome": "30-40% reduction in water needs while maintaining yield",
                                        "significance": "Critical for feeding population amid climate change"
                                    },
                                    {
                                        "title": "Disease-Resistant Livestock",
                                        "description": "Gene editing creates pigs resistant to deadly diseases without using antibiotics",
                                        "outcome": "Complete resistance to PRRS virus in pigs",
                                        "significance": "Reduces antibiotic use and improves animal welfare"
                                    }
                                ]
                            }
                        }
                    ],
                    "quiz": [
                        {
                            "question": "What are the two main components of the CRISPR-Cas9 system?",
                            "options": [
                                "Guide RNA and Cas9 protein",
                                "DNA and protein",
                                "Nucleotides and enzymes",
                                "Genes and chromosomes"
                            ],
                            "correct": 0,
                            "explanation": "CRISPR-Cas9 consists of guide RNA (which finds the target) and Cas9 protein (which cuts the DNA)."
                        },
                        {
                            "question": "Which gene editing technique is currently the most widely used?",
                            "options": [
                                "Zinc Finger Nucleases",
                                "TALENs",
                                "CRISPR-Cas9",
                                "Base editing"
                            ],
                            "correct": 2,
                            "explanation": "CRISPR-Cas9 is the most widely used due to its ease of use, low cost, and high efficiency."
                        }
                    ],
                    "additional_resources": [
                        {
                            "title": "CRISPR Animation by Nature",
                            "type": "video",
                            "url": "https://www.youtube.com/watch?v=2pp17E4E-O8",
                            "description": "Professional animation showing CRISPR mechanism"
                        },
                        {
                            "title": "The CRISPR Foundation",
                            "type": "website",
                            "url": "https://crisprtx.com/gene-editing/crispr-cas9",
                            "description": "Comprehensive resource on CRISPR technology"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            },
            {
                "id": "2",
                "title": "Climate Change & Genetic Adaptation", 
                "description": "How organisms adapt genetically to environmental changes and the role of human intervention",
                "duration": "60 min",
                "difficulty": "Advanced",
                "topics": ["Climate adaptation", "Natural selection", "Genetic variation", "Evolutionary pressure", "Assisted evolution"],
                "content": {
                    "overview": "Climate change is creating unprecedented environmental pressures that require rapid adaptation. This lesson explores how genetic mechanisms enable organisms to survive changing conditions and how we can assist this process.",
                    "learning_objectives": [
                        "Understand the relationship between genetics and climate adaptation",
                        "Learn how natural selection drives genetic changes",
                        "Identify key genes involved in environmental adaptation",
                        "Evaluate strategies for assisted evolution",
                        "Analyze case studies of climate adaptation in nature"
                    ],
                    "sections": [
                        {
                            "id": 1,
                            "title": "Climate Change Challenges",
                            "duration": "12 min",
                            "type": "data_analysis",
                            "content": {
                                "text": "Climate change is happening faster than natural adaptation can occur. Rising temperatures, changing precipitation patterns, and extreme weather events create survival challenges for all life forms.",
                                "key_statistics": [
                                    "Global temperature has risen 1.1°C since 1880",
                                    "Arctic warming is occurring twice as fast as global average",
                                    "Precipitation patterns have shifted dramatically in 60% of regions",
                                    "Extreme weather events have increased 5x since 1970s"
                                ],
                                "climate_impacts": [
                                    {
                                        "factor": "Temperature",
                                        "change": "+1.1°C average, up to +4°C projected",
                                        "biological_impact": "Protein denaturation, metabolic stress, habitat shifts"
                                    },
                                    {
                                        "factor": "Precipitation",
                                        "change": "±30% in many regions",
                                        "biological_impact": "Water stress, drought, flooding adaptations needed"
                                    },
                                    {
                                        "factor": "Ocean pH",
                                        "change": "-0.1 pH units (30% more acidic)",
                                        "biological_impact": "Shell formation problems, coral bleaching"
                                    },
                                    {
                                        "factor": "Sea Level",
                                        "change": "+20cm, up to +1m projected",
                                        "biological_impact": "Habitat loss, saltwater intrusion"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 2,
                            "title": "Genetic Basis of Adaptation",
                            "duration": "18 min",
                            "type": "molecular_biology",
                            "content": {
                                "text": "Adaptation occurs through changes in gene expression and DNA sequences that improve survival in new conditions. Understanding these mechanisms helps us predict and assist adaptation.",
                                "adaptation_mechanisms": [
                                    {
                                        "type": "Gene Expression Changes",
                                        "description": "Existing genes are turned on/off or produce more/less protein",
                                        "time_scale": "Immediate to generational",
                                        "examples": ["Heat shock protein upregulation", "Stress hormone production"]
                                    },
                                    {
                                        "type": "Epigenetic Modifications", 
                                        "description": "Chemical marks on DNA that change gene activity without changing sequence",
                                        "time_scale": "Rapid, sometimes heritable",
                                        "examples": ["DNA methylation", "Histone modifications"]
                                    },
                                    {
                                        "type": "Genetic Mutations",
                                        "description": "Permanent changes in DNA sequence that may provide advantages",
                                        "time_scale": "Generational to evolutionary",
                                        "examples": ["Lactose tolerance", "High-altitude adaptations"]
                                    },
                                    {
                                        "type": "Gene Flow",
                                        "description": "Movement of beneficial alleles between populations",
                                        "time_scale": "Generational",
                                        "examples": ["Hybridization", "Migration"]
                                    }
                                ],
                                "key_adaptation_genes": [
                                    {
                                        "gene": "HSP70",
                                        "function": "Heat shock protection",
                                        "adaptation": "Temperature tolerance",
                                        "found_in": "All organisms"
                                    },
                                    {
                                        "gene": "DREB2",
                                        "function": "Drought response",
                                        "adaptation": "Water stress tolerance",
                                        "found_in": "Plants"
                                    },
                                    {
                                        "gene": "EPAS1",
                                        "function": "Oxygen regulation",
                                        "adaptation": "High altitude tolerance",
                                        "found_in": "Mammals"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 3,
                            "title": "Natural Examples of Climate Adaptation",
                            "duration": "15 min",
                            "type": "case_studies",
                            "content": {
                                "text": "Nature provides numerous examples of rapid genetic adaptation to climate change, offering insights for human-assisted approaches.",
                                "case_studies": [
                                    {
                                        "species": "Tibetan People",
                                        "adaptation": "High-altitude breathing",
                                        "genetic_change": "EPAS1 and EGLN1 gene variants",
                                        "time_frame": "3,000 years",
                                        "mechanism": "Improved oxygen utilization at low pressure",
                                        "lesson": "Rapid human evolution is possible with strong selection"
                                    },
                                    {
                                        "species": "Arctic Foxes",
                                        "adaptation": "Seasonal coat changes",
                                        "genetic_change": "MC1R and ASIP gene regulation",
                                        "time_frame": "10,000 years",
                                        "mechanism": "Photoperiod-controlled pigmentation",
                                        "lesson": "Environmental cues can trigger adaptive responses"
                                    },
                                    {
                                        "species": "Resurrection Plants",
                                        "adaptation": "Extreme desiccation tolerance",
                                        "genetic_change": "LEA proteins and trehalose synthesis",
                                        "time_frame": "Millions of years",
                                        "mechanism": "Cellular protection during dehydration",
                                        "lesson": "Multiple genetic systems work together"
                                    },
                                    {
                                        "species": "Coral Reefs",
                                        "adaptation": "Heat and acid tolerance",
                                        "genetic_change": "Symbiodiniaceae partner switching",
                                        "time_frame": "Decades",
                                        "mechanism": "More thermotolerant algal symbionts",
                                        "lesson": "Adaptation can involve partner organisms"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 4,
                            "title": "Assisted Evolution Strategies",
                            "duration": "15 min",
                            "type": "strategic_planning",
                            "content": {
                                "text": "Human intervention can accelerate adaptation beyond natural rates, helping organisms survive rapid climate change.",
                                "strategies": [
                                    {
                                        "approach": "Selective Breeding",
                                        "description": "Choose individuals with beneficial traits for reproduction",
                                        "pros": ["Safe", "Natural", "Proven effective"],
                                        "cons": ["Slow", "Limited by existing variation"],
                                        "applications": ["Crop improvement", "Livestock breeding"],
                                        "success_rate": "High for available traits"
                                    },
                                    {
                                        "approach": "Assisted Gene Flow",
                                        "description": "Move individuals with adaptive genes between populations",
                                        "pros": ["Increases genetic diversity", "Relatively natural"],
                                        "cons": ["May disrupt local adaptations", "Logistically complex"],
                                        "applications": ["Forest management", "Wildlife conservation"],
                                        "success_rate": "Moderate, requires careful management"
                                    },
                                    {
                                        "approach": "Genetic Engineering",
                                        "description": "Directly introduce beneficial genes from other species",
                                        "pros": ["Rapid", "Can add entirely new capabilities"],
                                        "cons": ["Regulatory hurdles", "Public acceptance issues"],
                                        "applications": ["Crop engineering", "Conservation biology"],
                                        "success_rate": "High for single traits"
                                    },
                                    {
                                        "approach": "Microbiome Engineering",
                                        "description": "Modify associated microorganisms to help hosts adapt",
                                        "pros": ["Rapid deployment", "Environmentally friendly"],
                                        "cons": ["Complex interactions", "Stability concerns"],
                                        "applications": ["Coral reef restoration", "Plant disease resistance"],
                                        "success_rate": "Emerging, promising results"
                                    }
                                ]
                            }
                        }
                    ],
                    "quiz": [
                        {
                            "question": "Which genetic mechanism allows the fastest response to environmental change?",
                            "options": [
                                "DNA mutations",
                                "Gene expression changes",
                                "Chromosomal rearrangements",
                                "Gene duplications"
                            ],
                            "correct": 1,
                            "explanation": "Gene expression changes can occur immediately in response to environmental signals, while mutations take generations to spread."
                        },
                        {
                            "question": "What is the main advantage of assisted gene flow over genetic engineering?",
                            "options": [
                                "It's faster",
                                "It's more precise",
                                "It uses naturally occurring genetic variation",
                                "It's cheaper"
                            ],
                            "correct": 2,
                            "explanation": "Assisted gene flow moves existing natural genetic variants between populations, avoiding the need to create artificial modifications."
                        }
                    ],
                    "additional_resources": [
                        {
                            "title": "Climate Change and Evolution - Nature",
                            "type": "scientific_article",
                            "description": "Comprehensive review of evolutionary responses to climate change"
                        },
                        {
                            "title": "Assisted Evolution of Corals",
                            "type": "research_project",
                            "description": "Australian Institute of Marine Science project on coral adaptation"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            },
            {
                "id": "3",
                "title": "Drought-Resistant Crops",
                "description": "Engineering plants to survive water scarcity through genetic modifications",
                "duration": "50 min",
                "difficulty": "Advanced",
                "topics": ["Crop modification", "Water stress response", "Agricultural biotechnology", "Plant physiology", "Sustainable agriculture"],
                "content": {
                    "overview": "Water scarcity affects 2 billion people globally and is worsening with climate change. Engineering drought-resistant crops is essential for food security and sustainable agriculture in the 21st century.",
                    "learning_objectives": [
                        "Understand plant water stress responses at molecular level",
                        "Learn genetic targets for drought resistance engineering",
                        "Analyze successful crop modification examples",
                        "Evaluate trade-offs between drought tolerance and yield",
                        "Design strategies for sustainable drought-resistant agriculture"
                    ],
                    "sections": [
                        {
                            "id": 1,
                            "title": "Plant Water Stress Biology",
                            "duration": "15 min",
                            "type": "plant_biology",
                            "content": {
                                "text": "Plants have evolved sophisticated mechanisms to sense, respond to, and survive water stress. Understanding these natural systems guides genetic engineering approaches.",
                                "water_stress_responses": [
                                    {
                                        "level": "Cellular",
                                        "responses": [
                                            "Osmotic adjustment - accumulating solutes to maintain cell pressure",
                                            "Membrane stabilization - protecting cell membranes from damage",
                                            "Protein protection - producing protective proteins and sugars",
                                            "Antioxidant production - preventing oxidative damage"
                                        ]
                                    },
                                    {
                                        "level": "Physiological",
                                        "responses": [
                                            "Stomatal closure - reducing water loss through leaf pores",
                                            "Root growth - extending roots to find water",
                                            "Leaf area reduction - minimizing surface area for water loss",
                                            "Water storage - storing water in specialized tissues"
                                        ]
                                    },
                                    {
                                        "level": "Developmental",
                                        "responses": [
                                            "Early flowering - completing reproduction before stress peaks",
                                            "Seed dormancy - waiting for better conditions",
                                            "Alternative growth patterns - adapting structure to conserve water",
                                            "Resource allocation - prioritizing survival over growth"
                                        ]
                                    }
                                ],
                                "key_signaling_pathways": [
                                    {
                                        "pathway": "ABA Signaling",
                                        "trigger": "Water stress detection",
                                        "response": "Stomatal closure, gene expression changes",
                                        "key_genes": ["ABA1", "ABA2", "NCED3"]
                                    },
                                    {
                                        "pathway": "DREB/CBF",
                                        "trigger": "Dehydration stress",
                                        "response": "Protective protein production",
                                        "key_genes": ["DREB2A", "DREB2B", "CBF1-3"]
                                    }
                                ]
                            }
                        },
                        {
                            "id": 2,
                            "title": "Genetic Targets for Engineering",
                            "duration": "18 min",
                            "type": "genetic_engineering",
                            "content": {
                                "text": "Successful drought resistance engineering targets multiple pathways simultaneously, mimicking nature's multi-layered approach to water stress survival.",
                                "target_categories": [
                                    {
                                        "category": "Water Uptake & Transport",
                                        "description": "Improving plant's ability to find and move water",
                                        "targets": [
                                            {
                                                "gene": "Aquaporins (PIP, TIP families)",
                                                "function": "Water channel proteins",
                                                "modification": "Overexpression increases water transport efficiency",
                                                "impact": "15-25% better water uptake"
                                            },
                                            {
                                                "gene": "Root development genes",
                                                "function": "Root architecture control",
                                                "modification": "Enhanced root branching and depth",
                                                "impact": "30-50% larger root system"
                                            }
                                        ]
                                    },
                                    {
                                        "category": "Water Conservation",
                                        "description": "Reducing water loss from plant tissues",
                                        "targets": [
                                            {
                                                "gene": "Cuticular wax genes",
                                                "function": "Waxy protective coating",
                                                "modification": "Increased wax production",
                                                "impact": "20-40% reduced water loss"
                                            },
                                            {
                                                "gene": "Stomatal regulation genes",
                                                "function": "Control of leaf pores",
                                                "modification": "Improved closure sensitivity",
                                                "impact": "10-30% better water use efficiency"
                                            }
                                        ]
                                    },
                                    {
                                        "category": "Cellular Protection",
                                        "description": "Protecting cells from dehydration damage",
                                        "targets": [
                                            {
                                                "gene": "LEA proteins",
                                                "function": "Cellular protection during dehydration",
                                                "modification": "Overexpression of multiple LEA genes",
                                                "impact": "50-80% better survival of severe drought"
                                            },
                                            {
                                                "gene": "Trehalose synthesis genes",
                                                "function": "Protective sugar production",
                                                "modification": "Enhanced trehalose accumulation",
                                                "impact": "25-45% improved stress tolerance"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "id": 3,
                            "title": "Success Stories in Drought Engineering",
                            "duration": "12 min",
                            "type": "case_studies",
                            "content": {
                                "text": "Several drought-resistant crops have been successfully developed and deployed, demonstrating the practical potential of genetic engineering approaches.",
                                "success_stories": [
                                    {
                                        "crop": "DroughtGard Maize",
                                        "developer": "Monsanto/Bayer",
                                        "genes_used": ["CspB (from Bacillus subtilis)"],
                                        "mechanism": "Cold shock protein protects cellular machinery",
                                        "performance": "6-10% yield advantage under drought stress",
                                        "adoption": "Planted on millions of acres in US",
                                        "lessons": "Single gene can provide significant benefits"
                                    },
                                    {
                                        "crop": "Water Efficient Maize for Africa (WEMA)",
                                        "developer": "Public-private partnership",
                                        "genes_used": ["Multiple drought tolerance genes"],
                                        "mechanism": "Enhanced water use efficiency and stress tolerance",
                                        "performance": "20-35% yield improvement under drought",
                                        "adoption": "Released in Kenya, Uganda, Tanzania",
                                        "lessons": "Gene stacking provides greater benefits"
                                    },
                                    {
                                        "crop": "HB4 Soybeans",
                                        "developer": "Bioceres",
                                        "genes_used": ["HAHB-4 (from sunflower)"],
                                        "mechanism": "Transcription factor regulating multiple stress genes",
                                        "performance": "15-20% better yield under water stress",
                                        "adoption": "Approved in Argentina, Paraguay",
                                        "lessons": "Cross-species gene transfer can work well"
                                    },
                                    {
                                        "crop": "C4 Rice Project",
                                        "developer": "International Rice Research Institute",
                                        "genes_used": ["C4 photosynthesis pathway genes"],
                                        "mechanism": "More efficient photosynthesis reduces water needs",
                                        "performance": "Target: 50% increase in water use efficiency",
                                        "adoption": "Still in development",
                                        "lessons": "Complex traits require sustained long-term effort"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 4,
                            "title": "Future Directions & Challenges",
                            "duration": "5 min",
                            "type": "future_outlook",
                            "content": {
                                "text": "Next-generation approaches promise even more effective drought resistance through advanced technologies and systems approaches.",
                                "emerging_approaches": [
                                    {
                                        "approach": "Gene Editing (CRISPR)",
                                        "description": "Precise modification of existing plant genes",
                                        "advantages": ["No foreign DNA", "Precise targeting", "Faster development"],
                                        "current_projects": ["Improved wheat WAXY gene", "Enhanced rice stomatal control"]
                                    },
                                    {
                                        "approach": "Microbiome Engineering",
                                        "description": "Modifying beneficial soil microbes",
                                        "advantages": ["Environmentally friendly", "Rapid deployment", "Self-sustaining"],
                                        "current_projects": ["Drought-protecting bacteria", "Mycorrhizal enhancement"]
                                    },
                                    {
                                        "approach": "Synthetic Biology",
                                        "description": "Designing entirely new biological systems",
                                        "advantages": ["Unlimited possibilities", "Optimized pathways", "Multiple trait stacking"],
                                        "current_projects": ["Synthetic drought circuits", "Bio-inspired water sensors"]
                                    }
                                ],
                                "remaining_challenges": [
                                    "Balancing drought tolerance with yield and nutrition",
                                    "Ensuring stability across diverse environments",
                                    "Regulatory approval for new technologies",
                                    "Public acceptance and farmer adoption",
                                    "Preventing pest adaptation to modified crops"
                                ]
                            }
                        }
                    ],
                    "quiz": [
                        {
                            "question": "Which cellular response is most important for immediate drought survival?",
                            "options": [
                                "Root growth",
                                "Osmotic adjustment",
                                "Early flowering",
                                "Leaf reduction"
                            ],
                            "correct": 1,
                            "explanation": "Osmotic adjustment helps maintain cell pressure and function immediately when water becomes scarce, while other responses take longer to develop."
                        },
                        {
                            "question": "What is the main advantage of using transcription factors like DREB2 in drought engineering?",
                            "options": [
                                "They control multiple downstream genes",
                                "They work faster than other genes",
                                "They use less energy",
                                "They don't require regulatory approval"
                            ],
                            "correct": 0,
                            "explanation": "Transcription factors like DREB2 regulate many genes simultaneously, providing coordinated drought responses rather than single improvements."
                        }
                    ],
                    "additional_resources": [
                        {
                            "title": "Plant Stress Biology - Textbook Chapter",
                            "type": "academic_text",
                            "description": "Comprehensive coverage of plant responses to environmental stress"
                        },
                        {
                            "title": "CGIAR Drought Research",
                            "type": "research_organization",
                            "description": "International agricultural research on drought-resistant crops"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            },
            {
                "id": "4",
                "title": "Heat-Tolerant Livestock",
                "description": "Genetic modifications for temperature adaptation in farm animals",
                "duration": "55 min", 
                "difficulty": "Advanced",
                "topics": ["Animal genetics", "Heat shock proteins", "Metabolic adaptation", "Thermoregulation", "Livestock breeding"],
                "content": {
                    "overview": "Rising global temperatures threaten livestock health and productivity. Understanding animal thermoregulation and applying genetic solutions can help ensure food security while improving animal welfare in a warming world.",
                    "learning_objectives": [
                        "Understand mammalian thermoregulation mechanisms",
                        "Learn about heat stress impacts on livestock",
                        "Identify genetic targets for heat tolerance",
                        "Analyze successful breeding and genetic modification programs",
                        "Evaluate ethical considerations in livestock genetic modification"
                    ],
                    "sections": [
                        {
                            "id": 1,
                            "title": "Animal Thermoregulation Biology",
                            "duration": "15 min",
                            "type": "animal_physiology",
                            "content": {
                                "text": "Mammals maintain constant body temperature through sophisticated physiological and behavioral mechanisms. Understanding these systems is crucial for improving heat tolerance.",
                                "thermoregulation_mechanisms": [
                                    {
                                        "type": "Physiological",
                                        "mechanisms": [
                                            {
                                                "name": "Sweating/Panting",
                                                "description": "Evaporative cooling through water loss",
                                                "effectiveness": "High, but water-dependent",
                                                "energy_cost": "Moderate"
                                            },
                                            {
                                                "name": "Vasodilation",
                                                "description": "Increased blood flow to skin surface",
                                                "effectiveness": "Moderate",
                                                "energy_cost": "Low"
                                            },
                                            {
                                                "name": "Metabolic Adjustment",
                                                "description": "Reduced heat-producing metabolic processes",
                                                "effectiveness": "High, but affects performance",
                                                "energy_cost": "Variable"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Behavioral",
                                        "mechanisms": [
                                            {
                                                "name": "Shade Seeking",
                                                "description": "Moving to cooler microenvironments",
                                                "effectiveness": "High when available",
                                                "energy_cost": "Low"
                                            },
                                            {
                                                "name": "Activity Reduction",
                                                "description": "Reducing heat-generating activities",
                                                "effectiveness": "Moderate",
                                                "energy_cost": "Opportunity cost"
                                            },
                                            {
                                                "name": "Water Seeking",
                                                "description": "Finding water for drinking and cooling",
                                                "effectiveness": "Essential",
                                                "energy_cost": "Travel cost"
                                            }
                                        ]
                                    }
                                ],
                                "heat_stress_impacts": [
                                    {
                                        "system": "Reproductive",
                                        "impacts": ["Reduced fertility", "Embryo loss", "Altered hormone cycles"],
                                        "severity": "Severe - can stop reproduction entirely"
                                    },
                                    {
                                        "system": "Production",
                                        "impacts": ["Reduced milk yield", "Lower growth rates", "Poor feed conversion"],
                                        "severity": "High - major economic impact"
                                    },
                                    {
                                        "system": "Immune",
                                        "impacts": ["Increased disease susceptibility", "Slower wound healing", "Vaccine failures"],
                                        "severity": "Moderate to severe"
                                    },
                                    {
                                        "system": "Metabolic",
                                        "impacts": ["Cellular damage", "Protein denaturation", "Oxidative stress"],
                                        "severity": "Progressive with temperature"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 2,
                            "title": "Genetic Targets for Heat Tolerance",
                            "duration": "20 min",
                            "type": "molecular_genetics",
                            "content": {
                                "text": "Multiple genetic pathways control heat tolerance in animals. Successful improvement requires understanding which genes to target and how to modify them effectively.",
                                "target_pathways": [
                                    {
                                        "pathway": "Heat Shock Response",
                                        "description": "Cellular protection system activated by temperature stress",
                                        "key_genes": [
                                            {
                                                "gene": "HSP70",
                                                "function": "Protein folding and protection",
                                                "modification_approach": "Overexpression or enhanced induction",
                                                "expected_benefit": "20-30% better heat survival"
                                            },
                                            {
                                                "gene": "HSP90",
                                                "function": "Protein stabilization and signaling",
                                                "modification_approach": "Improved stability and expression",
                                                "expected_benefit": "Enhanced cellular stress response"
                                            },
                                            {
                                                "gene": "HSF1",
                                                "function": "Master regulator of heat shock response",
                                                "modification_approach": "Enhanced sensitivity and activity",
                                                "expected_benefit": "Faster and stronger heat response"
                                            }
                                        ]
                                    },
                                    {
                                        "pathway": "Thermoregulatory Control",
                                        "description": "Neural and hormonal systems controlling body temperature",
                                        "key_genes": [
                                            {
                                                "gene": "TRPV1",
                                                "function": "Temperature sensing",
                                                "modification_approach": "Enhanced sensitivity to heat",
                                                "expected_benefit": "Earlier and more precise heat detection"
                                            },
                                            {
                                                "gene": "SLICK",
                                                "function": "Hair follicle development (short hair phenotype)",
                                                "modification_approach": "Promote short hair coat",
                                                "expected_benefit": "30-50% better heat dissipation"
                                            },
                                            {
                                                "gene": "PRLR",
                                                "function": "Prolactin receptor (affects hair growth)",
                                                "modification_approach": "Modified for heat-adapted hair patterns",
                                                "expected_benefit": "Improved coat characteristics"
                                            }
                                        ]
                                    },
                                    {
                                        "pathway": "Metabolic Adaptation",
                                        "description": "Cellular metabolism adjustments for heat tolerance",
                                        "key_genes": [
                                            {
                                                "gene": "UCP1",
                                                "function": "Uncoupling protein (heat generation control)",
                                                "modification_approach": "Reduced expression or activity",
                                                "expected_benefit": "Lower internal heat production"
                                            },
                                            {
                                                "gene": "PPARA",
                                                "function": "Fat metabolism regulation",
                                                "modification_approach": "Enhanced fat utilization",
                                                "expected_benefit": "More efficient energy use"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "id": 3,
                            "title": "Successful Heat Tolerance Programs",
                            "duration": "15 min",
                            "type": "breeding_programs",
                            "content": {
                                "text": "Both traditional breeding and modern genetic approaches have produced heat-tolerant livestock, providing models for future development.",
                                "success_stories": [
                                    {
                                        "program": "Senepol Cattle",
                                        "approach": "Traditional breeding",
                                        "origin": "Caribbean (St. John Island)",
                                        "key_traits": ["Short hair", "Efficient sweating", "Heat-adapted metabolism"],
                                        "performance": "Maintains productivity in 35°C+ temperatures",
                                        "adoption": "Worldwide in hot climates",
                                        "lesson": "Natural adaptation can be leveraged through breeding"
                                    },
                                    {
                                        "program": "Slick Gene in Holstein Cattle",
                                        "approach": "Genetic marker selection",
                                        "origin": "Puerto Rico Holstein population",
                                        "key_traits": ["Very short hair coat", "Improved heat tolerance"],
                                        "performance": "1-2°C lower body temperature in heat",
                                        "adoption": "Spreading to hot climate dairy operations",
                                        "lesson": "Single genes can have major effects"
                                    },
                                    {
                                        "program": "Heat-Tolerant Pigs (China)",
                                        "approach": "Genomic selection",
                                        "origin": "Chinese local breeds + modern genetics",
                                        "key_traits": ["Enhanced sweating", "Better feed efficiency in heat"],
                                        "performance": "15-20% better growth in hot conditions",
                                        "adoption": "Commercial use in Southern China",
                                        "lesson": "Combining traditional and modern breeds works"
                                    },
                                    {
                                        "program": "Gene-Edited Heat-Tolerant Cattle",
                                        "approach": "CRISPR gene editing",
                                        "origin": "University research programs",
                                        "key_traits": ["Enhanced heat shock proteins", "Modified coat genes"],
                                        "performance": "Experimental - showing promising results",
                                        "adoption": "Still in development/regulatory review",
                                        "lesson": "Gene editing offers precision improvements"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 4,
                            "title": "Ethical Considerations & Future Directions",
                            "duration": "5 min",
                            "type": "ethics_and_future",
                            "content": {
                                "text": "Genetic modification of livestock raises important ethical questions about animal welfare, food safety, and environmental impact that must be carefully considered.",
                                "ethical_considerations": [
                                    {
                                        "category": "Animal Welfare",
                                        "considerations": [
                                            "Do modifications improve overall animal comfort?",
                                            "Are there unintended health consequences?",
                                            "How do we balance productivity with natural behavior?"
                                        ],
                                        "current_consensus": "Modifications that reduce suffering are generally supported"
                                    },
                                    {
                                        "category": "Food Safety",
                                        "considerations": [
                                            "Are products from modified animals safe to consume?",
                                            "Should modified animal products be labeled?",
                                            "What are long-term health effects?"
                                        ],
                                        "current_consensus": "Breeding-based changes widely accepted, gene editing more controversial"
                                    },
                                    {
                                        "category": "Environmental Impact",
                                        "considerations": [
                                            "Could modified animals escape and affect wild populations?",
                                            "Do modifications reduce environmental footprint?",
                                            "How do we maintain genetic diversity?"
                                        ],
                                        "current_consensus": "Benefits must clearly outweigh risks"
                                    }
                                ],
                                "future_directions": [
                                    "Precision gene editing for minimal, targeted improvements",
                                    "Combination approaches using breeding + technology",
                                    "Real-time monitoring systems for animal comfort",
                                    "Development of reversible genetic modifications",
                                    "Integration with climate-controlled housing systems"
                                ]
                            }
                        }
                    ],
                    "quiz": [
                        {
                            "question": "Which physiological mechanism is most energy-efficient for heat dissipation in mammals?",
                            "options": [
                                "Panting",
                                "Sweating", 
                                "Vasodilation",
                                "Behavioral cooling"
                            ],
                            "correct": 2,
                            "explanation": "Vasodilation increases blood flow to skin surface for heat dissipation with minimal energy cost, while panting and sweating require energy and water."
                        },
                        {
                            "question": "What makes the SLICK gene particularly valuable for heat tolerance?",
                            "options": [
                                "It increases sweating rate",
                                "It produces shorter hair coats",
                                "It improves water retention",
                                "It enhances protein stability"
                            ],
                            "correct": 1,
                            "explanation": "The SLICK gene produces shorter hair coats that improve heat dissipation, providing a significant thermoregulatory advantage."
                        }
                    ],
                    "additional_resources": [
                        {
                            "title": "Animal Thermoregulation - Physiology Textbook",
                            "type": "academic_text",
                            "description": "Detailed coverage of temperature regulation in mammals"
                        },
                        {
                            "title": "FAO Climate Change and Livestock",
                            "type": "policy_report",
                            "description": "UN report on climate impacts and adaptation strategies for livestock"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            },
            {
                "id": "5",
                "title": "Ethical Considerations in Gene Editing",
                "description": "Exploring the moral, social, and philosophical implications of genetic modifications",
                "duration": "40 min",
                "difficulty": "Intermediate",
                "topics": ["Bioethics", "Genetic enhancement", "Social justice", "Risk assessment", "Regulatory frameworks"],
                "content": {
                    "overview": "Gene editing technology offers tremendous potential benefits but also raises profound ethical questions about human nature, equality, and the responsible use of powerful technologies. This lesson explores the key ethical frameworks and debates surrounding genetic modifications.",
                    "learning_objectives": [
                        "Understand major ethical frameworks for evaluating gene editing",
                        "Analyze real-world ethical dilemmas in genetic modification",
                        "Evaluate arguments for and against different applications",
                        "Develop skills for ethical reasoning about emerging technologies",
                        "Understand regulatory approaches to genetic modification"
                    ],
                    "sections": [
                        {
                            "id": 1,
                            "title": "Ethical Frameworks for Gene Editing",
                            "duration": "12 min",
                            "type": "philosophical_analysis",
                            "content": {
                                "text": "Different ethical traditions provide varying perspectives on the acceptability of genetic modifications. Understanding these frameworks helps structure thinking about complex moral questions.",
                                "ethical_frameworks": [
                                    {
                                        "framework": "Consequentialism/Utilitarianism",
                                        "principle": "Actions are right if they produce the best overall outcomes",
                                        "application_to_gene_editing": "Gene editing is ethical if benefits outweigh harms for all affected parties",
                                        "strengths": ["Clear decision criteria", "Considers all stakeholders", "Flexible to situations"],
                                        "weaknesses": ["Difficult to predict outcomes", "May justify harming minorities", "Challenges in measuring 'utility'"],
                                        "example_reasoning": "Editing disease genes is justified because it reduces suffering and improves quality of life"
                                    },
                                    {
                                        "framework": "Deontological Ethics",
                                        "principle": "Some actions are right or wrong regardless of consequences",
                                        "application_to_gene_editing": "Gene editing may violate fundamental duties like respect for human dignity",
                                        "strengths": ["Protects fundamental rights", "Clear moral rules", "Respects human dignity"],
                                        "weaknesses": ["May prohibit beneficial actions", "Conflicts between duties", "Inflexible to new situations"],
                                        "example_reasoning": "Editing human embryos is wrong because it treats future people as means to an end"
                                    },
                                    {
                                        "framework": "Virtue Ethics",
                                        "principle": "Focus on character traits and what virtuous people would do",
                                        "application_to_gene_editing": "Gene editing should reflect virtues like compassion, prudence, and justice",
                                        "strengths": ["Considers moral character", "Flexible guidance", "Emphasizes human flourishing"],
                                        "weaknesses": ["Subjective virtues", "Cultural variation", "Less specific guidance"],
                                        "example_reasoning": "A compassionate person would use gene editing to prevent genetic diseases"
                                    },
                                    {
                                        "framework": "Principlism",
                                        "principle": "Balance four key principles: autonomy, beneficence, non-maleficence, justice",
                                        "application_to_gene_editing": "Genetic modifications must respect choice, help people, avoid harm, and be fairly distributed",
                                        "strengths": ["Practical framework", "Widely accepted", "Balances multiple concerns"],
                                        "weaknesses": ["Principles may conflict", "Requires judgment calls", "Cultural assumptions"],
                                        "example_reasoning": "Gene therapy respects autonomy (patient choice), is beneficent (treats disease), minimizes harm, and should be accessible to all"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 2,
                            "title": "Therapeutic vs Enhancement Debate",
                            "duration": "10 min",
                            "type": "ethical_analysis",
                            "content": {
                                "text": "One of the central debates in gene editing ethics is the distinction between therapeutic applications (treating disease) and enhancement applications (improving normal traits).",
                                "therapeutic_applications": {
                                    "definition": "Using gene editing to treat or prevent genetic diseases",
                                    "examples": ["Sickle cell disease treatment", "Huntington's disease prevention", "Cystic fibrosis correction"],
                                    "ethical_arguments_for": [
                                        "Relieves suffering and saves lives",
                                        "Restores normal function rather than enhancing",
                                        "Similar to accepted medical treatments",
                                        "Addresses clear medical needs"
                                    ],
                                    "ethical_concerns": [
                                        "Defining 'disease' vs 'normal variation'",
                                        "Potential unknown long-term effects",
                                        "Access and cost considerations",
                                        "Slippery slope to enhancement"
                                    ],
                                    "current_consensus": "Generally accepted with appropriate safety measures"
                                },
                                "enhancement_applications": {
                                    "definition": "Using gene editing to improve normal human traits beyond typical ranges",
                                    "examples": ["Enhanced intelligence", "Improved athletic performance", "Aesthetic modifications", "Extended lifespan"],
                                    "ethical_arguments_for": [
                                        "Individual autonomy and choice",
                                        "Could reduce suffering from limitations",
                                        "Natural extension of human self-improvement",
                                        "Potential societal benefits"
                                    ],
                                    "ethical_concerns": [
                                        "Creates inequality between enhanced/unenhanced",
                                        "Pressure to enhance to remain competitive",
                                        "Unknown risks of modifications",
                                        "Changes human nature in concerning ways",
                                        "Justice concerns about access"
                                    ],
                                    "current_consensus": "Highly controversial, not currently permitted in humans"
                                },
                                "gray_areas": [
                                    {
                                        "scenario": "Preventing genetic predisposition to heart disease",
                                        "therapy_argument": "Prevents serious medical condition",
                                        "enhancement_argument": "Goes beyond treating active disease",
                                        "consensus": "Leaning toward therapeutic"
                                    },
                                    {
                                        "scenario": "Editing for increased heat tolerance in climate change",
                                        "therapy_argument": "Prevents heat-related illness and death",
                                        "enhancement_argument": "Adds capability beyond normal human range",
                                        "consensus": "Highly debated"
                                    }
                                ]
                            }
                        },
                        {
                            "id": 3,
                            "title": "Justice and Access Issues",
                            "duration": "10 min",
                            "type": "social_ethics",
                            "content": {
                                "text": "Gene editing raises important questions about fairness, equality, and social justice, particularly regarding who has access to genetic modifications and their broader social impacts.",
                                "access_challenges": [
                                    {
                                        "challenge": "Economic Barriers",
                                        "description": "High costs may limit access to wealthy individuals/countries",
                                        "implications": [
                                            "Could worsen existing health disparities",
                                            "Genetic 'haves' and 'have-nots' emerge",
                                            "International competitiveness issues"
                                        ],
                                        "potential_solutions": [
                                            "Public funding for genetic therapies",
                                            "International cooperation and sharing",
                                            "Technology development to reduce costs"
                                        ]
                                    },
                                    {
                                        "challenge": "Geographic Disparities", 
                                        "description": "Advanced healthcare infrastructure required for gene editing",
                                        "implications": [
                                            "Rural and developing regions left behind",
                                            "Brain drain as people seek genetic treatments",
                                            "Global inequality in human capabilities"
                                        ],
                                        "potential_solutions": [
                                            "Technology transfer programs",
                                            "Mobile genetic therapy units",
                                            "Training programs for healthcare workers"
                                        ]
                                    },
                                    {
                                        "challenge": "Cultural and Religious Objections",
                                        "description": "Some groups may refuse genetic modifications for ethical/religious reasons",
                                        "implications": [
                                            "Self-imposed exclusion from benefits",
                                            "Potential discrimination against unmodified individuals",
                                            "Preserving cultural diversity vs promoting health"
                                        ],
                                        "potential_solutions": [
                                            "Respect for diverse viewpoints",
                                            "Alternative treatment options",
                                            "Education and dialogue programs"
                                        ]
                                    }
                                ],
                                "justice_considerations": [
                                    {
                                        "principle": "Distributive Justice",
                                        "question": "How should genetic modifications be distributed in society?",
                                        "approaches": [
                                            "Equal access for all (egalitarian)",
                                            "Based on medical need (utilitarian)",
                                            "Market-based distribution (libertarian)",
                                            "Priority to worst-off (difference principle)"
                                        ]
                                    },
                                    {
                                        "principle": "Intergenerational Justice",
                                        "question": "What do we owe to future generations?",
                                        "considerations": [
                                            "Obligation to prevent genetic diseases",
                                            "Right to an unmodified genetic heritage",
                                            "Environmental vs genetic solutions to problems",
                                            "Preserving human genetic diversity"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "id": 4,
                            "title": "Governance and Regulation",
                            "duration": "8 min",
                            "type": "policy_analysis", 
                            "content": {
                                "text": "Effective governance of gene editing requires balancing innovation with safety, public input with scientific expertise, and national interests with global coordination.",
                                "regulatory_approaches": [
                                    {
                                        "country": "United States",
                                        "approach": "FDA regulation with Congressional funding restrictions",
                                        "key_features": [
                                            "No federal funding for heritable human genome editing",
                                            "FDA oversight of clinical trials",
                                            "State-level variation in policies"
                                        ],
                                        "strengths": ["Precautionary approach", "Democratic input"],
                                        "weaknesses": ["Inconsistent policies", "May drive research overseas"]
                                    },
                                    {
                                        "country": "United Kingdom",
                                        "approach": "Specialized regulatory body (HFEA) with licensed oversight",
                                        "key_features": [
                                            "Human Fertilisation and Embryology Authority oversight",
                                            "Case-by-case licensing of research",
                                            "Public engagement in policy development"
                                        ],
                                        "strengths": ["Expert oversight", "Flexible framework"],
                                        "weaknesses": ["Complex approval process", "Resource intensive"]
                                    },
                                    {
                                        "country": "China",
                                        "approach": "Government oversight with significant research investment",
                                        "key_features": [
                                            "National Health Commission regulation",
                                            "Major government funding for research",
                                            "Recent strengthening of oversight after controversies"
                                        ],
                                        "strengths": ["Rapid advancement", "Coordinated approach"],
                                        "weaknesses": ["Past oversight failures", "Limited public input"]
                                    }
                                ],
                                "international_coordination": [
                                    {
                                        "organization": "World Health Organization",
                                        "role": "Developing global standards and recommendations",
                                        "achievements": ["Expert advisory committee", "Global registry of research"]
                                    },
                                    {
                                        "organization": "International Summit on Human Gene Editing",
                                        "role": "Bringing together scientists and ethicists globally",
                                        "achievements": ["Consensus statements", "Ongoing dialogue"]
                                    }
                                ],
                                "governance_challenges": [
                                    "Keeping pace with rapidly advancing technology",
                                    "Balancing innovation with precaution",
                                    "Preventing 'regulatory arbitrage' between countries",
                                    "Including diverse voices in decision-making",
                                    "Addressing enforcement and compliance"
                                ]
                            }
                        }
                    ],
                    "quiz": [
                        {
                            "question": "According to principlism, which ethical principles must be balanced in gene editing decisions?",
                            "options": [
                                "Autonomy, beneficence, non-maleficence, justice",
                                "Rights, duties, consequences, virtues",
                                "Safety, efficacy, access, privacy",
                                "Individual, family, society, species"
                            ],
                            "correct": 0,
                            "explanation": "Principlism balances four key principles: respect for autonomy (individual choice), beneficence (doing good), non-maleficence (avoiding harm), and justice (fairness)."
                        },
                        {
                            "question": "What is the main ethical concern about genetic enhancement applications?",
                            "options": [
                                "They are more technically difficult",
                                "They could increase social inequality",
                                "They cost more than therapy",
                                "They require more research"
                            ],
                            "correct": 1,
                            "explanation": "The primary ethical concern about genetic enhancement is that it could create or worsen social inequalities between those who can access enhancements and those who cannot."
                        }
                    ],
                    "additional_resources": [
                        {
                            "title": "Nuffield Council on Bioethics - Genome Editing",
                            "type": "policy_report",
                            "description": "Comprehensive ethical analysis of human genome editing"
                        },
                        {
                            "title": "UNESCO Universal Declaration on the Human Genome",
                            "type": "international_declaration",
                            "description": "International principles for genetic research and applications"
                        }
                    ]
                },
                "created_at": datetime.utcnow()
            }
        ]
        await db.lessons.insert_many(comprehensive_lessons)
        
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