<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Play</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

**Byte Armada** is a real-time-tactics 🚀 game

---
Modes: single and multiplayer

- 🚀🤖 - click intro  
- 🚀🚀 - long-press intro and scan each other's 📱 (Android Chrome on same wifi)

---

🥅 Objective: get a 🚀 to the other side.

---

🎮 Controls

To create a 🚀, click 🚨**TWO**🚨 of the five zones:

- Your **first click** determines the 🚀 horizontal **position** and **speed** 
- Your **second click** determines the 🔫 **range**  
- For example, to create a fast 🚀 in the lower-right, click upper-right  

> With 5 zones for 🎚️ speed and 🎚️ range, there are **25 possible 🚀 configurations**  

🚀 **higher speed = less health**  
🔫 **higher range = less damage**  

⚙️ The default level is 13, but you can change it manually if you like  

---

# 📚 Post-Mortem

## Overview

I aimed to create a **real-time tactics space shooter** that emphasizes strategic decision-making while keeping the **user interface minimal and uncluttered**.  

This is why the user interface is so unintuitive... trying to fit a range of  **fast** choices into a minimum number of clicks. Initially I showed some indication of the process, but it didn't add much, so I took it out. However, it still is problematic.

I tried to fit cats into the game by making the spaceships look like cat heads, but it looked really bad and I couldn't figure out another way to fit cats into a space shooter so I gave up. 

I learned many new things this year and had fun **creating**.  
Next year I will focus more on you having fun **playing**.  
🫡

## 🎨 Art

I created [Vector Bay](//github.com/bacionejs/vectorbay) for building spaceships.

## 📷 Barcode Handshake

To support multiplayer without a server, I initially used Messenger for the handshake and STUN for remote peers, but it was cumbersome. So, I switched to a **barcode handshake**, face-to-face, with both peers on the same Wi-Fi.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to **complex features** like multiple placement patterns, *masking with scoring and selection*, and *interleaving data across multiple blocks* with separate error correction.

`DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block, and I simplified the algorithm to 1k, mostly by supporting only a single encoding mode.

It supports a 2,000 byte payload, but anything above 200 is unreliable — **not because of the barcode generator or the `BarcodeDetector` API, but because my live camera pipeline is fragile and lacks the advanced processing built into native phone scanners**.

RTC handshakes (SDP) are 1,600 bytes, and compression only brings that down to 700. So I implemented **SDP elision**, stripping out shared boilerplate, reducing the payload to just 130. 🎉


