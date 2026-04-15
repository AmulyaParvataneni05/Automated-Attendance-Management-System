import cv2
from utils.face_loader import load_known_faces
from utils.recognizer import recognize_faces
from config import KNOWN_FACES_DIR, CAMERA_INDEX

print("Loading known faces...")
known_encodings, known_ids = load_known_faces(KNOWN_FACES_DIR)

cap = cv2.VideoCapture(CAMERA_INDEX)
print("Starting camera... Press 'q' to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    recognized = recognize_faces(frame, known_encodings, known_ids)
    for student_id in recognized:
        print("Recognized:", student_id)

    cv2.imshow("Test Camera", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
