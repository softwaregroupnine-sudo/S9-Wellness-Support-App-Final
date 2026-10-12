
import requests

BASE_URL = "http://127.0.0.1:5000"

participant_id = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"

try:
    # Retrieve the existing check-ins
    response = requests.get(
        f"{BASE_URL}/checkins",
        params={"participant_id": participant_id},
        timeout=30
    )

    print("Retrieve status:", response.status_code)

    if response.status_code != 200:
        print("Could not retrieve check-ins:", response.text)

    elif not response.json():
        print("No check-in found to update.")

    else:
        # Get the ID of the first check-in
        checkin_id = response.json()[0]["id"]

        # Data for updating the check-in
        updated_checkin = {
            "participant_id": participant_id,
            "mood_value": "Amazing",
            "feelings": ["Happy", "Motivated"],
            "note": "Testing the mood update feature."
        }

        # Send the update request
        response = requests.put(
            f"{BASE_URL}/checkins/{checkin_id}",
            json=updated_checkin,
            timeout=30
        )

        print("Update status:", response.status_code)
        print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
