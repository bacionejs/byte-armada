<h1><a href="https://bacionejs.github.io/byte-armada/" style="text-decoration: none; color: inherit;">Play</a></h1>

[![Demo – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

**byte-armada** is a real-time-tactics 😾 fight

---

- 😾🤖 Single Player - click intro  
- 😾😾 Multi  Player - long-press intro and scan each other's 📱 (Android Chrome on same wifi)   

---

🥅 Objective: get a 😾 to the other side.

---

🎮 Controls

To create a 😾, click 🚨**TWO**🚨 of the five zones:

- Your **first click** determines the 😾 horizontal **position** and **speed**  
- Your **second click** determines the 🔫 **range**  
- For example, to create a fast 😾 in the lower-right, click upper-right  

> With 5 zones for 🎚️ speed and 🎚️ range, there are **25 possible 😾 configurations**  

😾 **higher speed = less health**  
🔫 **higher range = less damage**  

---

# 📚 Post-Mortem

---

# 📷 Barcode Handshake

I wanted the option to have multiplayer and spent an incredible amount of time figuring out ways to do the **communication handshake between two phones without requiring a server**.

At one point, I used Messenger for the handshake and supported remote multiplayer via STUN, but it was cumbersome and non-compliant.

I settled on **barcodes** because it's the only handshake strategy that fits within the JS13K rules — although it **only works on Android Chrome**.

Since it is a face-to-face handshake, I dropped remote STUN support, therefore both peers must be on the same Wi-Fi.

JavaScript has a built-in barcode *reader*, but not a *generator*. For the generator, I originally considered `QR Code`, but even with a fixed version and error level, the logic is still 10k. This is due to **complex features** like multiple placement patterns, *masking with scoring and selection*, and *interleaving data across multiple blocks* with separate error correction.

`DataMatrix` has a much simpler structure: fixed placement, no masking, and a single block, and I simplified the algorithm to 1k, mostly by supporting only a single encoding mode.

It supports a 2,000 byte payload, but anything above 200 is unreliable — **not because of the barcode generator or the `BarcodeDetector` API, but because my live camera pipeline is fragile and lacks the advanced processing built into native phone scanners**.

RTC handshakes (SDP) are 1,600 bytes, and compression only brings that down to 700. So I implemented **SDP elision**, stripping out shared boilerplate, reducing the payload to just 130. 🎉


