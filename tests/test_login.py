
import requests

BASE_URL = "http://127.0.0.1:5000"

user = {
    "email": "eduv5451861@vossie.com",
    "password": "password123"
}

try:
    response = requests.post(
        f"{BASE_URL}/login",
        json=user,
        timeout=10
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")
