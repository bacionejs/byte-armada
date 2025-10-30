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

## 💡 Purpose

To create a real-time-tactics space shooter that emphasizes strategic decision-making while keeping the **user interface minimal and uncluttered**.  

## 🎨 Art

I created [Vector Bay](//github.com/bacionejs/vectorbay) for building spaceships.

## 📷 Barcode Handshake

To support multiplayer without a server, exchange a WebRTC SDP handshake with a phone barcode, face-to-face, with both players on the same wifi. A stripped SDP is 130 characters (1600 raw), too long to type, but a perfect fit for a barcode handshake.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to complex features like multiple placement patterns, masking with scoring and selection, and interleaving data across multiple blocks with separate error correction. `DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block. And by using only a single encoding mode the algorithm is reduced to 1k.

Feel free to use `handshake.js` without attribution. And as you can see, `game.js` only needed a few lines to support multiplayer (search for "channel"); merely sharing creation data almost gives a complete solution but it gradually gets out of sync but by sharing destruction data too, it seems that everything works. This approach won't work for complex games...but good luck, and I hope to see your game someday. 🥳




---

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

1.  Both players long-press the game's title screen to enter multiplayer mode.
2.  Player 1's browser generates a WebRTC "offer" and encodes it into a barcode displayed on their screen.
3.  Player 2 uses their phone's camera to scan the barcode. The browser's built-in `BarcodeDetector` API makes this surprisingly easy.
4.  Upon scanning, Player 2's browser generates an "answer" and displays it as a *new* barcode on their screen.
5.  Player 1 scans Player 2's barcode.
6.  The handshake is complete! An `RTCDataChannel` opens between the two phones, and the game begins.

This worked in theory, but I hit two major technical roadblocks.

#### Hurdle 1: The Bloated SDP

A standard WebRTC SDP (Session Description Protocol) payload is huge, often over 1600 characters. This is far too much data to reliably encode in a barcode that can be scanned quickly by a phone camera.

The solution was to strip the SDP down to its absolute essentials. I wrote a function that extracts only what's needed for a data channel connection:
*   The type (`offer` or `answer`)
*   Session ID
*   ICE credentials (`ufrag` and `pwd`)
*   The connection fingerprint
*   A single network candidate

This process compressed the 1600+ character string into a lean ~130 characters—a perfect fit for a barcode.

```javascript
// handshake.js - Simplified SDP stripping logic

function SDP(s) {
  if (s.includes("\n")) { // Strip down
    const type = s.includes("a=setup:actpass") ? "offer" : "answer";
    const sessionId = (s.match(/^o=- (\d+)/m) || [])[1];
    const ufrag = (s.match(/^a=ice-ufrag:(.+)/m) || [])[1];
    const pwd = (s.match(/^a=ice-pwd:(.+)/m) || [])[1];
    const fp = (s.match(/^a=fingerprint:sha-256 (.+)/m) || [])[1];
    const cand = (s.match(/^a=candidate:(.+)/m) || [])[1];
    return [type, sessionId, ufrag, pwd, fp.replace(/:/g,""), cand].join("|");
  } else { // Unstrip (rebuild)
    // ... logic to reconstruct the full SDP from the piped string
  }
}
```

#### Hurdle 2: The Barcode Generator

JavaScript has a built-in barcode *reader*, but not a *generator*. I initially considered using a QR Code library, but even the smallest ones were around 10kB. That felt bloated for my lightweight game.

After some research, I found that the **DataMatrix** format was much simpler than QR Code. It lacks complex features like masking patterns and multiple error-correction blocks. By writing a generator focused on a single encoding mode, I was able to create a fully functional DataMatrix generator in just **1kB of JavaScript**.

This custom, minimal implementation kept the project lean and fast, without relying on external libraries for this core feature.

## Keeping the Game in Sync

With the data channel open, the final piece of the puzzle was synchronizing the game state. For a simple game like Byte Armada, a complex state-syncing model isn't necessary. I opted for a simple event-based approach.

When a player creates a ship, their client sends the ship's initial parameters (position, speed, range) to their opponent as a JSON message.

```javascript
// game.js - Sending ship creation data

function click({clientX:x, clientY:y}) {
  // ... logic for setting ship position, speed, range
  if (p.range) { // The final click that creates the ship
    b.push(p);
    if (channel) {
      // Send the new ship's data to the other player
      channel.send(JSON.stringify({
        x: p.x,
        w: W,
        range: p.range,
        speed: p.speed,
        side: p.side = side,
        id: p.id = blue.id++
      }));
    }
    p = null;
  }
}
```

The receiving client listens for messages and adds the new ship to its world.

```javascript
// game.js - Receiving ship creation data

if (channel) {
  channel.onmessage = ({ data }) => {
    let parsed = JSON.parse(data);
    // Add the opponent's ship to the game
    red.entities.push(entity(
      parsed.x / parsed.w * W, // Scale position to local screen size
      0, PI, -parsed.speed, parsed.range, parsed.side, parsed.id
    ));
  };
}
```

Initially, this was all I did. However, I noticed that the games would slowly fall out of sync. A ship might be destroyed on one player's screen but remain on the other's due to slight differences in timing.

The fix was simple: explicitly sync destruction events. When a ship's health drops to zero, the client sends a "delete" message containing that ship's unique ID. This ensures both players remove the same ship at the same time, keeping the simulation perfectly synchronized.

```javascript
// game.js - Desync safeguard

// In the update loop...
if (channel) {
  i.entities.forEach(e => {
    if (e.hp <= 0) {
      // Tell the other peer to delete this entity
      channel.send(JSON.stringify({...e, delete: true}));
    }
  });
}
```

## Conclusion

Building Byte Armada was a fantastic journey. It taught me that WebRTC is an incredibly powerful tool for more than just video conferencing. By thinking creatively about the signaling phase, I was able to achieve my goal of a truly serverless multiplayer game that fosters a fun, face-to-face connection.

This barcode handshake approach won't work for every game, but it's a perfect fit for local multiplayer and a great example of how we can use the physical world to solve digital problems. I hope this inspires you to think outside the box for your next project.

You can **[play Byte Armada here](https://bacionejs.github.io/byte-armada/)**. Grab a friend and try out the multiplayer mode for yourself
