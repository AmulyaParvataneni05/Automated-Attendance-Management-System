import requests

from config import MARK_ATTENDANCE_API

def send_attendance(student_mongo_id, token):
    payload = {
        "student": student_mongo_id,
        "status": "present"
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(MARK_ATTENDANCE_API, json=payload, headers=headers)
        response.raise_for_status()
        try:
            return response.json()
        except ValueError:
            #print("Warning: Response not JSON:", response.text)
            return {"status": "unknown"}
    except requests.exceptions.RequestException as e:
        print("Error sending attendance:", e)
        return {"status": "failed"}
