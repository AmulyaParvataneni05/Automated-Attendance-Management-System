import cv2
import sys
import requests
import signal
import json
from config import CAMERA_INDEX, KNOWN_FACES_DIR
from utils.face_loader import load_known_faces
from utils.recognizer import recognize_faces
from utils.api_client import send_attendance

# if len(sys.argv) < 2:
#     print("Lecture ID not provided")
#     exit()

LECTURE_ID = "Factulty1"
print("LectureID : ",LECTURE_ID)
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDJhZmQxNDZhMWJhYTJmZDBiOWE4MiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzc1NTU0OTQwLCJleHAiOjE3NzU2NDEzNDB9.VvSJToGIbBiAW5k_vaysr8Plf_w_XdXD8QTJr_yXu0Q"
import signal

running = True

def stop_handler(sig, frame):
    global running
    print("Stopping camera...")
    running = False

signal.signal(signal.SIGINT, stop_handler)

print("Loading known faces...")
known_encodings, known_ids = load_known_faces(KNOWN_FACES_DIR)

print("Starting camera...")
cap = cv2.VideoCapture(CAMERA_INDEX)

marked_students = set()

with open("students_map.json") as f:
    STUDENT_MAP = json.load(f)

API_URL = "http://localhost:5000/api/attendance/mark-bulk"

try:
    while running:
        ret, frame = cap.read()
        if not ret:
            break

        recognized = recognize_faces(frame, known_encodings, known_ids)
        print("Recognized in frame:", recognized)

        for student_id in recognized:
            marked_students.add(student_id)

        cv2.imshow("Smart Attendance", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            break
finally:
    print("FINAL_OUTPUT:", json.dumps(list(marked_students)), flush=True)
    cap.release()
    cv2.destroyAllWindows()

# 🔥 SEND FINAL OUTPUT TO NODE
#print("FINAL_OUTPUT:", json.dumps(list(marked_students)), flush=True)
# cap.release()
# cv2.destroyAllWindows()


# import cv2
# import sys
# import json
# from config import CAMERA_INDEX, KNOWN_FACES_DIR
# from utils.face_loader import load_known_faces
# from utils.recognizer import recognize_faces
# from utils.api_client import send_attendance

# # if len(sys.argv) < 2:
# #     print("Lecture ID not provided")
# #     exit()

# LECTURE_ID = "Factulty1"
# print("LectureID : ",LECTURE_ID)
# JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDJhZmQxNDZhMWJhYTJmZDBiOWE4MiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzc1NTU0OTQwLCJleHAiOjE3NzU2NDEzNDB9.VvSJToGIbBiAW5k_vaysr8Plf_w_XdXD8QTJr_yXu0Q"

# print("Loading known faces...")
# known_encodings, known_ids = load_known_faces(KNOWN_FACES_DIR)

# print("Starting camera...")
# cap = cv2.VideoCapture(CAMERA_INDEX)

# marked_students = set()

# with open("students_map.json") as f:
#     STUDENT_MAP = json.load(f)

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     recognized = set(recognize_faces(frame, known_encodings, known_ids))

#     # Instead of sending a list, send one student at a time
#     for student_id in recognized:
#         if student_id not in marked_students:
#             print(f"Recognized: {student_id}")
#             marked_students.add(student_id)
#             mongo_id = STUDENT_MAP.get(student_id)
#             result = send_attendance(mongo_id, JWT_TOKEN)
#             #print("Attendance response:", result)

#     cv2.imshow("Smart Attendance", frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()
