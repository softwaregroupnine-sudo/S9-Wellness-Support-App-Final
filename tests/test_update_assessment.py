
import requests

BASE_URL = "http://127.0.0.1:5000"

participant_id = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"
assessment_id = 1

updated_assessment = {
    "participant_id": participant_id,
    "text_input": (
        "I am feeling more organised about my university assignments. "
        "I am trying to manage my time and take regular breaks."
    )
}

try:
    response = requests.put(
        f"{BASE_URL}/assessments/{assessment_id}",
        json=updated_assessment,
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
