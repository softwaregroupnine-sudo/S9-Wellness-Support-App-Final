import requests

BASE_URL = "http://127.0.0.1:5000"
PARTICIPANT_ID = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"

try:
    response = requests.get(
        f"{BASE_URL}/checkins",
        params={"participant_id": PARTICIPANT_ID},
        timeout=10
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")