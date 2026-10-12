
import requests

BASE_URL = "http://127.0.0.1:5000"

assessment = {
    "participant_id": "5d456291-50f2-4a3e-a6df-c0d9ae057eb4",
    "text_input": (
        "I have been feeling stressed about my university assignments. "
        "I am struggling to manage my time, but I want to improve."
    )
}

try:
    response = requests.post(
        f"{BASE_URL}/assessments",
        json=assessment,
        timeout=90
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out. The AI may be taking too long.")
