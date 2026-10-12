
import requests

BASE_URL = "http://127.0.0.1:5000"

chat = {
    "participant_id": "5d456291-50f2-4a3e-a6df-c0d9ae057eb4",
    "question_text": (
        "What are some practical ways to manage stress "
        "during exam preparation?"
    )
}

try:
    response = requests.post(
        f"{BASE_URL}/wellness-chats",
        json=chat,
        timeout=90
    )

    print("Status:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.ConnectionError:
    print("Could not connect. Check if app.py is running.")

except requests.exceptions.Timeout:
    print("Request timed out. The AI may be taking too long.")
