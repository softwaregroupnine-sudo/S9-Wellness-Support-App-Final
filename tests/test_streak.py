
import requests

BASE_URL = "http://127.0.0.1:5000"

participant_id = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"


def test_streak_endpoint():
    try:
        response = requests.get(
            f"{BASE_URL}/checkins/streak",
            params={"participant_id": participant_id},
            timeout=30
        )

        assert response.status_code == 200, (
            f"Expected status 200, got {response.status_code}"
        )

        data = response.json()

        assert isinstance(data, dict), "Expected a JSON object"
        assert "current_streak" in data, "Missing current_streak"
        assert "participant_id" in data, "Missing participant_id"
        assert isinstance(data["current_streak"], int), (
            "Expected current_streak to be an integer"
        )
        assert data["current_streak"] >= 0, (
            "Streak cannot be negative"
        )
        assert data["participant_id"] == participant_id, (
            "Returned participant ID does not match"
        )

        print("PASSED: Streak endpoint is working.")
        print("Response:", data)

    except requests.exceptions.RequestException as error:
        print("FAILED: Could not connect to the backend.")
        print(error)


if __name__ == "__main__":
    test_streak_endpoint()
