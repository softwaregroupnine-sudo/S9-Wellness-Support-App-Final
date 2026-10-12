
import requests

BASE_URL = "http://127.0.0.1:5000"
resource_id = 1

try:
    response = requests.get(
        f"{BASE_URL}/resources/{resource_id}",
        timeout=30
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
