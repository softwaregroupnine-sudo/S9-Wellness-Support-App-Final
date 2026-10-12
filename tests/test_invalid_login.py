
import requests

BASE_URL = "http://127.0.0.1:5000"

login_data = {
    "email": "eduv5451861@vossie.com",
    "password": "DefinitelyWrongPassword123!"
}

try:
    response = requests.post(
        f"{BASE_URL}/login",
        json=login_data,
        timeout=30
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

    if response.status_code in (400, 401):
        print("PASS: Invalid login was rejected.")
    else:
        print("CHECK: Unexpected status for invalid login.")

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
