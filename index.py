import time
import serial
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('./load-monitoring-system-d1a16-8988c5368cb2.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

ser = serial.Serial('COM6', 115200, timeout=10)
while True:
    line = ser.readline().decode("utf-8").strip().split(",")
    print(line)
    if len(line) == 7:
        id = line[0]
        datas = {
            'time': time.time(),
            'voltage': float(line[1]),
            'current': float(line[2]),
            'power': float(line[3]),
            'energy': float(line[4]),
            'frequency': float(line[5]),
            'pf': float(line[6]),
        }

        db.collection('data' + id).add(datas)

