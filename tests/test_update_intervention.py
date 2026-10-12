
import requests

BASE_URL = "http://127.0.0.1:5000"

participant_id = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"
intervention_id = 1

updated_intervention = {
    "participant_id": participant_id,
    "recommendation_text": (
        "Try studying in focused 25-minute sessions, "
        "taking short breaks, and planning assignments ahead."
    ),
    "intervention_type": "general"
}

try:
    response = requests.put(
        f"{BASE_URL}/interventions/{intervention_id}",
        json=updated_intervention,
        params={"participant_id": participant_id},
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
