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

print(f"Testing enhanced lesson content at: {API_URL}")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, message="", details=None):
    """Log test results and print to console"""
    status = "✅ PASSED" if passed else "❌ FAILED"
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "message": message,
        "details": details
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
    
    print(f"{status} - {name}")
    if message:
        print(f"  {message}")
    if details:
        print(f"  Details: {json.dumps(details, indent=2)[:500]}...")
    print("-" * 80)

def verify_lesson_content(lesson):
    """Verify that a lesson contains comprehensive educational content"""
    issues = []
    
    # Check for basic lesson structure
    if not lesson.get("title"):
        issues.append("Missing lesson title")
    if not lesson.get("description"):
        issues.append("Missing lesson description")
    
    # Check for comprehensive content
    content = lesson.get("content", {})
    
    # Check for overview and learning objectives
    if not content.get("overview"):
        issues.append("Missing lesson overview")
    
    learning_objectives = content.get("learning_objectives", [])
    if not learning_objectives or len(learning_objectives) < 3:
        issues.append(f"Insufficient learning objectives (found {len(learning_objectives)}, expected at least 3)")
    
    # Check for multiple content sections
    sections = content.get("sections", [])
    if not sections or len(sections) < 3:
        issues.append(f"Insufficient content sections (found {len(sections)}, expected at least 3)")
    
    # Check for different section types
    section_types = set()
    for section in sections:
        if "type" in section:
            section_types.add(section.get("type"))
    
    if len(section_types) < 2:
        issues.append(f"Insufficient variety of section types (found {len(section_types)}, expected at least 2)")
    
    # Check for quiz questions
    quiz = content.get("quiz", [])
    if not quiz or len(quiz) < 1:
        issues.append(f"Insufficient quiz questions (found {len(quiz)}, expected at least 1)")
    
    # Check for additional resources
    resources = content.get("additional_resources", [])
    if not resources or len(resources) < 1:
        issues.append(f"Insufficient additional resources (found {len(resources)}, expected at least 1)")
    
    return issues

def test_all_lessons():
    """Test that all lessons have comprehensive content"""
    print("\n🔍 Testing All Lessons")
    
    try:
        response = requests.get(f"{API_URL}/lessons")
        if response.status_code != 200:
            log_test("Get All Lessons", False, f"Failed with status code {response.status_code}")
            return
        
        lessons = response.json()
        if not lessons or len(lessons) < 5:
            log_test("Lesson Count", False, f"Expected at least 5 lessons, found {len(lessons)}")
            return
        
        log_test("Lesson Count", True, f"Found {len(lessons)} lessons")
        
        # Verify each lesson has comprehensive content
        for lesson in lessons:
            issues = verify_lesson_content(lesson)
            lesson_id = lesson.get("id")
            lesson_title = lesson.get("title")
            
            if issues:
                log_test(
                    f"Lesson Content: {lesson_title}", 
                    False, 
                    f"Found {len(issues)} issues with lesson {lesson_id}",
                    issues
                )
            else:
                log_test(
                    f"Lesson Content: {lesson_title}", 
                    True, 
                    f"Lesson {lesson_id} has comprehensive content"
                )
    
    except Exception as e:
        log_test("All Lessons Test", False, f"Exception: {str(e)}")

def test_specific_lesson(lesson_id, expected_title):
    """Test a specific lesson for comprehensive content"""
    print(f"\n🔍 Testing Specific Lesson: {expected_title} (ID: {lesson_id})")
    
    try:
        response = requests.get(f"{API_URL}/lessons/{lesson_id}")
        if response.status_code != 200:
            log_test(f"Get Lesson {lesson_id}", False, f"Failed with status code {response.status_code}")
            return
        
        lesson = response.json()
        actual_title = lesson.get("title")
        
        # Verify the lesson title matches what we expect
        title_match = actual_title == expected_title
        log_test(
            f"Lesson Title Match", 
            title_match, 
            f"Expected '{expected_title}', got '{actual_title}'"
        )
        
        # Verify comprehensive content
        issues = verify_lesson_content(lesson)
        if issues:
            log_test(
                f"Lesson Content: {actual_title}", 
                False, 
                f"Found {len(issues)} issues with lesson {lesson_id}",
                issues
            )
        else:
            # Analyze content in more detail
            content = lesson.get("content", {})
            sections = content.get("sections", [])
            section_types = [section.get("type") for section in sections if "type" in section]
            quiz_count = len(content.get("quiz", []))
            resources_count = len(content.get("additional_resources", []))
            
            details = {
                "overview_length": len(content.get("overview", "")),
                "learning_objectives": len(content.get("learning_objectives", [])),
                "sections": len(sections),
                "section_types": section_types,
                "quiz_questions": quiz_count,
                "additional_resources": resources_count
            }
            
            log_test(
                f"Lesson Content: {actual_title}", 
                True, 
                f"Lesson {lesson_id} has comprehensive content with {len(sections)} sections, {quiz_count} quiz questions, and {resources_count} resources",
                details
            )
    
    except Exception as e:
        log_test(f"Lesson {lesson_id} Test", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 80)
    print(f"LESSON CONTENT TEST SUMMARY: {test_results['passed']} passed, {test_results['failed']} failed")
    print("=" * 80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for test in test_results["tests"]:
            if not test["passed"]:
                print(f"- {test['name']}: {test['message']}")
                if test.get("details"):
                    for detail in test["details"]:
                        print(f"  * {detail}")
    
    print("=" * 80)

def run_tests():
    """Run all lesson content tests"""
    print("\n" + "=" * 80)
    print("TESTING ENHANCED LESSON SYSTEM WITH COMPREHENSIVE EDUCATIONAL CONTENT")
    print("=" * 80)
    
    # Test all lessons
    test_all_lessons()
    
    # Test specific lessons
    test_specific_lesson("1", "Introduction to Gene Editing")
    test_specific_lesson("2", "Climate Change & Genetic Adaptation")
    test_specific_lesson("3", "Drought-Resistant Crops")
    test_specific_lesson("5", "Ethical Considerations in Gene Editing")
    
    # Print summary
    print_summary()
    
    return test_results

if __name__ == "__main__":
    run_tests()