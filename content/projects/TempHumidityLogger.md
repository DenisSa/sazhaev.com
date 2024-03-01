---
date: '2017-08-01'
title: 'Temperature & Humidity Logger'
github: 'https://github.com/DenisSa/ATTINY_TEMPERATURE_IOT'
tech:
  - InfluxDB
  - C
  - ESP8266
  - DHT22
  - AM2302
  - MQTT
  - Grafana
showInProjects: true
---

This project was created to log the temperature and humidity of a room over time. It uses an ESP8266 to read the temperature and humidity from a DHT22 or AM2302 sensor, and then sends the information to a server using MQTT.

The information was then stored in InfluxDB and displayed using Grafana.
