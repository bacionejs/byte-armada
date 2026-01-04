<a href="//bacionejs.github.io/byte-armada/byte-armada.html" target="_blank"> <img src="https://repository-images.githubusercontent.com/1010433999/606308e1-6707-492e-90ef-91831bcb8707" width="80%" /></a>

<details><summary>About</summary>

- **What**: Byte Armada is a serverless multiplayer space shooter game using WebRTC and barcodes 
- **Why**: For size-constrained games
- **How**: To open, click the thumbnail, or download and run from your file manager.

</details><details><summary>Features</summary>

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

