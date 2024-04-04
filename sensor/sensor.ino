#include <WiFi.h>
#include <PubSubClient.h>

#define RXp2 16
#define TXp2 17

#define RX0 3
#define TX0 1

const char *ssid = "Megacable_2.4G_F365";
const char *password = "QnHb72M7";

const int sensorPins[] = {13, 14, 27, 26, 25, 33, 32, 35, 34, 15};
const int numSensors = sizeof(sensorPins) / sizeof(sensorPins[0]);
bool sensorStates[numSensors] = {0};
unsigned long sensorTimers[numSensors] = {0};
unsigned long lastSendTime = 0;
const unsigned long detectionThreshold = 5000;
const unsigned long sendInterval = 1000;

WiFiClient espClient;
PubSubClient client(espClient);

const char *mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char *mqttTopic = "topic/message";
const char *mqttTopicTwo = "topic/rfid";
const char *mqttTopicThree = "topic/validate";
const char *mqttTopicFour = "topic/rfidTwo";

void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600, SERIAL_8N1, RXp2, TXp2);
  Serial.begin(9600, SERIAL_8N1, RX0, TX0);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("¡Conectado a WiFi!");
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

  for (int i = 0; i < numSensors; i++)
  {
    pinMode(sensorPins[i], INPUT);
  }
  lastSendTime = millis();
}

void callback(char *topic, byte *payload, unsigned int length)
{
  String msg = ""; // Corrección: se añade el punto y coma al final de la declaración
  for (int i = 0; i < length; i++)
  {
    msg += (char)payload[i]; // Corrección: se utiliza el operador de concatenación para construir el mensaje completo
    // Serial.print((char)payload[i]);
  }
  if (msg == "existe")
  {
    Serial.println("S abre servo");
  }
  else
  {
    Serial.println("No se abre servo");
  }
  // Serial.println();
}

void reconnect()
{
  while (!client.connected())
  {
    if (client.connect("arduinoClient"))
    {
      client.subscribe(mqttTopicThree);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("Intentando otra vez...");
      delay(5000);
    }
  }
}

void sendSensorStates()
{
  String message = "[";
  for (int i = 0; i < numSensors; i++)
  {
    if (sensorStates[i])
    {
      if (message != "[")
        message += ", ";
      message += "\"sensor" + String(i + 1) + "\"";
    }
  }
  message += "]";

  client.publish(mqttTopic, message.c_str());
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  unsigned long currentTime = millis();
  bool stateChanged = false;

  for (int i = 0; i < numSensors; i++)
  {
    bool sensorState = digitalRead(sensorPins[i]) == LOW;

    if (sensorState && sensorTimers[i] == 0)
    {
      sensorTimers[i] = currentTime;
    }
    else if (!sensorState && sensorTimers[i] != 0)
    {
      sensorTimers[i] = 0;
      sensorStates[i] = false;
      stateChanged = true;
    }
    else if (sensorState && currentTime - sensorTimers[i] >= detectionThreshold)
    {
      if (!sensorStates[i])
      {
        sensorStates[i] = true;
        stateChanged = true;
      }
      sensorTimers[i] = 0;
    }
  }

  if (stateChanged || currentTime - lastSendTime >= sendInterval)
  {
    sendSensorStates();
    lastSendTime = currentTime;
  }

  if (Serial2.available())
  {
    String message = Serial2.readString();
    client.publish(mqttTopicTwo, message.c_str());
  }

  if (Serial.available())
  {
    String message = Serial.readString();
    client.publish(mqttTopicFour, message.c_str());
  }

  delay(100);
}
