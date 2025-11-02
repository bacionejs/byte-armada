window.onload = () => {
  document.title = "Byte Armada";
  document.body.style.background = "white";

  let intro = element("div");
  intro.style = `
    position:fixed;
    inset:0;
    font:20px monospace;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    user-select:none;
    line-height:1.4;
  `;

  intro.innerHTML = `
    B y t e<br>
    A r m a d a<br><br><br><br><br>
    <span style="font-size:8px;line-height:1.2;">
      Click to establish multiplayer link<br>
      Requires two Android Chrome phones on the same wifi
    </span>
  `;

  intro.onclick = handshake;
};
