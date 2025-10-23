<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Play</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

---
**Byte Armada**  
a real-time-tactics space shooter game

---
**Single player**  
click intro  

---
**Multi player**  
long-press intro and scan each other's phone (Android Chrome on same wifi)  

---
**Objective**  
Get a ship to the opposite side.  

---
**Controls**  
Click 3 times to create a ship (position, speed, range). Max 5 ships.  
With 5 zones for speed and range, there are **25 possible ship configurations**  
higher speed = less health  
higher range = less damage  

---
**Optional**  
Levels advance automatically, but you can select a level manually if it is too easy/hard.  

---

# 📚 Post-Mortem

## Overview

I wanted to create a **real-time tactics space shooter** that emphasizes strategic decision-making while keeping the **user interface minimal and uncluttered**.  

## 🎨 Art

I created [Vector Bay](//github.com/bacionejs/vectorbay) for building spaceships.

## 📷 Barcode Handshake

To support multiplayer without a server, exchange a WebRTC SDP handshake with a phone barcode, face-to-face, with both players on the same wifi. A stripped SDP is 130 characters (1600 raw), too long to type, but a perfect fit for a barcode handshake.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to complex features like multiple placement patterns, masking with scoring and selection, and interleaving data across multiple blocks with separate error correction. `DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block. And by using only a single encoding mode the algorithm is reduced to 1k.

Feel free to use `handshake.js` without attribution. And as you can see, `game.js` only needed a few lines to support multiplayer (search for "channel"); merely sharing creation data almost gives a complete solution but it gradually gets out of sync but by sharing destruction data too, it seems that everything works. This approach won't work for complex games...but good luck, and I hope to see your game someday. 🥳



