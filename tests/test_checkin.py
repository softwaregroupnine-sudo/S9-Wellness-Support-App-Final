
import requests

BASE_URL = "http://127.0.0.1:5000"

checkin = {
    "participant_id": "5d456291-50f2-4a3e-a6df-c0d9ae057eb4",
    "mood_value": "Good",
    "feelings": ["Calm", "Motivated"],
    "note": "Testing the mood check-in feature."
}


def test_checkin():
    try:
        response = requests.post(
            f"{BASE_URL}/checkins",
            json=checkin,
            timeout=10
        )

        assert response.status_code in (200, 201), (
            f"Expected status 200 or 201, got {response.status_code}"
        )

        data = response.json()

        assert isinstance(data, dict), "Expected a JSON response"
        assert data, "Expected a non-empty response"

        print("PASSED: Mood check-in was saved successfully.")
        print("Status:", response.status_code)
        print("Response:", data)

    except requests.exceptions.RequestException as error:
        print("FAILED: Could not complete check-in test.")
        print(error)


if __name__ == "__main__":
    test_checkin()
