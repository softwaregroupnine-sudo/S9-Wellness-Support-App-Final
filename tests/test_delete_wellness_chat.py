
import requests

BASE_URL = "http://127.0.0.1:5000"

participant_id = "5d456291-50f2-4a3e-a6df-c0d9ae057eb4"
wellness_chat_id = 1

try:
    response = requests.delete(
        f"{BASE_URL}/wellness-chats/{wellness_chat_id}",
        params={"participant_id": participant_id},
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
