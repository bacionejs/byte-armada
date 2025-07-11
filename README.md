<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Demo</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

# **Byte Armada Instructions**


**Byte Armada** is a real-time strategy space shooter. 

---

Two modes:  
- Single Player  
- Player versus Player (1v1) 

For 1v1, just long-press the intro screen and scan each other's phone, but it's only supported on Android Chrome and both players must be on the same wifi. 

---

To create a ship, **tap twice**:

- The **first tap** sets **position and speed**.  
  Example: To create a fast ship starting from the lower right, tap in the upper right.
- The **second tap** sets the **range**.  
  The horizontal position of the second tap **doesn’t matter**.

---

There are **five invisible zones**, indicated by tick marks on the **right side**.  
You **don’t click the tick marks**—they just show where the zones are.

- Your **first tap** determines the ship’s **horizontal position and speed** based on the zone you tapped.
- Your **second tap** determines the **range**, also based on the zone.

> With 5 zones for 🎚️ speed and 🎚️ range, there are **25 possible ship configurations**.

🛡 Ships with **higher speed have less HP**,  
🔫 Lasers with **longer range are weaker**.

---

# 📘 Post-Mortem

---

## 🎮 Gameplay Design

**Byte Armada** is a real-time strategy space shooter.

My inspiration for the game is the classic *Age of Empires*, where you have to manage resources and choose different unit types. 

I wanted to distill down to the essence of the genre — the balancing act between agility and strength, hit power and firepower — and make it with a simple interface.

Instead of choosing distinct units with various abilities, you have **two abilities**, which, when combined, provide **25 combinations** of speed and laser range, which are inversely correlated to HP and hit power.

To keep the controls simple, I decided that instead of swiping on a map to define a unit's route, they would just all **march across the screen like pawns in a chess game**.

---

## 🧠 UI and Controls

My main challenge for unit selection was **reducing the amount of UI clutter** and user interaction required to select a unit type.

The minimum is three interactions: two are for your abilities and one is for your position.

But I didn't like having to perform three clicks in a fast-paced game.

So I **combined position with speed**. And while it is unorthodox and non-intuitive, it does reduce the number of user interactions.

---

## ⚡ Resource Management

Resource management mainly consists of **one stat: energy**.

But also, you're limited to **five units at a time** on the board.

With each level the enemy gets more energy. You can **skip levels** if you aren't challenged enough.

The delightful part of the design is how **complex strategies can emerge from a simple interface**.

---

## ✏️ Art and Visuals

Usually, I design very simple vector shapes. But I wanted my ships this time to be a little more interesting.

With simple shapes, I can determine the points in my head. But for this, I needed a drawing tool and I couldn't find one which met my needs. Thus, [Vector Bay](//github.com/bacionejs/vectorbay) was born.

Since I planned on making symmetrical ships, I realized that I only needed to **draw half a ship, then mirror it**.

I tried many strategies for skinning the ships, but found that a **simple radial gradient** got the most bang for my buck.

I don't like how real-time strategy games put health bars and energy bars above their characters. It clutters the UI. So, as a strategy to indicate a ship's HP, **they become smaller**.

---

## 🔫 Lasers and Combat

Initially, I wanted to make the laser have some movement, but this would have required leading the target and perhaps calculating hits.

But since I planned on **every shot being perfect**, that really wasn't necessary. And the amount of code just wasn't worth it.

So I switched to **instantaneous lasers** that didn't even have any state and completely **decoupled the visual of the laser from the internal logic**.

> The internal logic says: *find the closest target in range and affect it*.  
> And as an aside, show a line between the two.

---

## 🧠 AI

I spent a lot of time thinking about AI for the enemy, but in the end a **one-liner with random variables was sufficient**.

---

## 🌌 Backgrounds

I experimented with many background ideas: shooting stars, moving stars, blinking stars, terrain...

But in the end I just chose a **blue mist at the bottom** and some stars of different color and different size — for a total of **five lines of code**.

---

## 🔇 Sound

I really wanted to put sound into the game.

Last year's game had voice, explosions, laser sounds, and music.

But after many long sidequests, I decided **not to have anything**.

Part of the problem is that when the game is constantly shooting, it ends up just being a droning sound — almost as if you could have put a backtrack on the game without it tied to logic.

---

## 🥊 1v1

I wanted the option to have 1v1 and spent an incredible amount of time figuring out ways to do the **communication handshake between two phones without requiring a server**.

For development testing, I used a server to pass the handshake back and forth. It was **delightfully smooth** and required no interaction from the user.

With that set up, I could focus on testing 1v1 logic without worrying about the tedious details of the communication handshake.

But, after hammering out all the details of 1v1 logic, I had to switch to another strategy to be compliant.

At one point, I used Messenger for the handshake and supported remote 1v1 via STUN, but it was cumbersome and non-compliant.

## 📷 Barcode Handshake

I settled on **barcodes** because it's the only handshake strategy that fits within the JS13K rules — although it **only works on Android Chrome**.

Technically, you could send a barcode to a remote user, but it's best suited for face-to-face handshakes. So I dropped STUN support as well, and now both peers must be on the same Wi-Fi.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to **complex features** like multiple placement patterns, *masking with scoring and selection*, and *interleaving data across multiple blocks* with separate error correction.

`DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block, and I simplified the algorithm to 1k, mostly by supporting only a single encoding mode.

It supports a 2,000 byte payload, but anything above 200 is unreliable — **not because of the barcode generator or the `BarcodeDetector` API, but because my live camera pipeline is fragile and lacks the advanced image processing built into native phone scanners**.

RTC handshakes (SDP) are 1,600 bytes, and compression only brings that down to 700. So I implemented **SDP elision**, stripping out shared boilerplate, reducing the payload to just 130. 🎉
