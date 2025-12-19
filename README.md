

---

To open, click ↴  

<a href="//bacionejs.github.io/byte-armada/byte-armada.html" target="_blank"> <img src="https://repository-images.githubusercontent.com/1010433999/f58a1f1b-372c-4ded-975b-bda51425da6c" width="20%" /> </a>


---

Byte Armada is a serverless multiplayer space shooter game using WebRTC and barcodes  

---

<details><summary>Notes</summary>

Syncronization
- channel.send(entity);
- entities[entity.index]=entity;
- if(entity.health<=0)channel.send(entity);
- if(entity.health<=0)entities[entity.index]=undefined;

Handshake (camera/barcodes)
- stripped WebRTC SDP
- stripped datamatrix algorithm
- no stun/turn
- same wifi

</details>

---


