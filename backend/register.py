
import requests

BASE_URL = "http://127.0.0.1:5000"

participants = [
    {"email": "eduv5911849@vossie.com", "password": "password123", "display_name": "Thabang"},
    {"email": "eduv5451861@vossie.com", "password": "password123", "display_name": "Genildo"},
    {"email": "eduv4911856@vossie.com", "password": "password123", "display_name": "Rori"},
]

for p in participants:
    try:
        response = requests.post(
            f"{BASE_URL}/register",
            json=p,
            timeout=10
        )

    except requests.exceptions.ConnectionError:
        print("Could not connect. Check if app.py is running.")
        break

    except requests.exceptions.Timeout:
        print("Request timed out.")
        continue

    if response.status_code == 201:
        data = response.json()
        print("Registered successfully.")
        print(f"Email: {data['email']}")
        print(f"Participant ID: {data['participant_id']}")

    elif response.status_code == 409:
        print(f"Account with {p['email']} already exists.")

    else:
        print(f"Failed: {response.status_code} {response.text}")
