#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Megacable_2.4G_F365";
const char* password = "QnHb72M7";

const int sensorPins[] = {13, 14, 27, 26, 25, 33, 32, 35, 34}; 
const int numSensors = sizeof(sensorPins) / sizeof(sensorPins[0]);
bool sensorStates[numSensors] = {0}; 
unsigned long sensorTimers[numSensors] = {0}; 
unsigned long lastSendTime = 0; 
const unsigned long detectionThreshold = 5000; 
const unsigned long sendInterval = 1000; 

WiFiClient espClient;
PubSubClient client(espClient);

const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char* mqttTopic = "topic/message";

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("¡Conectado a WiFi!");
  client.setServer(mqttServer, mqttPort);

  for (int i = 0; i < numSensors; i++) {
    pinMode(sensorPins[i], INPUT);
  }
  lastSendTime = millis();
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("arduinoClient")) {
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("Intentando otra vez...");
      delay(5000);
    }
  }
}

void sendSensorStates() {
  String message = "[";
  for (int i = 0; i < numSensors; i++) {
    if (sensorStates[i]) { 
      if (message != "[") message += ", ";
      message += "\"sensor" + String(i + 1) + "\""
    }
  }
  message += "]";

  client.publish(mqttTopic, message.c_str());
  Serial.println(message);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentTime = millis();
  bool stateChanged = false;

  for (int i = 0; i < numSensors; i++) {
    bool sensorState = digitalRead(sensorPins[i]) == LOW; 

    if (sensorState && sensorTimers[i] == 0) { 
      sensorTimers[i] = currentTime;
    } else if (!sensorState && sensorTimers[i] != 0) { 
      sensorTimers[i] = 0;
      sensorStates[i] = false;
      stateChanged = true;
    } else if (sensorState && currentTime - sensorTimers[i] >= detectionThreshold) { 
      if (!sensorStates[i]) {
        sensorStates[i] = true; 
        stateChanged = true;
      }
      sensorTimers[i] = 0; 
    }
  }

  if (stateChanged || currentTime - lastSendTime >= sendInterval) { 
    sendSensorStates();
    lastSendTime = currentTime; 
  }

  delay(100); 
}
