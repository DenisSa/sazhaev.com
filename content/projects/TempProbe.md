---
date: '2017-12-26'
title: 'Fluid temperature monitor'
github: 'https://github.com/DenisSa/STM32'
tech:
  - C
  - STM32
  - DS18B20
  - SSD1306
showInProjects: true
---

I needed to measure the temperature of wax when applying it to a bicycle chain.

It uses STM32 to read the temperature from a DS18B20 sensor, and then displays the information on a SSD1306 OLED display. It also has a beeper to alert the user when the temperature falls outside of a specific range.
