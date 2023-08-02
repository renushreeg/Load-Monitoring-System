#include <PZEM004Tv30.h>
#include <SoftwareSerial.h>

SoftwareSerial pzemSWSerial(9, 10);
PZEM004Tv30 pzem;
SoftwareSerial pzemSWSerial2(11, 12);
PZEM004Tv30 pzem2;

void setup() {
  Serial.begin(115200);

  pzem = PZEM004Tv30(pzemSWSerial);
  pzem2 = PZEM004Tv30(pzemSWSerial2);
}

void loopSerial(int id, PZEM004Tv30 p) {
  // Read the data from the sensor
  float voltage = p.voltage();
  float current = p.current();
  float power = p.power();
  float energy = p.energy();
  float frequency = p.frequency();
  float pf = p.pf();

  // Check if the data is valid
  if(isnan(voltage)){
    Serial.println("Error reading voltage");
  } else if (isnan(current)) {
    Serial.println("Error reading current");
  } else if (isnan(power)) {
    Serial.println("Error reading power");
  } else if (isnan(energy)) {
    Serial.println("Error reading energy");
  } else if (isnan(frequency)) {
    Serial.println("Error reading frequency");
  } else if (isnan(pf)) {
    Serial.println("Error reading power factor");
  } else {
    Serial.print(id);           Serial.print(",");
    Serial.print(voltage);      Serial.print(",");
    Serial.print(current);      Serial.print(",");
    Serial.print(power);        Serial.print(",");
    Serial.print(energy,3);     Serial.print(",");
    Serial.print(frequency, 1); Serial.print(",");
    Serial.println(pf);
  }  
}

void loop() {
  loopSerial(1, pzem);
  loopSerial(2, pzem2);
  delay(10000);
}
