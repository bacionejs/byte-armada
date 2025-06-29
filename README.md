[![DEMO – Click to Play](README.jpg)](https://bacionejs.github.io/byte-armada/)

# **Byte Armada Instructions**

**Byte Armada** is a real-time strategy space shooter. It includes **Player vs. Computer** and an optional **Player vs. Player (PvP)** mode.  
*PvP is not part of the competition, but if you'd like to try it, follow the instructions at the bottom.*

---

### 🛠 How to Create a Ship

To create a ship, **tap twice**:

- The **first tap** sets **position and speed**.  
  Example: To create a fast ship starting from the lower right, tap in the upper right.
- The **second tap** sets the **range**.  
  The horizontal position of the second tap **doesn’t matter**.

---

### 🗺 Zone System

There are **five invisible zones**, indicated by tick marks on the **right side**.  
You **don’t click the tick marks**—they just show where the zones are.

- Your **first tap** determines the ship’s **horizontal position and speed** based on the zone you tapped.
- Your **second tap** determines the **range**, also based on the zone.

> With 5 zones used for both speed and range, there are **25 possible ship configurations**.

🛡 Ships with **higher speed have less HP**,  
🔫 Lasers with **longer range are weaker**.

---

### 🤝 How to Activate Hidden PvP Mode

**PvP** is a hidden feature and **not officially supported** for the competition.

To activate it:

1. **Long press** the intro screen.  
2. When prompted, choose **OK**.  
3. **Copy the text** that appears and send it to your friend via instant messenger.
4. Your friend (on the **same Wi-Fi network**) should:
   - **Long press** the intro screen.
   - Choose **Cancel**.
   - **Paste your message** and click **Handshake**.
   - **Copy the response** and send it back to you.
5. You then **paste their response**, click **Handshake**, and the **PvP game will begin**.

---

# **Post-Mortem: Byte Armada – Development & Design**

*Byte Armada* is a real-time strategy space shooter built around simplicity and core strategic decisions. While inspired by classics like *Age of Empires*, my goal wasn’t to replicate them—it was to distill the genre down to its essence: managing resources and navigating the constant trade-off between agility and strength, hit power and firepower.

Rather than offering a set of predefined unit types with fixed abilities, *Byte Armada* lets players define their own units through two adjustable stats: **speed** and **laser range**. These variables are **inversely tied to HP and damage**, resulting in **25 possible combinations**—each with its own tactical trade-offs. The interface remains simple, but the decisions carry weight.

To keep controls streamlined, I avoided complex pathing or swiping mechanics. Instead, **all units march straight across the screen**—like pawns in a chess game. This reinforces the minimalist design and keeps the player focused on high-level strategy rather than micromanagement.

---

### 🧩 Interface Trade-offs

**One of the main challenges** was minimizing UI clutter and reducing the number of interactions required to select a unit type. At minimum, each deployment needed **three inputs**: one for speed, one for range, and one for position. But in a fast-paced game, that felt too slow and cumbersome.

To address this, I **merged position with speed**—your unit’s starting position determines by how fast it is. While this approach is unorthodox and not immediately intuitive, it cuts interaction down to just **two choices per unit**. It was a trade-off in itself: *sacrificing clarity for fluidity*, but ultimately it served the pace and rhythm of the game better.

---

### ⚡ Energy & Unit Limits

**Resource management** is deliberately minimal, centered around a single stat: **energy**. All units draw from the same pool, requiring careful planning and restraint. On top of that, you’re limited to **five units on the board** at any given time. These constraints force tough choices and prevent the game from devolving into chaotic spam, keeping the focus on timing and composition.

The delightful part of the design is how **complex strategies can emerge** from such a stripped-down interface. What starts as simple parameters quickly evolves into layered tactics as players respond to the opponent’s composition, energy state, and timing—*proving that depth doesn’t always require complexity*.

---

### ✏️ Art Pipeline – From Scratch

Usually, I design very simple vector shapes, where I can determine all the points in my head. But this time, I wanted the ships to be a little more interesting—*more personality, more detail*. That meant I needed a drawing tool. I couldn't find one that fit my needs, so I built one. **Vector Bay** was born out of necessity: a lightweight, custom vector editor that let me sketch ships with just enough complexity to fit the game's style, without breaking its minimalist spirit.

Since I planned on making symmetrical ships, I realized I only needed to **draw half a ship, then mirror it**—cutting down the size and simplifying the workflow.

I tried many strategies for skinning the ships, but found that a simple **radial gradient** got the most bang for my buck. It gave the ships depth and contrast with minimal overhead, preserving the clean look while adding just enough visual flair to make each ship pop.

---

### 💡 UI Feedback Through Shape

I don’t like how real-time strategy games often **clutter the screen** with health bars and energy meters floating above every unit. It pulls attention away from the action. Instead, I made each ship **visually shrink** as it takes damage. This gave players an immediate and intuitive sense of HP, without adding any extra UI elements. It’s subtle, but it fits the minimalist philosophy perfectly.

---

### 🔫 Instant Combat Logic

Initially, I wanted to give the lasers a sense of movement—maybe they would travel over time, requiring prediction and leading the target. But that quickly introduced complexity: hit detection, delays, syncing logic with animation. It didn’t fit the game’s stripped-down spirit. So I made every shot **instantaneous**. There’s no laser state or travel time. The logic simply **finds the closest target in range and applies damage**. Then, as an aside, the game draws a quick line to visualize it. The visuals are **entirely decoupled** from the logic, which keeps everything simple, fast, and easy to reason about.

---

### 🧠 Simple AI

I spent a lot of time thinking about AI for the enemy, but in the end, a *one-liner with random variables* was sufficient. It didn’t need to be smart—it just needed to be fast and unpredictable enough to keep pressure on the player. Anything more would have added bulk without improving the experience.

---

### 🌌 Backgrounds – Minimal and Effective

I experimented with many background ideas: shooting stars, moving stars, parallax stars, blinking stars, terrain, even complex terrain. But none of them struck the right balance between **aesthetic and code weight**. In the end, I settled on a **soft blue mist at the bottom** and a handful of **stars in different colors and sizes**—*all done in five lines of code*. It captured the feeling of space without distracting from the gameplay.

---

### 🔇 The Sound of Silence

I really wanted to put sound into the game. Last year’s game had voice, explosions, laser sounds, and music. But after many long sidequests, I decided to leave it silent. Part of the problem is that when the game is constantly shooting, it ends up just being a *droning sound*—almost as if you could have just slapped a looping backtrack on top and called it a day. And that didn’t feel right either.

---

### 🔐 PvP & the Quest for a Handshake

I also wanted a **player-versus-player option**, and spent an absurd amount of time figuring out how to do the communication handshake between two phones *without* requiring a server. For development, I used a server to pass the handshake back and forth—it worked beautifully and required zero user interaction. That let me focus on testing the PvP logic without worrying about the plumbing.

But to comply with **JS13K rules**, I had to ditch that approach. My first side quest was **QR code handshakes**. JavaScript now includes a QR *reader*, but not a QR *generator*. The available libraries are more than 7k. I spent ages trying to build a small QR generator, but it is just too complex. The best I could do was trim the logic to 5k—mostly by choosing a lower QR level, one character set, and stripping down the handshake payload.

When that failed, I switched to **1D barcodes**. But since 1D barcodes are a magnitude stupider, it required a magnitude more coaxing to get the same amount of information into it and out of it, to the point where it became *cumbersome beyond belief*.

But after what seemed like an eternity, a little voice in my head whispered, *"But nobody's gonna play this game anyway."*

Into the trash went all my research. And now I force the users to use an **Instant Messenger app** to exchange the handshake. And it all seemed dubious to the point where I decided to **not enter the PvP option as part of the competition** and **hide it behind a long press on the intro screen**.
