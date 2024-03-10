#include <WiFi.h>
#include <PubSubClient.h>

const char *ssid = "Megacable_2.4G_F365";
const char *password = "QnHb72M7";

const int sensorPin = 13;

WiFiClient espClient;
PubSubClient client(espClient);

const char *mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char *mqttTopic = "topic/message";

void setup()
{
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("¡Conectado a WiFi!");

  client.setServer(mqttServer, mqttPort);

  pinMode(sensorPin, INPUT);
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Intentando conectar MQTT");
    if (client.connect("arduinoClient"))
    {
      Serial.println("connected");
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

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  int sensorState = digitalRead(sensorPin);

  if (sensorState == HIGH)
  {
    client.publish(mqttTopic, "desocupado");
  }
  else
  {
    client.publish(mqttTopic, "ocupado");
  }

  delay(1000);
}
