#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define UART_TX D6
#define UART_RX D7

const char* WIFI_SSID = "[SSID]";
const char* WIFI_PASSWORD = "[PASSWORD]"

// Not finished yet!
const char* API_URL = "";

String status = "want_to_read";

void connectWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.print("Connected! IP: ");
    Serial.println(WiFi.localIP());
}

bool sendISBN(String isbn) {
    if (WiFi.status() != WL_CONNECTED)
        return false;

    HTTPClient http;

    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    String body =
        "{\"isbn\":\"" + isbn +
        "\",\"status\":\"" + status + "\"}";

    int code = http.POST(body);

    Serial.print("HTTP Code: ");
    Serial.println(code);

    if (code > 0) {
        Serial.println(http.getString());
    }

    http.end();

    return code == 200;
}

void setup() {
    Serial.begin(115200);

    Serial1.begin(
        9600,
        SERIAL_8N1,
        UART_RX,
        UART_TX
    );

    connectWiFi();
}

void loop() {

    if (Serial1.available()) {

        String isbn = Serial1.readStringUntil('\n');

        isbn.trim();

        if (isbn.length() > 0) {

            Serial.print("Scanned: ");
            Serial.println(isbn);

            if (sendISBN(isbn)) {
                Serial.println("Book added!");
            } else {
                Serial.println("Upload failed.");
            }
        }
    }
}
