import face_recognition
import os

def load_known_faces(known_faces_dir):
    known_encodings = []
    known_ids = []

    for file in os.listdir(known_faces_dir):
        if file.endswith(".jpg") or file.endswith(".png"):
            student_id = file.split(".")[0]
            image_path = os.path.join(known_faces_dir, file)

            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if encodings:
                known_encodings.append(encodings[0])
                known_ids.append(student_id)

    return known_encodings, known_ids