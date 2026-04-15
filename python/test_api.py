from utils.api_client import send_attendance

# Dummy test
student_ids = ["20CS001"]
lecture_id = "LECT001"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjNlNTQ3Mjk5YmZhMDRkYjEzNTJjMCIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzY4MzAwMDIxLCJleHAiOjE3NjgzODY0MjF9.9S7gUJ_blX2ooQuMFRTs8IZxd4cW1m77CcIwN7v0T0A"

response = send_attendance(student_ids,token)
#print(response)