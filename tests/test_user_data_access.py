
import requests

BASE_URL = "http://127.0.0.1:5000"

fake_participant_id = "00000000-0000-4000-8000-000000000000"


def test_user_data_access():
    try:
        missing_id_response = requests.get(
            f"{BASE_URL}/checkins",
            timeout=30
        )

        assert missing_id_response.status_code == 400, (
            f"Expected status 400, got {missing_id_response.status_code}"
        )

        unknown_id_response = requests.get(
            f"{BASE_URL}/checkins",
            params={"participant_id": fake_participant_id},
            timeout=30
        )

        assert unknown_id_response.status_code == 404, (
            f"Expected status 404, got {unknown_id_response.status_code}"
        )

        print("PASSED: Check-in access validation is working.")
        print("Missing participant ID:", missing_id_response.status_code)
        print("Unknown participant ID:", unknown_id_response.status_code)

    except requests.exceptions.RequestException as error:
        print("FAILED: Could not complete access validation test.")
        print(error)


if __name__ == "__main__":
    test_user_data_access()
