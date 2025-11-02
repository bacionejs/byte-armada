function game(channel,side){
element("style").textContent="*{margin:0;padding:0;box-sizing:border-box;touch-action:none;user-select:none;}";
document.body.style.background="black";
let {floor,ceil,random,PI,abs,atan2,min}=Math;
let W=min(innerWidth,innerHeight),FPS=30,q=5,buckettime=20,cooldown=FPS,max=5,timers=[],scale=((W/q)/(FPS*buckettime));
let can=element("canvas"),c=can.getContext("2d");can.width=can.height=W;can.addEventListener("pointerdown",click);
let msg=element("div");
let entities,sound=Sound();

let blue={
  hull:gradient(c,[[0,"white"],[.08,"skyblue"],[.4,"blue"],[.6,"white"]]),
  shape:shape([[0,-10,2,-1,3,1,3,-2,5,-2,5,2,6,2,10,-1,9,5,3,10,3,7,2,6,2,7,0,7],[0,8,2,8,0,10]])
};
let red={
  hull:gradient(c,[[0,"white"],[.08,"gold"],[.4,"red"],[.6,"white"]]),
  shape:shape([[0,-1,1,-1,2,4,3,4,4,3,6,2,7,-1,8,-3,8,-7,9,-9,10,-7,10,4,8,7,6,8,3,10,2,7,0,7],[0,9,1,9,0,10]])
};

reset();
function reset(){
timers.forEach(clearInterval);timers=[];
entities=new Array(max*2).fill(undefined);
msg.style.color="lime";msg.textContent="Click horizontally to select position";
timers.push(setInterval(update,1000/FPS));
}

function update(){
c.clearRect(0,0,W,W);c.drawImage(background,0,0);
for(let i=0;i<entities.length;i++){let e=entities[i];if(!e)continue;
  e.y+=e.speed*scale;//move
  if(e.y<=0||e.y>=W){if((i<max&&side=="a")||(i>=max&&side=="b"))speak("you win");reset();return;}//win
  if(e.hp<=0){explode(e);channel.send(JSON.stringify(e));entities[i]=undefined;}//destroy
}
//draw
for(let i=0;i<entities.length;i++){let e=entities[i];if(!e)continue;
  c.save();c.translate(e.x,e.y);c.rotate(e.angle);let s=W/100*e.hp+5;c.scale(s,s);c.lineWidth=1/s;c.strokeStyle=i<max?blue.hull:red.hull;c.stroke(i<max?blue.shape:red.shape);c.restore();
}
//shoot
let teams=[{attackers:[0,max],defenders:[max,max*2]},{attackers:[max,max*2],defenders:[0,max]}];
for(let t=0;t<teams.length;t++){
  let attackers=teams[t].attackers,defenders=teams[t].defenders;
  for(let i=attackers[0];i<attackers[1];i++){
    let a=entities[i];if(!a)continue;
    if(a.cooldown>0){a.cooldown--;continue;}a.cooldown=cooldown;
    let target=null,best=Infinity,maxRange=(a.range*(W/q))**2;
    for(let j=defenders[0];j<defenders[1];j++){
      let d=entities[j];if(!d)continue;
      let dx=d.x-a.x,dy=d.y-a.y,dist=dx*dx+dy*dy;
      if(dist<=maxRange&&dist<best){target=d;best=dist;}
    }
    if(!target)continue;
    target.hp-=1/a.range;a.angle=atan2(target.y-a.y,target.x-a.x)+PI/2;
    c.strokeStyle="lime";c.lineWidth=1;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(target.x,target.y);c.stroke();
  }
}
}//update

function click({clientX:x,clientY:y}){
let e=click.e;
if(!e){
  msg.style.color="orange";msg.textContent="Click vertically to select speed (fast is weak)";
  e={};e.x=x;e.y=W;e.angle=0;
}else if(!e.speed){
  msg.style.color="yellow";msg.textContent="Click vertically to select range (far is weak)";
  y=ceil((W-y)/(W/q));e.speed=-y;e.hp=q/abs(y);
}else{
  msg.style.color="lime";msg.textContent="Click horizontally to select position";
  y=ceil((W-y)/(W/q));let i=emptyslot(side);if(i<0)return;e.range=y;e.i=i;e.w=W;
  entities[i]=e;channel.send(JSON.stringify(e));e=null;
}
click.e=e;
}

channel.onmessage=({data})=>{
let e;try{e=JSON.parse(data);}catch{return;};
if(e.hp<=0){explode(e);entities[e.i]=undefined;return;}//desync-safeguard
e.x=e.x/e.w*W;e.y=0;e.angle=PI;e.speed=-e.speed;
entities[e.i]=e;//add
};

function emptyslot(side){let offset=side=="a"?0:max;let slice=entities.slice(offset,offset+max);let i=slice.indexOf(undefined);return i>=0?i+offset:-1;}

function explode(e){
c.save();c.translate(e.x,e.y);c.fillStyle="gold";c.fill(shape([Array.from({length:40},()=>rnd(40)-20)],1,false));c.restore();
sound.explosion();
}

let background=(()=>{
let c=document.createElement("canvas").getContext("2d");
c.canvas.width=c.canvas.height=W;c.strokeStyle="rgba(0,255,0,0.3)";
for(let i=0;i<=q;i++){let y=floor((i/q)*W);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
return c.canvas;
})();

function speak(text){let synth=window.speechSynthesis;let utter=new SpeechSynthesisUtterance(text);synth.speak(utter);}

function gradient(c,a,type="radial",coords){
let g=type==="linear"?c.createLinearGradient(...(coords||[0,W,0,W-50])):c.createRadialGradient(...(coords||[0,0,0,0,0,1]));
a.forEach(e=>g.addColorStop(...e));
return g;
}

function shape(array,gridsize=20,mirror=true){let p=new Path2D;for(let i of array){for(let x of mirror?[1,-1]:[1]){p.moveTo(x*i[0]/gridsize,i[1]/gridsize);for(let j=2;j<i.length;j+=2)p.lineTo(x*i[j]/gridsize,i[j+1]/gridsize);}}return p;}

function rnd(b,a=0){return floor(random()*(b-a))+a;}

function Sound(){
let auc=new AudioContext(),aubexplosion=noise(1);

function noise(seconds){let b=auc.createBuffer(1,auc.sampleRate*seconds,auc.sampleRate);b.getChannelData(0).forEach((_,i,a)=>a[i]=random()*2-1);return b;}

function explosion(){
let s=auc.createBufferSource();s.buffer=aubexplosion;
let gain=auc.createGain();gain.gain.value=3;gain.gain.linearRampToValueAtTime(0,auc.currentTime+1);
let filter=auc.createBiquadFilter();filter.type="lowpass";filter.frequency.value=300;
s.connect(filter);filter.connect(gain);gain.connect(auc.destination);s.start();
s.onended=function(){s.disconnect();gain.disconnect();filter.disconnect();};
}

return {explosion};
}//sound


}//game
