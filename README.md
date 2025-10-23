<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Play</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

**Byte Armada** is a real-time-tactics 🚀 game

---
Modes: single and multiplayer

- 🚀🤖 - click intro  
- 🚀🚀 - long-press intro and scan each other's 📱 (Android Chrome on same wifi)

---

🥅 Objective: get a ship to the other side.

---
- The first screen is the Intro screen.
- The second screen is the Level screen. The default level starts at level 13 but you can select a easier or harder level.

🎮 Controls
When the game starts and you see red enemy on the far side, it is time to start laying down your ships.  

To create a ship, click 🚨**TWO**🚨 of the five zones:

- Your **first click** determines the ship **speed** and **horizontal position**
- Your **second click** determines the ship laser **range**  

---
With 5 zones for 🎚️ speed and 🎚️ range, there are **25 possible ship configurations**  
higher speed = less health  
higher range = less damage  

- Example 1: fast/long-range ship placed at right
  - 1st-click: upper-right
  - 2nd-click: upper
- Example 2: fast/short-range ship placed at right
  - 1st-click: upper-right
  - 2nd-click: lower
- Example 3: slow/short-range ship placed at middle
  - 1st-click: lower-middle
  - 2nd-click: lower
- Example 4: slow/long-range ship placed at middle
  - 1st-click: lower-middle
  - 2nd-click: upper
- Example 5: medium/medium-range ship placed at left
  - 1st-click: middle-left
  - 2nd-click: middle


---

# 📚 Post-Mortem

## Overview

I wanted to create a **real-time tactics space shooter** that emphasizes strategic decision-making while keeping the **user interface minimal and uncluttered**.  

This is why the user interface is so unintuitive...trying to fit a range of **fast** choices into a minimum number of clicks...sort of like speed-chess. Initially I showed some indication of the process, but it didn't add much, so I took it out.

## 🎨 Art

I created [Vector Bay](//github.com/bacionejs/vectorbay) for building spaceships.

## 📷 Barcode Handshake

To support multiplayer without a server, exchange a WebRTC SDP handshake with a phone barcode, face-to-face, with both players on the same wifi. A stripped SDP is 130 characters (1600 raw), too long to type, but a perfect fit for a barcode handshake.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to complex features like multiple placement patterns, masking with scoring and selection, and interleaving data across multiple blocks with separate error correction. `DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block. And by using only a single encoding mode the algorithm is reduced to 1k.

Feel free to use `handshake.js` without attribution. And as you can see, `game.js` only needed a few lines to support multiplayer (search for "channel"); merely sharing creation data almost gives a complete solution but it gradually gets out of sync but by sharing destruction data too, it seems that everything works. This approach won't work for complex games...but good luck, and I hope to see your game someday. 🥳



