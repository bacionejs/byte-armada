<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Play</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

---
**Byte Armada**  
A multiplayer space shooter game

---
**Requirements**  
Two Android Chrome phones on the same wifi

---
**Start**  
Click the intro screen and the scan each other's phone

---
**Controls**  
Click 3 times to create a ship (position, speed, range). Max 5 ships.  
With 5 zones for speed and range, there are **25 possible ship configurations**  
higher speed = less health  
higher range = less damage  

---
**Objective**  
Get a ship to the opposite side.  

---

# 📚 Post-Mortem
# How I Built a Serverless Multiplayer Game with WebRTC and Barcodes

I've always been fascinated by the idea of creating a purely peer-to-peer multiplayer game that runs in the browser. No servers to maintain, no hosting costs, no user accounts—just two people, two phones, and an instant gameplay session. This idea led me to create **Byte Armada**, a real-time tactical space shooter with a unique, serverless multiplayer experience.

Here's a look at the game in action:

![Byte Armada Gameplay](README.jpg)

The goal was to build a game that was not only fun but also technically interesting. I wanted players to connect face-to-face, on the same Wi-Fi, and jump right into a match. The technology that makes this possible is **WebRTC**, but I had to get creative to solve its biggest hurdle: the initial handshake.

## The Dream of a Serverless Game

Traditional online games rely on a central server. The server acts as the authoritative source of truth, manages player connections, and relays game state between clients. This works well, but it comes with costs, complexity, and latency.

For a simple, local multiplayer game, a central server feels like overkill. Why send data out to the internet and back when your opponent is sitting right across from you? This is where Peer-to-Peer (P2P) networking comes in, and WebRTC is the king of P2P in the browser.

While most people know WebRTC for video and audio streaming, its real secret weapon for game developers is the `RTCDataChannel`. It provides a low-latency, bi-directional channel for sending any kind of data you want—perfect for transmitting player inputs and game events.

## The Handshake Problem: WebRTC's Catch-22

Before two browsers can talk directly to each other via WebRTC, they need to perform a "handshake" to exchange connection details. This process, called **signaling**, involves swapping information like network locations (ICE candidates) and media capabilities (SDP offers/answers).

Herein lies the paradox: to establish a serverless P2P connection, you typically need a server to act as a "signaling" intermediary.

I was determined to stick to my "truly serverless" goal. If I couldn't use a web server for signaling, what could I use? The answer was right in front of me: the players themselves. Since they are in the same physical space, they can become the signaling channel. And the medium for that channel? **A barcode.**

## The Barcode Handshake: "photon" Signaling

I devised a simple, face-to-face process to connect two players using their phone cameras.

1. Both players click the game’s title screen to start the handshake.  
2. Each phone’s browser generates a WebRTC “offer” and displays it as a barcode.  
3. Either player can start by scanning the other’s barcode using their phone camera.  
4. The phone that scans first automatically becomes the “answerer.” It generates an “answer” and shows a *new* barcode on its screen.  
5. The other player then scans this “answer” barcode.  
6. The handshake is complete! An `RTCDataChannel` opens between the two phones, and the game begins.

This worked in theory, but I hit two major technical roadblocks.

#### Hurdle 1: The Bloated SDP

A standard WebRTC SDP (Session Description Protocol) payload is huge, often over 1600 characters. This is far too much data to reliably encode in a barcode that can be scanned quickly by a phone camera.

The solution was to strip the SDP boilerplate and then reconstruct it on the other end.

#### Hurdle 2: The Barcode Generator

JavaScript has a built-in barcode *reader*, but not a *generator*. I initially considered using QR Code, but the algorithm is 30k.

After some research, I found that the **DataMatrix** format was much simpler than QR Code. It lacks complex features like masking patterns and multiple error-correction blocks. By focusing on a single encoding mode, I was able to create a simplified DataMatrix generator in just **1kB of JavaScript**.

## Keeping the Game in Sync

With the data channel open, the final piece of the puzzle was synchronizing the game state. For a simple game like Byte Armada, a complex state-syncing model isn't necessary. I opted for a simple event-based approach.

When a player creates a ship, their client sends the ship's initial parameters (position, speed, range) to their opponent.

```javascript
//in the click event
channel.send(entity);
```

The receiving client listens for messages and adds the new ship to its world.

```javascript
//in channel.onmessage
entities[entity.index]=entity;
```

Initially, this was all I did. However, I noticed that the games would slowly fall out of sync. A ship might be destroyed on one player's screen but remain on the other's due to slight differences in timing.

The fix was simple: explicitly sync destruction events. When a ship's health drops to zero, the client sends that info to the other client. This ensures both players remove the same ship at the same time, keeping the simulation perfectly synchronized.

```javascript
//in the update loop
if(entity.health<=0)channel.send(entity);
```

The receiving client removes the ship.

```javascript
//in channel.onmessage
if(entity.health<=0)entities[entity.index]=undefined;
```

## Conclusion

Building Byte Armada was a fantastic journey. It taught me that WebRTC is an incredibly powerful tool for more than just video conferencing. By thinking creatively about the signaling phase, I was able to achieve my goal of a truly serverless multiplayer game that fosters a fun, face-to-face connection.

This barcode handshake approach won't work for every game, but it's a perfect fit for local multiplayer and a great example of how we can use the physical world to solve digital problems. I hope this inspires you to think outside the box for your next project.

You can **[play Byte Armada here](https://bacionejs.github.io/byte-armada/)**. Grab a friend and try it out.
