
import requests

BASE_URL = "http://127.0.0.1:5000"

login_data = {
    "email": "mario@gmail.com",
    "password": "DefinitelyWrongPassword123!"
}


def test_invalid_login():
    try:
        response = requests.post(
            f"{BASE_URL}/login",
            json=login_data,
            timeout=30
        )

        assert response.status_code in (400, 401), (
            f"Expected status 400 or 401, got {response.status_code}"
        )

        print("PASSED: Invalid login was rejected.")
        print("Status:", response.status_code)
        print("Response:", response.text)

    except requests.exceptions.RequestException as error:
        print("FAILED: Could not complete invalid login test.")
        print(error)


if __name__ == "__main__":
    test_invalid_login()
