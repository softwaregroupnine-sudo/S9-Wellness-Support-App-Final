
import requests

BASE_URL = "http://127.0.0.1:5000"

checkin = {
    "participant_id": "5d456291-50f2-4a3e-a6df-c0d9ae057eb4",
    "mood_value": "Good",
    "feelings": ["Calm", "Motivated"],
    "note": "Testing the mood check-in feature."
}

try:
    response = requests.post(
        f"{BASE_URL}/checkins",
        json=checkin,
        timeout=10
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")
