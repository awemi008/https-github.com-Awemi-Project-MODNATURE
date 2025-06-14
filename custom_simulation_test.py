#!/usr/bin/env python3
import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from frontend/.env
frontend_env_path = Path('/app/frontend/.env')
load_dotenv(frontend_env_path)

# Get the backend URL from the environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"

print(f"Testing custom simulation endpoints at: {API_URL}")

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

def test_climate_conditions_endpoint():
    """Test GET /api/simulations/options/climate-conditions endpoint"""
    print("\n🔍 Testing Climate Conditions Options Endpoint")
    
    try:
        response = requests.get(f"{API_URL}/simulations/options/climate-conditions")
        success = (
            response.status_code == 200 and 
            isinstance(response.json(), list) and
            len(response.json()) > 0
        )
        
        # Verify structure of returned data
        if success and len(response.json()) > 0:
            first_item = response.json()[0]
            has_required_fields = all(field in first_item for field in ["type", "name", "description", "severity_options"])
            
            if not has_required_fields:
                success = False
                message = "Response missing required fields"
            else:
                message = f"Found {len(response.json())} climate conditions with proper structure"
        else:
            message = "Response is empty or not properly formatted"
            
        log_test("Climate Conditions Options", success, message, response)
        return success
    except Exception as e:
        log_test("Climate Conditions Options", False, f"Exception: {str(e)}")
        return False

def test_population_traits_endpoint():
    """Test GET /api/simulations/options/population-traits endpoint"""
    print("\n🔍 Testing Population Traits Options Endpoint")
    
    try:
        response = requests.get(f"{API_URL}/simulations/options/population-traits")
        success = (
            response.status_code == 200 and 
            isinstance(response.json(), list) and
            len(response.json()) > 0
        )
        
        # Verify structure of returned data
        if success and len(response.json()) > 0:
            first_item = response.json()[0]
            has_required_fields = all(field in first_item for field in ["trait_name", "name", "description", "severity_options"])
            
            if not has_required_fields:
                success = False
                message = "Response missing required fields"
            else:
                message = f"Found {len(response.json())} population traits with proper structure"
        else:
            message = "Response is empty or not properly formatted"
            
        log_test("Population Traits Options", success, message, response)
        return success
    except Exception as e:
        log_test("Population Traits Options", False, f"Exception: {str(e)}")
        return False

def test_gene_editing_strategies_endpoint():
    """Test GET /api/simulations/options/gene-editing-strategies endpoint"""
    print("\n🔍 Testing Gene Editing Strategies Options Endpoint")
    
    try:
        response = requests.get(f"{API_URL}/simulations/options/gene-editing-strategies")
        success = (
            response.status_code == 200 and 
            isinstance(response.json(), list) and
            len(response.json()) > 0
        )
        
        # Verify structure of returned data
        if success and len(response.json()) > 0:
            first_item = response.json()[0]
            has_required_fields = all(field in first_item for field in ["strategy_type", "name", "description", "approaches"])
            
            if not has_required_fields:
                success = False
                message = "Response missing required fields"
            else:
                message = f"Found {len(response.json())} gene editing strategies with proper structure"
        else:
            message = "Response is empty or not properly formatted"
            
        log_test("Gene Editing Strategies Options", success, message, response)
        return success
    except Exception as e:
        log_test("Gene Editing Strategies Options", False, f"Exception: {str(e)}")
        return False

def test_run_custom_simulation():
    """Test POST /api/simulations/run-custom endpoint"""
    print("\n🔍 Testing Run Custom Simulation Endpoint")
    
    # Prepare test data as specified in the requirements
    # The API expects these as query parameters, not JSON body
    query_params = {
        "user_id": "test-user-123",
        "simulation_name": "Test Drought Adaptation",
        "organism": "Wheat"
    }
    
    # Complex parameters need to be sent as JSON in the body
    json_data = {
        "climate_condition": {
            "type": "drought", 
            "severity": "moderate", 
            "duration": "long", 
            "description": "Extended drought conditions"
        },
        "population_traits": [
            {
                "trait_name": "low_immunity", 
                "severity": "mild", 
                "affected_percentage": 30.0, 
                "description": "Slightly weakened immune system"
            }
        ],
        "gene_editing_strategies": [
            {
                "strategy_type": "CRISPR", 
                "target_genes": ["DREB2", "ABA1"], 
                "approach": "enhancement", 
                "success_rate": 85.0, 
                "description": "CRISPR enhancement of drought resistance genes"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{API_URL}/simulations/run-custom", 
            params=query_params,
            json=json_data
        )
        success = response.status_code == 200
        
        # Verify structure of returned data
        if success:
            result = response.json()
            has_required_fields = all(field in result for field in ["simulation_id", "user_simulation_id", "results"])
            
            # Check if results contain the expected fields
            if has_required_fields:
                results = result["results"]
                has_result_fields = all(field in results for field in [
                    "adaptation_successful", 
                    "survival_rate", 
                    "resistance_level", 
                    "population_health", 
                    "environmental_impact", 
                    "detailed_results"
                ])
                
                # Check if detailed results contain recommendations
                if has_result_fields and "detailed_results" in results:
                    detailed_results = results["detailed_results"]
                    has_recommendations = "recommendations" in detailed_results
                    
                    if not has_recommendations:
                        success = False
                        message = "Detailed results missing recommendations"
                    else:
                        message = "Custom simulation ran successfully with complete results and recommendations"
                else:
                    success = False
                    message = "Results missing required fields"
            else:
                success = False
                message = "Response missing required fields"
        else:
            message = f"Failed to run custom simulation: {response.text}"
            
        log_test("Run Custom Simulation", success, message, response)
        return success
    except Exception as e:
        log_test("Run Custom Simulation", False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 80)
    print(f"CUSTOM SIMULATION TEST SUMMARY: {test_results['passed']} passed, {test_results['failed']} failed")
    print("=" * 80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for test in test_results["tests"]:
            if not test["passed"]:
                print(f"- {test['name']}: {test['message']}")
    
    print("=" * 80)

def run_all_tests():
    """Run all custom simulation tests in sequence"""
    print("\n" + "=" * 80)
    print("STARTING CUSTOM SIMULATION API TESTS")
    print("=" * 80)
    
    # Test all required endpoints
    test_climate_conditions_endpoint()
    test_population_traits_endpoint()
    test_gene_editing_strategies_endpoint()
    test_run_custom_simulation()
    
    # Print summary
    print_summary()
    
    return test_results

if __name__ == "__main__":
    run_all_tests()