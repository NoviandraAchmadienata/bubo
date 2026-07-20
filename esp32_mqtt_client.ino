#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ====== WIFI CONFIGURATION ======
const char* ssid = "YOUR_SSID";
const char* wifi_password = "YOUR_WIFI_PASSWORD";

// ====== MQTT CONFIGURATION ======
const char* mqtt_server = "192.168.X.X";  // IP PC/Server Anda
const int mqtt_port = 1883;
const char* mqtt_username = "";  // Kosong jika allow_anonymous = true
const char* mqtt_password = "";

// ====== DEVICE CONFIGURATION ======
const char* WORKER_ID = "W001";
const char* ARMBAND_CODE = "AB001";
String ESP32_MAC;
String FIRMWARE_VERSION = "1.0.0";

// ====== PINS ======
const int BUZZER_PIN = 25;
const int LED_PIN = 2;
const int BUTTON_PIN = 35;

// ====== TOPIC DEFINITIONS ======
const char* TOPIC_STATUS = "bubo/worker/status";
const char* TOPIC_LOCATION = "bubo/worker/location";
const char* TOPIC_COMMAND = "bubo/worker/command";
const char* TOPIC_HEARTBEAT = "bubo/worker/heartbeat";
const char* TOPIC_SENSOR = "bubo/worker/sensor";

// ====== GLOBALS ======
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long last_reconnect = 0;
unsigned long last_publish = 0;
unsigned long last_heartbeat = 0;
const unsigned long PUBLISH_INTERVAL = 5000;   // Publish setiap 5 detik
const unsigned long HEARTBEAT_INTERVAL = 30000; // Heartbeat setiap 30 detik
const unsigned long WIFI_CHECK_INTERVAL = 10000; // Check WiFi setiap 10 detik

unsigned long last_wifi_check = 0;

// ====== SETUP ======
void setup() {
  Serial.begin(115200);
  delay(500);
  
  // Initialize pins
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
  
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("\n\n========== BUBO ESP32 MQTT CLIENT ==========");
  Serial.print("Firmware Version: ");
  Serial.println(FIRMWARE_VERSION);
  
  // Get MAC Address
  ESP32_MAC = WiFi.macAddress();
  Serial.print("ESP32 MAC Address: ");
  Serial.println(ESP32_MAC);
  
  // Connect WiFi
  setup_wifi();
  
  // Setup MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  Serial.println("Setup selesai!");
}

// ====== WIFI CONNECTION ======
void setup_wifi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, wifi_password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Blink LED
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH); // LED on
  } else {
    Serial.println("\nWiFi Connection Failed!");
    digitalWrite(LED_PIN, LOW);
  }
}

// ====== MQTT CALLBACK ======
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  
  Serial.print("Payload: ");
  Serial.println(message);
  
  // Parse JSON command
  DynamicJsonDocument doc(256);
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.print("JSON parse error: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Handle commands
  if (strstr(topic, "command") != NULL) {
    if (doc.containsKey("action")) {
      String action = doc["action"];
      
      if (action == "buzzer") {
        int duration = doc.containsKey("duration") ? doc["duration"] : 500;
        activate_buzzer(duration);
        Serial.println("Buzzer activated!");
      }
      else if (action == "led") {
        String state = doc["state"];
        if (state == "on") {
          digitalWrite(LED_PIN, HIGH);
        } else if (state == "off") {
          digitalWrite(LED_PIN, LOW);
        }
        Serial.print("LED state: ");
        Serial.println(state);
      }
      else if (action == "reset") {
        Serial.println("Resetting device...");
        ESP.restart();
      }
    }
  }
}

// ====== RECONNECT MQTT ======
boolean reconnect() {
  if (client.connect(WORKER_ID)) {
    Serial.println("MQTT Connected!");
    
    // Publish online status
    publish_status("online");
    
    // Subscribe to command topic
    char subscribe_topic[100];
    sprintf(subscribe_topic, "bubo/worker/%s/command", WORKER_ID);
    client.subscribe(subscribe_topic);
    
    // Blink LED
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    
    return true;
  } else {
    Serial.print("MQTT Connection Failed, rc=");
    Serial.println(client.state());
    return false;
  }
}

// ====== PUBLISH STATUS ======
void publish_status(const char* status) {
  DynamicJsonDocument doc(256);
  doc["worker_id"] = WORKER_ID;
  doc["armband_code"] = ARMBAND_CODE;
  doc["esp32_mac"] = ESP32_MAC;
  doc["firmware_version"] = FIRMWARE_VERSION;
  doc["status"] = status;
  doc["timestamp"] = millis();
  doc["rssi"] = WiFi.RSSI();  // Signal strength in dBm
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  char topic[100];
  sprintf(topic, "%s/%s", TOPIC_STATUS, WORKER_ID);
  client.publish(topic, buffer);
  
  Serial.print("Published status: ");
  Serial.println(buffer);
}

// ====== PUBLISH LOCATION ======
void publish_location(float x, float y, float accuracy) {
  DynamicJsonDocument doc(512);
  doc["worker_id"] = WORKER_ID;
  doc["armband_code"] = ARMBAND_CODE;
  doc["position_x"] = x;
  doc["position_y"] = y;
  doc["estimated_error"] = accuracy;
  doc["timestamp"] = millis();
  doc["algorithm"] = "wifi_triangulation";
  doc["model_version"] = "1.0";
  
  char buffer[512];
  serializeJson(doc, buffer);
  
  char topic[100];
  sprintf(topic, "%s/%s", TOPIC_LOCATION, WORKER_ID);
  client.publish(topic, buffer);
  
  Serial.print("Published location: ");
  Serial.println(buffer);
}

// ====== PUBLISH SENSOR DATA ======
void publish_sensor_data() {
  DynamicJsonDocument doc(256);
  doc["worker_id"] = WORKER_ID;
  doc["accel_x"] = random(-100, 100) / 100.0;
  doc["accel_y"] = random(-100, 100) / 100.0;
  doc["accel_z"] = random(-100, 100) / 100.0;
  doc["timestamp"] = millis();
  doc["temperature"] = 25.5;
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  client.publish(TOPIC_SENSOR, buffer);
  
  Serial.print("Published sensor data: ");
  Serial.println(buffer);
}

// ====== BUZZER CONTROL ======
void activate_buzzer(int duration) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(duration);
  digitalWrite(BUZZER_PIN, LOW);
}

// ====== SHORT BUZZ (notification) ======
void short_buzz() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}

// ====== CHECK BUTTON PRESS ======
void check_button() {
  if (digitalRead(BUTTON_PIN) == HIGH) {
    delay(50); // Debounce
    if (digitalRead(BUTTON_PIN) == HIGH) {
      Serial.println("Button pressed! Publishing emergency alert...");
      short_buzz();
      
      DynamicJsonDocument doc(256);
      doc["worker_id"] = WORKER_ID;
      doc["event_type"] = "EMERGENCY_ALERT";
      doc["timestamp"] = millis();
      
      char buffer[256];
      serializeJson(doc, buffer);
      client.publish("bubo/worker/emergency", buffer);
      
      delay(2000); // Prevent multiple triggers
    }
  }
}

// ====== MAIN LOOP ======
void loop() {
  // Reconnect MQTT if needed
  if (!client.connected()) {
    unsigned long now = millis();
    if (now - last_reconnect > 5000) {
      last_reconnect = now;
      if (reconnect()) {
        last_reconnect = 0;
      }
    }
  } else {
    client.loop();
  }
  
  // WiFi reconnection check
  unsigned long now = millis();
  if (now - last_wifi_check > WIFI_CHECK_INTERVAL) {
    last_wifi_check = now;
    if (WiFi.status() != WL_CONNECTED) {
      digitalWrite(LED_PIN, LOW);
      setup_wifi();
    }
  }
  
  // Check button press
  check_button();
  
  // Publish data periodically
  if (now - last_publish > PUBLISH_INTERVAL) {
    last_publish = now;
    
    // Simulate location data (replace dengan WiFi triangulation logic)
    float random_x = random(0, 100) + random(0, 100) / 100.0;
    float random_y = random(0, 100) + random(0, 100) / 100.0;
    publish_location(random_x, random_y, 2.5);
    
    // Publish sensor data
    publish_sensor_data();
  }
  
  // Send heartbeat
  if (now - last_heartbeat > HEARTBEAT_INTERVAL) {
    last_heartbeat = now;
    client.publish(TOPIC_HEARTBEAT, WORKER_ID);
    Serial.println("Heartbeat sent");
  }
  
  delay(100);
}
