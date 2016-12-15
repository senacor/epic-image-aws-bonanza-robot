import RPi.GPIO as GPIO
from picamera import PiCamera
import uuid
import boto3
import json
import paho.mqtt.client as mqtt


FORWARD = "forward"
BACKWARD = "backward"
LEFT = "left"
RIGHT = "right"
STOP = "stop"
CLICK = "click"

WHEEL_RIGHT_1 = 6
WHEEL_RIGHT_2 = 13

WHEEL_LEFT_1 = 19
WHEEL_LEFT_2 = 26

camera = PiCamera()
s3 = boto3.resource("s3", config= boto3.session.Config(signature_version='s3v4'))


def forward():
    print("Moving forward")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, True)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, True)


def backward():
    print("Moving backward")
    GPIO.output(WHEEL_RIGHT_1, True)
    GPIO.output(WHEEL_RIGHT_2, False)
    GPIO.output(WHEEL_LEFT_1, True)
    GPIO.output(WHEEL_LEFT_2, False)


def left():
    print("Moving backward")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, True)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, False)


def right():
    print("Moving backward")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, False)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, True)


def stop():
    print("Stop moving")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, False)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, False)


def captureImage():
        print("Capture image")
        strUuid = str(uuid.uuid4())
        camera.capture("image.jpg")
        data = open("image.jpg", "rb")
        print("Tranfer image to S3")
        s3.Bucket("com.senacor.tecco.insanerobot").put_object(Key="test/"+strUuid, Body=data)
        print(("Send MQTT notification for image " + strUuid))
        client.publish("robot/camera", json.JSONEncoder().encode({"image": strUuid}))


def on_connect(client, userdata, flags, rc):
    print(("Connected with result code " + str(rc)))
    client.subscribe("robot/#")


def on_message(client, userdata, msg):
    command = str(msg.payload.decode("utf-8"))
    print((msg.topic + " " + command))

    if command == FORWARD:
        forward()
    if command == BACKWARD:
        backward()
    if command == LEFT:
        left()
    if command == RIGHT:
        right()
    elif command == STOP:
        stop()
    elif command == CLICK:
        captureImage()


def on_publish(client, userdata, mid):
    print((str(client) + " " + str(mid)))


try:
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(WHEEL_RIGHT_1, GPIO.OUT)
    GPIO.setup(WHEEL_RIGHT_2, GPIO.OUT)
    GPIO.setup(WHEEL_LEFT_1, GPIO.OUT)
    GPIO.setup(WHEEL_LEFT_2, GPIO.OUT)

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.connect("10.22.0.204", 1883, 60)

    client.loop_forever()


finally:
    GPIO.cleanup()
