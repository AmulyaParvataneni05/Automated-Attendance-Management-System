from utils.face_loader import load_known_faces
from config import KNOWN_FACES_DIR

encodings, ids = load_known_faces(KNOWN_FACES_DIR)
print("Known student IDs loaded:", ids)
