import RPi.GPIO as GPIO
from picamera import PiCamera
import uuid
import boto3
import json
import paho.mqtt.client as mqtt
from time import time


FORWARD = "forward"
BACKWARD = "backward"
LEFT = "left"
RIGHT = "right"
STOP = "stop"
GEAR_1 = "1"
GEAR_2 = "2"
GEAR_3 = "3"
CLICK = "click"

GEAR_1_DUTYCYCLE = 50
GEAR_2_DUTYCYCLE = 70
GEAR_3_DUTYCYCLE = 100

WHEEL_LEFT_PWM = 2
WHEEL_RIGHT_PWM = 3

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
    print("Moving left")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, True)
    GPIO.output(WHEEL_LEFT_1, True)
    GPIO.output(WHEEL_LEFT_2, False)


def right():
    print("Moving right")
    GPIO.output(WHEEL_RIGHT_1, True)
    GPIO.output(WHEEL_RIGHT_2, False)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, True)


def stop():
    print("Stop moving")
    GPIO.output(WHEEL_RIGHT_1, False)
    GPIO.output(WHEEL_RIGHT_2, False)
    GPIO.output(WHEEL_LEFT_1, False)
    GPIO.output(WHEEL_LEFT_2, False)


def changeGear(dutyCycle):
        print(("Change dutycyle to " + str(dutyCycle)))
        rightPwm.ChangeDutyCycle(dutyCycle)
        leftPwm.ChangeDutyCycle(dutyCycle)


def captureImage():
        print("Capture image")
        s3FileName = str(time()) + "_" + str(uuid.uuid4())
        camera.capture("image.jpg")
        data = open("image.jpg", "rb")
        print("Tranfer image to S3")
        s3.Bucket("com.senacor.tecco.insanerobot").put_object(Key="test/"+s3FileName, Body=data)
        print(("Send MQTT notification for image " + s3FileName))
        client.publish("robot/camera", json.JSONEncoder().encode({"image": s3FileName}))


def on_connect(client, userdata, flags, rc):
    print(("Connected with result code " + str(rc)))
    client.subscribe("robot/#")


def on_message(client, userdata, msg):
    command = str(msg.payload.decode("utf-8"))
    topic = msg.topic
    print((topic + " " + command))

    if topic == "robot/drive":
        if command == FORWARD:
            forward()
        elif command == BACKWARD:
            backward()
        elif command == LEFT:
            left()
        elif command == RIGHT:
            right()
        elif command == STOP:
            stop()
        else:
            print(("Unhandled command " + command + " in topic " + topic))
    elif topic == "robot/gear":
        if command == GEAR_1:
            changeGear(GEAR_1_DUTYCYCLE)
        elif command == GEAR_2:
            changeGear(GEAR_2_DUTYCYCLE)
        elif command == GEAR_3:
            changeGear(GEAR_3_DUTYCYCLE)
        else:
            print(("Unhandled command " + command + " in topic " + topic))
    elif topic == "robot/camera":
        if command == CLICK:
            captureImage()
        else:
            print(("Unhandled command " + command + " in topic " + topic))
    else:
        print(("Unknown topic " + topic))


def on_publish(client, userdata, mid):
    print((str(client) + " " + str(mid)))


try:
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(WHEEL_RIGHT_1, GPIO.OUT)
    GPIO.setup(WHEEL_RIGHT_2, GPIO.OUT)
    GPIO.setup(WHEEL_LEFT_1, GPIO.OUT)
    GPIO.setup(WHEEL_LEFT_2, GPIO.OUT)
    GPIO.setup(WHEEL_RIGHT_PWM, GPIO.OUT)
    GPIO.setup(WHEEL_LEFT_PWM, GPIO.OUT)

    rightPwm = GPIO.PWM(WHEEL_RIGHT_PWM, 100)
    rightPwm.start(GEAR_1_DUTYCYCLE)
    leftPwm = GPIO.PWM(WHEEL_LEFT_PWM, 100)
    leftPwm.start(GEAR_1_DUTYCYCLE)

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.connect("10.22.0.204", 1883, 60)

    client.loop_forever()


finally:
    rightPwm.stop()
    leftPwm.stop()
    GPIO.cleanup()
