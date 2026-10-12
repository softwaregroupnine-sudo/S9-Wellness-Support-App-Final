
import requests

BASE_URL = "http://127.0.0.1:5000"

# A participant ID that should not belong to an existing user
fake_participant_id = "00000000-0000-4000-8000-000000000000"

try:
    response = requests.get(
        f"{BASE_URL}/checkins",
        params={"participant_id": fake_participant_id},
        timeout=30
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

    if response.status_code in (400, 401, 403, 404):
        print("PASS: Unknown participant was rejected.")
    elif response.status_code == 200 and response.json() == []:
        print(
            "LIMITED RESULT: No records were returned, "
            "but this does not prove access control is secure."
        )
    else:
        print(
            "CHECK: Review whether the endpoint validates "
            "the participant before returning data."
        )

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
