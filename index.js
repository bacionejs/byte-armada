window.onload = () => {
document.title="Byte Armada";
document.body.style.background="white";
let intro=element("div");
intro.style="position:fixed;inset:0;font:16 monospace;display:flex;align-items:center;justify-content:center;text-align:center;user-select:none";
intro.innerHTML="B y t e<br>A r m a d a<br><br><br><br><br>";
intro.onclick=handshake;
};
