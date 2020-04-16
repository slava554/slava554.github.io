bool ledState = LOW;

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, ledState);
}

void loop() {
  if (Serial.available() > 0) {
        String in = Serial.readString();
        in.trim();
        if(in == "switch"){
          Serial.println("switch led");
          ledState = !ledState;
          digitalWrite(LED_BUILTIN, ledState);
        }else{
          Serial.println("I received: " + in);
          delay(1000);
        }
    }else{
      Serial.println("listening...");
      delay(300);
    }
}
