import face_recognition
import cv2

def recognize_faces(frame, known_encodings, known_ids):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    locations = face_recognition.face_locations(rgb_frame)
    encodings = face_recognition.face_encodings(rgb_frame, locations)

    recognized_students = []

    for encoding in encodings:
        matches = face_recognition.compare_faces(
            known_encodings, encoding, tolerance=0.5
        )

        if True in matches:
            index = matches.index(True)
            recognized_students.append(known_ids[index])

    return recognized_students