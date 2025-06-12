#!/usr/bin/env python3
import requests
import json
import time
import uuid
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from frontend/.env
frontend_env_path = Path('/app/frontend/.env')
load_dotenv(frontend_env_path)

# Get the backend URL from the environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"

print(f"Testing backend API at: {API_URL}")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, message="", response=None):
    """Log test results and print to console"""
    status = "✅ PASSED" if passed else "❌ FAILED"
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "message": message,
        "response": response.json() if response and hasattr(response, 'json') else None
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
    
    print(f"{status} - {name}")
    if message:
        print(f"  {message}")
    if response:
        try:
            print(f"  Status Code: {response.status_code}")
            print(f"  Response: {json.dumps(response.json(), indent=2)[:500]}...")
        except:
            print(f"  Response: {response.text[:500]}...")
    print("-" * 80)

def test_api_health():
    """Test API health endpoints"""
    print("\n🔍 Testing API Health & Basic Connectivity")
    
    # Test root endpoint
    try:
        print(f"Trying to connect to {API_URL}/")
        response = requests.get(f"{API_URL}/", timeout=10)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        log_test(
            "API Root Endpoint", 
            response.status_code == 200 and "message" in response.json(),
            response=response
        )
    except Exception as e:
        log_test("API Root Endpoint", False, f"Exception: {str(e)}")
    
    # Test health endpoint
    try:
        print(f"Trying to connect to {API_URL}/health")
        response = requests.get(f"{API_URL}/health", timeout=10)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        log_test(
            "API Health Endpoint", 
            response.status_code == 200 and response.json().get("status") == "healthy",
            response=response
        )
    except Exception as e:
        log_test("API Health Endpoint", False, f"Exception: {str(e)}")

def test_user_management():
    """Test user management endpoints"""
    print("\n🔍 Testing User Management System")
    
    # Create a test user
    user_data = {
        "name": f"Test Student {uuid.uuid4().hex[:8]}",
        "email": f"student_{uuid.uuid4().hex[:8]}@example.com",
        "grade": "11",
        "school": "Science High School"
    }
    
    try:
        response = requests.post(f"{API_URL}/users", json=user_data)
        user_created = response.status_code == 200 and "id" in response.json()
        log_test("Create User", user_created, response=response)
        
        if user_created:
            # The server returns MongoDB's _id as the id field
            user_id = response.json()["id"]
            
            # Print the user ID for debugging
            print(f"Created user with ID: {user_id}")
            
            # Get user by ID - using the MongoDB _id that was returned
            get_response = requests.get(f"{API_URL}/users/{user_id}")
            get_user_success = get_response.status_code == 200
            log_test(
                "Get User by ID", 
                get_user_success,
                response=get_response
            )
            
            if not get_user_success:
                print(f"Failed to get user with ID: {user_id}")
                # Try to list all users to see what's available
                try:
                    all_users = requests.get(f"{API_URL}/users")
                    if all_users.status_code == 200:
                        print(f"Available users: {json.dumps(all_users.json(), indent=2)}")
                except Exception as e:
                    print(f"Error listing users: {str(e)}")
            
            # Update user
            update_data = {
                "name": f"Updated {user_data['name']}",
                "grade": "12"
            }
            update_response = requests.put(f"{API_URL}/users/{user_id}", json=update_data)
            update_success = update_response.status_code == 200
            log_test(
                "Update User", 
                update_success,
                response=update_response
            )
            
            return user_id
    except Exception as e:
        log_test("User Management", False, f"Exception: {str(e)}")
    
    return None

def test_lesson_management(user_id):
    """Test lesson management endpoints"""
    print("\n🔍 Testing Lesson Management")
    
    # Get all lessons
    try:
        response = requests.get(f"{API_URL}/lessons")
        lessons_fetched = response.status_code == 200 and isinstance(response.json(), list)
        log_test("Get All Lessons", lessons_fetched, response=response)
        
        if lessons_fetched and len(response.json()) > 0:
            lesson_id = response.json()[0]["id"]
            
            # Get specific lesson
            lesson_response = requests.get(f"{API_URL}/lessons/{lesson_id}")
            log_test(
                "Get Specific Lesson", 
                lesson_response.status_code == 200 and lesson_response.json()["id"] == lesson_id,
                response=lesson_response
            )
            
            if user_id:
                # Update lesson progress
                progress_data = {"progress": 75}
                progress_response = requests.post(
                    f"{API_URL}/users/{user_id}/lessons/{lesson_id}/progress", 
                    params=progress_data
                )
                log_test(
                    "Update Lesson Progress", 
                    progress_response.status_code == 200,
                    response=progress_response
                )
                
                # Get user lesson progress
                user_progress_response = requests.get(f"{API_URL}/users/{user_id}/lessons/progress")
                log_test(
                    "Get User Lesson Progress", 
                    user_progress_response.status_code == 200,
                    response=user_progress_response
                )
            
            return lesson_id
    except Exception as e:
        log_test("Lesson Management", False, f"Exception: {str(e)}")
    
    return None

def test_simulation_system(user_id):
    """Test simulation system endpoints"""
    print("\n🔍 Testing Simulation System")
    
    # Get all simulations
    try:
        response = requests.get(f"{API_URL}/simulations")
        simulations_fetched = response.status_code == 200 and isinstance(response.json(), list)
        log_test("Get All Simulations", simulations_fetched, response=response)
        
        if simulations_fetched and len(response.json()) > 0:
            simulation_id = response.json()[0]["id"]
            
            # Get specific simulation
            sim_response = requests.get(f"{API_URL}/simulations/{simulation_id}")
            log_test(
                "Get Specific Simulation", 
                sim_response.status_code == 200 and sim_response.json()["id"] == simulation_id,
                response=sim_response
            )
            
            if user_id:
                # Start user simulation
                start_sim_response = requests.post(f"{API_URL}/users/{user_id}/simulations/{simulation_id}/start")
                log_test(
                    "Start User Simulation", 
                    start_sim_response.status_code == 200,
                    response=start_sim_response
                )
                
                # Get user simulations
                user_sims_response = requests.get(f"{API_URL}/users/{user_id}/simulations")
                log_test(
                    "Get User Simulations", 
                    user_sims_response.status_code == 200,
                    response=user_sims_response
                )
            
            return simulation_id
    except Exception as e:
        log_test("Simulation System", False, f"Exception: {str(e)}")
    
    return None

def test_ethical_scenarios(user_id):
    """Test ethical scenarios endpoints"""
    print("\n🔍 Testing Ethical Scenarios")
    
    # Get all ethical scenarios
    try:
        response = requests.get(f"{API_URL}/ethics/scenarios")
        scenarios_fetched = response.status_code == 200 and isinstance(response.json(), list)
        log_test("Get All Ethical Scenarios", scenarios_fetched, response=response)
        
        if scenarios_fetched and len(response.json()) > 0:
            scenario_id = response.json()[0]["id"]
            
            # Get specific scenario
            scenario_response = requests.get(f"{API_URL}/ethics/scenarios/{scenario_id}")
            log_test(
                "Get Specific Ethical Scenario", 
                scenario_response.status_code == 200 and scenario_response.json()["id"] == scenario_id,
                response=scenario_response
            )
            
            if user_id:
                # Submit ethical decision
                decision_data = {
                    "selected_option": "a",
                    "reasoning": "I believe this option balances the need for adaptation with ethical considerations."
                }
                decision_response = requests.post(
                    f"{API_URL}/users/{user_id}/ethics/{scenario_id}/decision", 
                    params=decision_data
                )
                log_test(
                    "Submit Ethical Decision", 
                    decision_response.status_code == 200,
                    response=decision_response
                )
                
                # Get user ethical decisions
                user_decisions_response = requests.get(f"{API_URL}/users/{user_id}/ethics/decisions")
                log_test(
                    "Get User Ethical Decisions", 
                    user_decisions_response.status_code == 200,
                    response=user_decisions_response
                )
            
            return scenario_id
    except Exception as e:
        log_test("Ethical Scenarios", False, f"Exception: {str(e)}")
    
    return None

def test_chatgpt_integration(user_id):
    """Test ChatGPT-4o AI integration"""
    print("\n🔍 Testing ChatGPT-4o AI Integration")
    
    if not user_id:
        log_test("ChatGPT-4o Integration", False, "No user ID available for testing")
        return None
    
    # Create a chat session
    try:
        chat_data = {
            "user_id": user_id,
            "message": "What is CRISPR and how can it help with climate change adaptation?"
        }
        
        response = requests.post(f"{API_URL}/chat/sessions", json=chat_data)
        session_created = (
            response.status_code == 200 and 
            "session_id" in response.json() and 
            "ai_response" in response.json()
        )
        
        log_test("Create Chat Session", session_created, response=response)
        
        if session_created:
            session_id = response.json()["session_id"]
            
            # Check if AI actually generated a meaningful response
            ai_response = response.json()["ai_response"]["message"]
            ai_response_quality = len(ai_response) > 100  # Basic check for a substantial response
            
            log_test(
                "AI Response Quality", 
                ai_response_quality,
                f"Response length: {len(ai_response)} characters"
            )
            
            # Test conversation continuity
            follow_up_data = {
                "user_id": user_id,
                "message": "Can you explain more about gene editing ethics?"
            }
            
            follow_up_response = requests.post(
                f"{API_URL}/chat/sessions/{session_id}/message", 
                params=follow_up_data
            )
            
            follow_up_success = (
                follow_up_response.status_code == 200 and 
                "ai_response" in follow_up_response.json()
            )
            
            log_test("Chat Conversation Continuity", follow_up_success, response=follow_up_response)
            
            # Get chat history
            history_response = requests.get(f"{API_URL}/chat/sessions/{session_id}/messages")
            log_test(
                "Get Chat History", 
                history_response.status_code == 200 and isinstance(history_response.json(), list),
                response=history_response
            )
            
            return session_id
    except Exception as e:
        log_test("ChatGPT-4o Integration", False, f"Exception: {str(e)}")
    
    return None

def test_project_management(user_id):
    """Test project management endpoints"""
    print("\n🔍 Testing Project Management")
    
    if not user_id:
        log_test("Project Management", False, "No user ID available for testing")
        return None
    
    # Create a project
    try:
        project_data = {
            "title": "Climate-Resistant Crop Analysis",
            "description": "A research project on developing drought-resistant wheat varieties",
            "type": "Report",
            "content": {
                "sections": [
                    {"title": "Introduction", "content": "Overview of climate challenges"},
                    {"title": "Methods", "content": "CRISPR techniques used"}
                ]
            }
        }
        
        response = requests.post(f"{API_URL}/users/{user_id}/projects", json=project_data)
        project_created = response.status_code == 200 and "id" in response.json()
        log_test("Create Project", project_created, response=response)
        
        if project_created:
            project_id = response.json()["id"]
            
            # Update project
            update_data = {
                "title": "Updated: Climate-Resistant Crop Analysis",
                "status": "In Progress"
            }
            
            update_response = requests.put(f"{API_URL}/projects/{project_id}", json=update_data)
            log_test(
                "Update Project", 
                update_response.status_code == 200,
                response=update_response
            )
            
            # Get user projects
            projects_response = requests.get(f"{API_URL}/users/{user_id}/projects")
            log_test(
                "Get User Projects", 
                projects_response.status_code == 200 and isinstance(projects_response.json(), list),
                response=projects_response
            )
            
            return project_id
    except Exception as e:
        log_test("Project Management", False, f"Exception: {str(e)}")
    
    return None

def test_analytics(user_id):
    """Test analytics endpoints"""
    print("\n🔍 Testing Analytics & User Data API")
    
    if not user_id:
        log_test("Analytics API", False, "No user ID available for testing")
        return
    
    try:
        response = requests.get(f"{API_URL}/users/{user_id}/analytics")
        analytics_success = response.status_code == 200
        log_test("Get User Analytics", analytics_success, response=response)
    except Exception as e:
        log_test("Analytics API", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 80)
    print(f"TEST SUMMARY: {test_results['passed']} passed, {test_results['failed']} failed")
    print("=" * 80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for test in test_results["tests"]:
            if not test["passed"]:
                print(f"- {test['name']}: {test['message']}")
    
    print("\nTEST COMPLETION TIME:", time.strftime("%Y-%m-%d %H:%M:%S"))
    print("=" * 80)

def run_all_tests():
    """Run all tests in sequence"""
    print("\n" + "=" * 80)
    print("STARTING BACKEND API TESTS")
    print("=" * 80)
    
    # Basic API health
    test_api_health()
    
    # User management (returns user_id for subsequent tests)
    user_id = test_user_management()
    
    # Core educational features
    lesson_id = test_lesson_management(user_id)
    simulation_id = test_simulation_system(user_id)
    scenario_id = test_ethical_scenarios(user_id)
    
    # Critical AI integration
    session_id = test_chatgpt_integration(user_id)
    
    # Additional features
    project_id = test_project_management(user_id)
    test_analytics(user_id)
    
    # Print summary
    print_summary()
    
    return test_results

if __name__ == "__main__":
    run_all_tests()
