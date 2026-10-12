
import requests

BASE_URL = "http://127.0.0.1:5000"

# Intentionally omit required registration fields
registration_data = {
    "email": "incomplete_test@example.com"
}

try:
    response = requests.post(
        f"{BASE_URL}/register",
        json=registration_data,
        timeout=30
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

    if response.status_code in (400, 422):
        print("PASS: Missing required fields were rejected.")
    else:
        print("CHECK: Review how the API handles incomplete registration.")

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
