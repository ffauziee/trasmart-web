#include <HTTPClient.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>
#include "secrets.h"

#ifndef SECRETS_H
#define SECRETS_H
const char* ssid             = "WIFI_NAME";
const char* password         = "WIFI_PASSWORD";
const char* supabase_url     = "https://YOUR_PROJECT.supabase.co";
const char* supabase_key     = "YOUR_PUBLISHABLE_KEY";
const char* MACHINE_ID       = "YOUR_MACHINE_UUID";
const char* CATEGORY_LOGAM   = "YOUR_UUID_LOGAM";
const char* CATEGORY_PLASTIK = "YOUR_UUID_PLASTIK";
#endif

// MQTT Broker (bukan secret)
const char* mqtt_server = "broker.hivemq.com";

// --- DEFINISI PIN ---
#define PIN_TRIG 5
#define PIN_ECHO 18
#define PIN_PROX 19
#define PIN_SERVO 13

// --- INISIALISASI OBJEK ---
Servo myServo;
LiquidCrystal_I2C lcd(0x27, 16, 2);
WiFiClient espClient;
PubSubClient client(espClient);

// --- VARIABEL ---
long duration;
int distance;

// Fungsi Kirim ke Supabase (Sekarang menerima 2 parameter: Jenis dan Poin)

void setup_wifi() {
  delay(10);
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  lcd.clear();
  lcd.print("WiFi Connected!");
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_Vending_Trash")) {
      client.publish("vending/status", "Online");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_PROX, INPUT_PULLUP);

  myServo.attach(PIN_SERVO);
  myServo.write(90); 
  
  lcd.init();
  lcd.backlight();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // 1. Baca Jarak (Sensor Ultrasonik)
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  duration = pulseIn(PIN_ECHO, HIGH);
  distance = duration * 0.034 / 2;

  lcd.setCursor(0, 0);
  lcd.print("Standby...      ");

  // 2. Jika ada sampah terdeteksi masuk
  if (distance > 0 && distance < 10) {
    lcd.clear();
    lcd.print("Benda Masuk!");
    
    unsigned long startTime = millis();
    bool logamDitemukan = false;

    // 3. Menunggu deteksi logam selama 20 detik
    while (millis() - startTime < 20000) { 
      int sisaWaktu = 20 - ((millis() - startTime) / 1000);
      
      lcd.setCursor(0, 1);
      lcd.print("Cek Logam: ");
      lcd.print(sisaWaktu);
      lcd.print("s ");

      if (digitalRead(PIN_PROX) == LOW) {
        logamDitemukan = true;
        break; // Keluar loop jika logam terdeteksi sebelum 20 detik
      }
      delay(100);
    }

    lcd.clear();
    if (logamDitemukan) {
      // --- KONDISI LOGAM ---
      lcd.print("LOGAM +15 Poin");
      
      // MQTT tetap jalan untuk monitor real-time
      client.publish("vending/data", "Logam Terdeteksi");
      
      // Kirim data ke tabel transactions di Supabase
      // Fungsi ini akan mengirim payload dengan UUID Kategori Logam
      kirimKeSupabase("LOGAM", 15);
      
      myServo.write(180); // Miring ke wadah Logam
    } 
    else {
      // --- KONDISI PLASTIK (Jika 20 detik habis tanpa logam) ---
      lcd.print("PLASTIK +10 Poin");
      
      client.publish("vending/data", "Plastik Terdeteksi");
      
      // Kirim data ke tabel transactions di Supabase
      // Fungsi ini akan mengirim payload dengan UUID Kategori Plastik
      kirimKeSupabase("PLASTIK", 10);
      
      myServo.write(0);  // Miring ke wadah Plastik
    }

    // 4. Proses pembuangan selesai
    delay(3000); 
    myServo.write(90); // Kembali ke posisi datar
    lcd.clear();
    lcd.print("Selesai!");
    delay(1000);
  }

  delay(200);
}

// --- FUNGSI KIRIM TRANSAKSI KE SUPABASE ---
void kirimKeSupabase(String jenis, int poin) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi tidak terhubung!");
    return;
  }

  HTTPClient http;

  // ========================================
  // STEP 1: Ambil current_user_id dari mesin
  // ========================================
  String getUrl = String(supabase_url)
    + "/rest/v1/machines?id=eq." + String(MACHINE_ID)
    + "&select=current_user_id";

  http.begin(getUrl);
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", "Bearer " + String(supabase_key));

  int getCode = http.GET();
  String userId = "";

  if (getCode == 200) {
    String resp = http.getString();
    Serial.println("GET machines response: " + resp);

    // Parse JSON
    int start = resp.indexOf("\"current_user_id\":\"") + 19;
    int end = resp.indexOf("\"", start);
    if (start > 19 && end > start) {
      userId = resp.substring(start, end);
    }
  } else {
    Serial.printf("GET machines ERROR: %d\n", getCode);
  }
  http.end();

  // Cek apakah ada user yang terpair
  if (userId == "" || userId == "null") {
    Serial.println("ERROR: Tidak ada user yang terpair dengan mesin ini!");
    lcd.clear();
    lcd.print("Error: No User");
    lcd.setCursor(0, 1);
    lcd.print("Pair dulu!");
    delay(3000);
    return;
  }

  Serial.println("User ID ditemukan: " + userId);

  // ========================================
  // STEP 2: Kirim transaksi dengan user_id
  // ========================================
  String category_id = (jenis == "LOGAM") 
    ? String(CATEGORY_LOGAM) 
    : String(CATEGORY_PLASTIK);

  http.begin(String(supabase_url) + "/rest/v1/transactions");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", "Bearer " + String(supabase_key));
  http.addHeader("Prefer", "return=minimal");

  String jsonPayload = "{"
    "\"user_id\":\"" + userId + "\","
    "\"machine_id\":\"" + String(MACHINE_ID) + "\","
    "\"category_id\":\"" + category_id + "\","
    "\"points_earned\":" + String(poin) + ","
    "\"status\":\"completed\""
  "}";

  Serial.println("Payload: " + jsonPayload);

  int postCode = http.POST(jsonPayload);

  if (postCode == 201) {
    Serial.println("✅ Transaksi berhasil dikirim!");
  } else {
    Serial.printf("❌ POST Error: %d\n", postCode);
    Serial.println(http.getString());
  }
  http.end();
}

void refreshSessionExpiry() {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  String url = String(supabase_url) + "/rest/v1/rpc/refresh_session_expiry";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", "Bearer " + String(supabase_key));
  String payload = "{\"p_machine_id\":\"" + String(MACHINE_ID) + "\"}";
  int code = http.POST(payload);
  if (code == 200) {
    Serial.println("✅ Session timer refreshed!");
  } else {
    Serial.printf("⚠️ Failed to refresh session: %d\n", code);
  }
  http.end();
}
Call it after successful transaction in kirimKeSupabase():
if (postCode == 201) {
  Serial.println("✅ Transaksi berhasil dikirim!");
  refreshSessionExpiry();  // <-- ADD THIS LINE
}