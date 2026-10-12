
import requests

BASE_URL = "http://127.0.0.1:5000"

resource = {
    "title": "Managing Exam Stress",
    "description": "Practical ways to manage stress during exam preparation.",
    "category": "Stress Management",
    "content": "Create a realistic study schedule, take regular breaks, stay hydrated, and get enough sleep."
}

try:
    response = requests.post(
        f"{BASE_URL}/resources",
        json=resource,
        timeout=30
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
