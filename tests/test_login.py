
import requests

BASE_URL = "http://127.0.0.1:5000"

user = {
    "email": "mario@gmail.com",
    "password": "Mario1234"
}


def test_login():
    try:
        response = requests.post(
            f"{BASE_URL}/login",
            json=user,
            timeout=10
        )

        assert response.status_code == 200, (
            f"Expected status 200, got {response.status_code}"
        )

        data = response.json()

        assert isinstance(data, dict), "Expected a JSON response"
        assert data, "Expected login response data"

        print("PASSED: Login test successful.")
        print("Response:", data)

    except requests.exceptions.RequestException as error:
        print("FAILED: Could not complete login test.")
        print(error)


if __name__ == "__main__":
    test_login()
