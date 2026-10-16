/* OUR LOVE ADVENTURE — FINAL EDITION
   Offline, single-player pixel adventure. No external assets or libraries.
   Canvas internal resolution: 480 × 270. All world positions are in game pixels.
*/
(() => {
'use strict';
const $ = id => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d', {alpha: false});
ctx.imageSmoothingEnabled = false;
const W=480,H=270,FLOOR=222,KEY='our-love-adventure-final-v4',PREVIOUS_KEY='our-love-adventure-save-v3',OLD_KEY='our-love-adventure-save-v2',ANCIENT_KEY='our-love-adventure-save-v1';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const range=(a,b)=>Math.abs(a-b);
const seeded=(n)=>((Math.sin(n*17.731+5.42)*43758.5453)%1+1)%1;
const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const dot=(x,y,color,size=2)=>rect(x,y,size,size,color);
const textAt=(text,x,y,color='#785b4b',font='bold 10px sans-serif',align='left')=>{ctx.fillStyle=color;ctx.font=font;ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign='left'};

const LEVELS=[
 {id:'garden',title:'First Bloom Garden',emoji:'🌸',number:'01',short:'Find courage among the cherry blossoms',width:1910,exit:1780,goal:5,
  grounds:[[0,590],[648,1194],[1272,1910]],platforms:[[225,184,82,11],[365,172,62,11],[765,188,75,11],[893,175,66,11],[1360,178,77,11]],
  hearts:[[145,190],[265,158],[402,146],[516,196],[734,196],[812,162],[925,149],[1081,191],[1344,193],[1391,152],[1570,194]],keys:[],stars:[],
  objects:[{x:132,type:'sign',label:'Garden sign',lines:[['Garden Sign','Welcome! Move with A / D or the arrow keys. Jump with Space. Collect at least five hearts.'],['Garden Sign','At the pink gate, press E or tap the heart button to travel onward.']]},{x:1047,type:'sign',label:'A little promise',lines:[['A Little Promise','Love is not always walking at the same speed. Sometimes it is choosing to wait.']]}],
  intro:[['Narrator','One morning, the stars of love scattered into tiny hearts across a storybook world.'],['TANYA','Shall we find the hearts together?'],['TAN','Anywhere, as long as we go together.']],
  outro:[['TANYA','The breeze smells like strawberries and spring.'],['TAN','Maybe adventures feel sweeter when we share them.']],
  message:'Collect five hearts, then reach the pink gate.',checkpoint:[42,650,1278]},
 {id:'town',title:'Heartfelt Town',emoji:'🏘️',number:'02',short:'Three keys and a little flower shop',width:1910,exit:1780,goal:5,
  grounds:[[0,620],[674,1155],[1220,1910]],platforms:[[274,191,74,10],[369,188,91,10],[848,191,68,10],[917,174,98,11],[1392,193,92,11]],
  hearts:[[148,194],[318,165],[516,193],[726,190],[885,164],[1055,193],[1278,194],[1463,168],[1631,195]],keys:[[413,161],[966,146],[1447,167]],stars:[],
  objects:[{x:192,type:'sign',label:'Town notice',lines:[['Town Notice','Three golden keys are hidden around town. Collect them and five hearts to unlock the exit.']]},
   {x:771,type:'flower',label:'Flower stall',lines:[['Florist','A small bouquet for two lovely adventurers!'],['TANYA','Let’s carry these flowers into our next chapter.']]},
   {x:1161,type:'sign',label:'Coffee shop',lines:[['Coffee Shop','Today’s special: hot chocolate, cake, and an extra spoonful of happiness.']]}],
  intro:[['Narrator','Beyond the garden sits a small town with glowing windows and friendly shops.'],['TAN','I heard three lost keys open its gate.'],['TANYA','Then let’s explore. Maybe there is cake, too!']],
  outro:[['TAN','Three keys, one bouquet, and so many little moments.'],['TANYA','The sky looks cloudy ahead. Shall we share an umbrella?']],
  message:'Find three keys and five hearts before leaving town.',checkpoint:[42,680,1230]},
 {id:'rain',title:'Promise in the Rain',emoji:'☔',number:'03',short:'Share an umbrella and restore the bridge',width:1910,exit:1780,goal:5,
  grounds:[[0,1064],[1169,1910]],platforms:[[280,188,88,11],[581,184,82,11],[887,186,75,11],[1258,187,87,11],[1544,181,83,11]],
  hearts:[[154,195],[322,161],[565,196],[626,157],[843,191],[922,160],[1200,197],[1291,159],[1575,153],[1690,194]],keys:[],stars:[],
  objects:[{x:186,type:'sign',label:'Rainy-day guide',lines:[['Rainy-day Guide','Find the umbrella and activate both glowing switches.']]},
   {x:748,type:'switch',label:'First rain switch',switchId:'bridge'},
   {x:1367,type:'switch',label:'Second rain switch',switchId:'beacon'}],umbrellaX:465,
  intro:[['Narrator','Soft rain begins to fall, turning puddles into little mirrors.'],['TANYA','I think we need an umbrella.'],['TAN','Then let’s find one. Even rainy days can be beautiful together.']],
  outro:[['TANYA','Look, a rainbow!'],['TAN','Sunny days and rainy days are both worth sharing.']],
  message:'Find the umbrella, activate two switches, and collect five hearts.',checkpoint:[42,530,1185]},
 {id:'forest',title:'Starlit Forest',emoji:'✨',number:'04',short:'Rescue Pudding and light the forest paths',width:2110,exit:1972,goal:6,
  grounds:[[0,856],[988,1374],[1505,2110]],platforms:[[290,187,74,10],[605,179,81,10],[1075,189,85,10],[1570,181,83,11],[1810,176,92,11]],
  hearts:[[150,196],[318,160],[493,193],[660,154],[800,195],[1082,194],[1132,163],[1318,195],[1590,156],[1745,195],[1846,149]],keys:[],stars:[],
  objects:[{x:159,type:'sign',label:'Forest sign',lines:[['Forest Sign','A little dog is lost nearby. Find him, then light both forest bridges.']]},
   {x:461,type:'dog',label:'Rescue the puppy'},
   {x:754,type:'switch',label:'Pudding’s starlight switch',switchId:'forest_bridge',needs:'dogpartner'},
   {x:1253,type:'switch',label:'Forest glade switch',switchId:'forest_glade',needs:'partner'},
   {x:1680,type:'secret',label:'A moonlit letter',secretId:'moonletter',lines:[['TANYA','A tiny glowing envelope!'],['Secret Letter','Every path we walk together becomes a constellation in my heart.'],['TAN','Let’s keep it safe.']] }],
  intro:[['Narrator','Moonlight guides the two adventurers into a softly glowing forest.'],['TANYA','Did you hear that little bark?'],['TAN','Let’s see who needs help. Nobody gets left behind.']],
  outro:[['TANYA','Pudding has found his people!'],['TAN','Next stop: a bridge above the clouds.']],
  message:'Rescue Pudding, light both bridges, and collect six hearts.',checkpoint:[42,510,1008,1530]},
 {id:'sky',title:'Bridge of Clouds',emoji:'🌈',number:'05',short:'Collect star wishes high above the world',width:2210,exit:2070,goal:7,
  grounds:[[0,488],[618,1060],[1190,1683],[1814,2210]],platforms:[[220,179,85,11],[712,185,78,11],[1340,177,93,11],[1908,181,90,11]],
  hearts:[[153,193],[254,153],[418,193],[670,195],[749,159],[918,195],[1250,195],[1372,152],[1545,193],[1844,195],[1955,155]],
  stars:[[329,199],[825,196],[1460,195],[1940,158]],keys:[],
  objects:[{x:156,type:'sign',label:'Cloud travel guide',lines:[['Travel Guide','Light three cloud switches. Collect at least three star wishes along the way.']]},
   {x:426,type:'switch',label:'Wind switch',switchId:'sky_wind',needs:'partner'},
   {x:990,type:'switch',label:'Pudding’s cloud switch',switchId:'sky_cloud',needs:'dog'},
   {x:1612,type:'switch',label:'Star-wish switch',switchId:'sky_wish',needs:'stars'},
   {x:1925,type:'secret',label:'A wish in a bottle',secretId:'wishbottle',lines:[['TANYA','There is a tiny wish bottle in the clouds.'],['Wish Bottle','May we always find each other, no matter how far we wander.'],['TAN','That’s my favorite wish.']]}],
  intro:[['Narrator','The forest opens to islands floating in a sea of clouds.'],['TAN','Some of these bridges only appear when we light their switches.'],['TANYA','Then the three of us will make our own path.']],
  outro:[['TANYA','The stars found their way home! Look, a light in the distance.'],['TAN','A little house is waiting at the end of the rainbow.']],
  message:'Find three star wishes, light three bridges, and collect seven hearts.',checkpoint:[42,635,1208,1832]},
 {id:'home',title:'Our Cozy Home',emoji:'🏡',number:'06',short:'A place to rest, decorate, and dream',width:1290,exit:1180,goal:5,
  grounds:[[0,1290]],platforms:[],hearts:[[130,197],[319,196],[515,195],[795,195],[1024,194],[1110,197]],keys:[],stars:[],
  objects:[{x:142,type:'sign',label:'Welcome home',lines:[['Welcome Home','Three warm lamps are waiting to be switched on.'],['Welcome Home','Find the furniture shop, decorate with at least two items, and light the lamps before leaving.']]},
   {x:263,type:'switch',label:'Living-room light',switchId:'home_living',needs:'partner'},
   {x:432,type:'decor',label:'Furniture shop'},
   {x:625,type:'switch',label:'Kitchen light',switchId:'home_kitchen',needs:'partner'},
   {x:761,type:'wardrobe',label:'Matching outfits'},
   {x:929,type:'switch',label:'Balcony light',switchId:'home_balcony',needs:'dog'},
   {x:1040,type:'secret',label:'The letter behind the bookshelf',secretId:'homesecret',lines:[['TANYA','There is a folded letter behind the bookshelf!'],['Secret Letter','I don’t need a grand adventure every day. Coming home to you is magic enough.'],['TAN','Then let’s keep making ordinary days extraordinary.']]}],
  intro:[['Narrator','At the end of the cloud bridge stands a little home, glowing like a candle.'],['TANYA','We made it! It is still a little empty, though.'],['TAN','Let’s light it up, pick some furniture, and make a cozy corner for Pudding.']],
  outro:[['TANYA','Every light is glowing. It really feels like home now.'],['TAN','And our journey is not over. Let’s go see what lies beyond our doorstep!'],['Pudding','Woof! Our next adventure awaits!']],
  message:'Light three lamps, buy two decorations, and collect five hearts.',checkpoint:[42,350,670,1010]},
 {id:'lake',title:'Moonlight Lake',emoji:'🌙',number:'07',short:'Follow floating lanterns across the water',width:2070,exit:1930,goal:7,
  grounds:[[0,500],[625,1040],[1160,1540],[1655,2070]],platforms:[[200,174,83,11],[735,181,85,11],[1214,177,85,11],[1710,180,83,11]],
  bridgeGaps:[['lake_one',500,625],['lake_two',1040,1160],['lake_three',1540,1655]],
  hearts:[[137,195],[231,150],[396,194],[667,194],[762,155],[949,193],[1194,195],[1247,151],[1412,193],[1682,194],[1745,153],[1895,193]],
  stars:[[333,193],[829,197],[1333,192],[1738,194]],keys:[],
  objects:[{x:143,type:'sign',label:'Lantern keeper',lines:[['Lantern Keeper','Three moonlit bridges sleep beneath the lake. Light the lanterns to cross.'],['Lantern Keeper','Keep your companion close, and gather three moon sparks for the final lantern.']]},
   {x:444,type:'switch',label:'First lake lantern',switchId:'lake_one',needs:'partner'},
   {x:983,type:'switch',label:'Second lake lantern',switchId:'lake_two',needs:'dog'},
   {x:1479,type:'switch',label:'Third lake lantern',switchId:'lake_three',needs:'stars'},
   {x:1800,type:'secret',label:'Message in a paper boat',secretId:'paperboat',lines:[['TANYA','A little paper boat washed up by the shore.'],['Paper Boat','Even across the widest lake, I would always choose the path that leads to you.']]}],
  intro:[['Narrator','Just beyond your new home, a silver lake shimmers under a peach-colored moon.'],['TANYA','The lanterns are out! We can bring their light back.'],['TAN','One little flame at a time.']],
  outro:[['TAN','The entire lake looks like the night sky now.'],['TANYA','And we made every lantern shine, together.']],
  message:'Collect seven hearts and three moon sparks. Light all three lantern bridges.',checkpoint:[42,640,1178,1670]},
 {id:'carnival',title:'Sweetheart Carnival',emoji:'🎡',number:'08',short:'Playful booths, golden tickets, and warm lights',width:2060,exit:1920,goal:7,
  grounds:[[0,2060]],platforms:[[247,174,86,10],[710,183,96,10],[1221,174,95,10],[1680,181,90,10]],
  hearts:[[144,195],[277,148],[450,195],[651,194],[745,155],[910,194],[1090,193],[1254,150],[1420,194],[1705,155],[1850,193]],
  stars:[[350,196],[940,195],[1510,195],[1808,194]],keys:[],
  objects:[{x:139,type:'sign',label:'Carnival guide',lines:[['Carnival Guide','Collect three golden tickets and turn on all three festival booths.'],['Carnival Guide','Take your time! Every light makes this night a little brighter.']]},
   {x:505,type:'switch',label:'Candy booth',switchId:'fair_candy',needs:'partner'},
   {x:1170,type:'switch',label:'Carousel booth',switchId:'fair_carousel',needs:'dog'},
   {x:1770,type:'switch',label:'Fireworks booth',switchId:'fair_fireworks',needs:'stars'},
   {x:1558,type:'secret',label:'Prize-booth postcard',secretId:'carnivalcard',lines:[['TAN','This little postcard was meant for us.'],['Postcard','The best prize is finding someone who makes ordinary nights feel like a festival.']]}],
  intro:[['Narrator','Music drifts across a meadow. A sleepy carnival is ready to open.'],['TANYA','Look at all these candy-colored booths!'],['TAN','Let’s collect the tickets and bring the carnival to life.']],
  outro:[['TANYA','The carousel spins, and the carnival glitters!'],['TAN','My favorite ride is whatever we ride together.']],
  message:'Gather three golden tickets, light three booths, and collect seven hearts.',checkpoint:[42,600,1190,1660]},
 {id:'coast',title:'Lighthouse Promise',emoji:'🌊',number:'09',short:'Light the way home beneath a velvet sky',width:2140,exit:2000,goal:8,
  grounds:[[0,700],[826,1430],[1550,2140]],platforms:[[245,174,81,10],[960,174,82,10],[1620,177,85,10]],
  bridgeGaps:[['coast_pier',700,826],['coast_bridge',1430,1550]],
  hearts:[[137,195],[277,149],[450,194],[619,194],[852,195],[998,150],[1170,194],[1350,194],[1574,194],[1659,151],[1850,193],[1960,194]],
  stars:[[341,195],[1100,195],[1730,194],[1850,153]],keys:[],
  objects:[{x:140,type:'sign',label:'Coastal sign',lines:[['Coastal Sign','The lighthouse has gone dark! Restore both sea bridges and collect three sea stars.'],['Coastal Sign','Then light the lighthouse to guide every lost traveler home.']]},
   {x:628,type:'switch',label:'First wooden pier',switchId:'coast_pier',needs:'partner'},
   {x:1355,type:'switch',label:'Second wooden pier',switchId:'coast_bridge',needs:'dog'},
   {x:1910,type:'switch',label:'Lighthouse beacon',switchId:'coast_beacon',needs:'stars'},
   {x:1800,type:'secret',label:'Seaside message bottle',secretId:'coastletter',lines:[['TANYA','A note from a traveler long ago.'],['Message Bottle','When the sea is dark, be someone else’s light.']]}],
  intro:[['Narrator','At the edge of the world, the sea whispers against a quiet pier.'],['TANYA','The lighthouse is dark. Someone could lose their way.'],['TAN','We have plenty of light to share. Let’s help.']],
  outro:[['TAN','The lighthouse is shining again!'],['TANYA','Now every boat can find its way home. So can we.']],
  message:'Collect eight hearts and three sea stars. Restore two piers and the lighthouse.',checkpoint:[42,840,1568]},
 {id:'forever',title:'The Forever Garden',emoji:'💞',number:'10',short:'One last wish beneath a thousand stars',width:2170,exit:2030,goal:9,
  grounds:[[0,2170]],platforms:[[227,177,90,10],[676,178,85,10],[1065,174,85,10],[1500,175,90,10],[1843,180,80,10]],
  hearts:[[138,195],[262,151],[427,195],[609,195],[712,153],[900,194],[1100,148],[1278,195],[1529,150],[1620,195],[1871,153],[1950,194]],
  stars:[[388,196],[947,195],[1444,193],[1804,195]],keys:[],
  objects:[{x:130,type:'sign',label:'Forever Garden sign',lines:[['Garden Sign','This is the final chapter. Bring the four wishing stones to life.'],['Garden Sign','Collect three memory stars and nine hearts, then meet at the glowing archway.']]},
   {x:354,type:'switch',label:'Stone of Laughter',switchId:'wish_laugh',needs:'partner'},
   {x:787,type:'switch',label:'Stone of Courage',switchId:'wish_courage',needs:'dog'},
   {x:1210,type:'switch',label:'Stone of Home',switchId:'wish_home',needs:'partner'},
   {x:1710,type:'switch',label:'Stone of Forever',switchId:'wish_forever',needs:'stars'},
   {x:1885,type:'secret',label:'The last love letter',secretId:'foreverletter',lines:[['TANYA','There is one more letter tucked into the flowers...'],['Last Letter','Our adventure was never about finding the perfect place. It was about finding someone to share every place with.'],['TAN','And I would choose this adventure with you again. Every time.']]}],
  intro:[['Narrator','Following the lighthouse beam, the three friends find a garden under a sky full of stars.'],['TAN','Ten chapters, countless small miracles.'],['TANYA','Let’s make one final wish together.']],
  outro:[['TANYA','All four wishing stones are glowing.'],['TAN','Our story ends here on the map, but not in our hearts.'],['Pudding','Woof! There is always room for one more adventure.']],
  message:'Find nine hearts and three memory stars, light four wishing stones, and reach the final arch.',checkpoint:[42,590,1100,1610]}
];
const HOME_ITEMS=[
 {id:'sofa',name:'Peach Loveseat',price:55,icon:'🛋️',desc:'A soft spot for two',x:200},
 {id:'rug',name:'Heart-Shaped Rug',price:35,icon:'💗',desc:'A little warmth underfoot',x:355},
 {id:'plant',name:'Window Plant',price:35,icon:'🪴',desc:'Growing together, slowly',x:550},
 {id:'books',name:'Storybook Shelf',price:60,icon:'📚',desc:'A shelf full of adventures',x:844},
 {id:'bed',name:'Pudding’s Dog Bed',price:45,icon:'🐶',desc:'A cozy place for Pudding',x:1015},
 {id:'lamp',name:'Starlight Lamp',price:45,icon:'✨',desc:'A little glow at night',x:720},
];
const CLOTHES=[{id:'daily',name:'Adventure Outfits',description:'Our classic look'},{id:'pajama',name:'Cozy Pajamas',description:'Pastel pink and misty blue'},{id:'stars',name:'Starlight Sweaters',description:'Woven with a sky full of stars'}];
const freshProgress=()=>({collected:[],keys:[],stars:[],switches:[],secrets:[],flower:false,umbrella:false,dogRescued:false,seen:[]});
function freshSave(){return {version:4,highestUnlocked:0,lastLevel:0,levels:{},sound:false,finished:false,started:false,dogUnlocked:false,legacyImported:false,coins:110,furniture:[],outfit:'daily'};}
function adaptSave(raw){
 if(!raw||typeof raw!=='object'||!Number.isInteger(raw.highestUnlocked)||![1,2,3,4].includes(raw.version))return null;
 const base=freshSave(),v=raw.version;
 let completed=raw.highestUnlocked;
 if(v===3 && raw.finished)completed=Math.max(completed,6);
 if(v===2 && raw.finished)completed=Math.max(completed,5);
 // Legacy versions used finished=true for their own final level. Keep chapter 10's ending separate.
 const validLevels={};
 for(const l of LEVELS){
  const p=raw.levels?.[l.id];if(!p||typeof p!=='object')continue;
  const clean=freshProgress();
  for(const k of ['collected','keys','stars','switches','secrets','seen'])if(Array.isArray(p[k]))clean[k]=p[k].filter(v=>typeof v==='string'||Number.isInteger(v)).slice(0,80);
  for(const k of ['flower','umbrella','dogRescued'])clean[k]=Boolean(p[k]);
  validLevels[l.id]=clean;
 }
 return {...base,version:4,started:Boolean(raw.started)||completed>0,highestUnlocked:clamp(completed,0,9),lastLevel:clamp(v<4 && raw.finished?completed:(raw.lastLevel||0),0,9),levels:validLevels,sound:Boolean(raw.sound),finished:v===4&&Boolean(raw.finished),dogUnlocked:Boolean(raw.dogUnlocked)||completed>=4,coins:Math.max(0,Math.min(99999,Number(raw.coins)||110)),furniture:Array.isArray(raw.furniture)?raw.furniture.filter(x=>HOME_ITEMS.some(t=>t.id===x)):[],outfit:CLOTHES.some(c=>c.id===raw.outfit)?raw.outfit:'daily',legacyImported:v<4};
}
function loadSave(){try{for(const key of [KEY,PREVIOUS_KEY,OLD_KEY,ANCIENT_KEY]){const raw=JSON.parse(localStorage.getItem(key));const adapted=adaptSave(raw);if(adapted)return adapted;}}catch(e){console.warn('Could not read saved progress',e)}return freshSave();}
let save=loadSave();
function writeSave(){try{localStorage.setItem(KEY,JSON.stringify(save));}catch(e){console.warn('Local save not available',e)}}
function progress(){const id=LEVELS[game.level].id;if(!save.levels[id])save.levels[id]=freshProgress();return save.levels[id];}

let game={mode:'menu',level:0,player:{x:45,y:200,w:14,h:22,vx:0,vy:0,onGround:false,face:1},partner:{x:14,y:200,face:1},dog:{x:-36,y:200,face:1,wag:0},camera:0,ticks:0,particles:[],jumpBuffer:0,hugTick:-400,checkpoint:45,dialogue:[],dialogueIndex:0,afterDialogue:null};
let buttons={left:false,right:false},jumpPressed=false,toastTimeout=null,lastCheckpointToast=-200;
let audioContext=null;
const SOUND_NOTES={collect:720,jump:380,heart:620,puzzle:530,fail:170,finish:800};
function beep(kind='collect'){
 if(!save.sound)return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!audioContext)audioContext=new Audio();if(audioContext.state==='suspended')audioContext.resume();let now=audioContext.currentTime;
 let osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(SOUND_NOTES[kind]||520,now);osc.frequency.exponentialRampToValueAtTime((SOUND_NOTES[kind]||520)*1.24,now+.09);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.05,now+.01);gain.gain.exponentialRampToValueAtTime(.0001,now+.21);osc.connect(gain).connect(audioContext.destination);osc.start(now);osc.stop(now+.24);}catch(e){}
}
function soundUpdate(){ $('audioLabel').textContent=save.sound?'Sound On':'Sound Off';$('audioBtn').setAttribute('aria-pressed',String(save.sound)); }
soundUpdate();$('audioBtn').addEventListener('click',()=>{save.sound=!save.sound;soundUpdate();writeSave();beep('heart')});
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.add('hidden'),2450)}
function particles(x,y,color,count=9){for(let i=0;i<count;i++)game.particles.push({x,y,dx:(seeded(game.ticks*3+i)-.5)*3.7,dy:-1.3-seeded(i*21+game.ticks)*2.0,life:35+Math.round(seeded(i+10)*15),color,size:seeded(i+61)> .5?2:3})}
function levelState(){return LEVELS[game.level]}
function updateHUD(){
 const L=levelState(),p=progress();$('hudLevel').textContent=`${L.emoji} ${L.number} / ${L.title}`;$('heartCount').textContent=`${p.collected.length} / ${L.goal}`;
 let objective=`Hearts ${p.collected.length}/${L.goal} · Find the gate`,other='';
 if(game.level===1){other=`🗝 ${p.keys.length}/3`;objective=`Keys ${p.keys.length}/3 · Hearts ${p.collected.length}/${L.goal}`;}
 if(game.level===2){other=`✦ ${p.switches.length}/2`;objective=`Umbrella ${p.umbrella?'✓':'–'} · Switches ${p.switches.length}/2`;}
 if(game.level===3){other=`✦ ${p.switches.length}/2`;objective=`Pudding ${p.dogRescued||save.dogUnlocked?'✓':'–'} · Bridges ${p.switches.length}/2`;}
 if(game.level===4){other=`⭐ ${p.stars.length}/3`;objective=`Wishes ${p.stars.length}/3 · Bridges ${p.switches.length}/3`;}
 if(game.level===5){other=`♥ ${save.coins} coins`;objective=`Lights ${p.switches.length}/3 · Furniture ${save.furniture.length}/2`;}
 if(game.level>=6){const need=game.level===9?4:3;other=`✦ ${p.switches.length}/${need}`;objective=`Stars ${p.stars.length}/3 · Switches ${p.switches.length}/${need}`;}
 $('hudObjective').textContent=objective;$('missionText').textContent=L.message;const counter=$('otherCounter');counter.textContent=other;counter.style.display=other?'block':'none';
}
function getCheckpoint(x){const points=levelState().checkpoint;return points.filter(p=>p<=x).pop()||42}
function initLevel(idx,showIntro=true){
 game.level=clamp(idx,0,LEVELS.length-1);game.player={x:45,y:192,w:14,h:22,vx:0,vy:0,onGround:false,face:1};game.partner={x:12,y:194,face:1};game.dog={x:-30,y:200,face:1,wag:0};game.camera=0;game.checkpoint=42;game.ticks=0;game.particles=[];game.jumpBuffer=0;game.mode='playing';save.lastLevel=game.level;save.started=true;writeSave();
 $('menuOverlay').classList.add('hidden');$('panelOverlay').classList.add('hidden');$('hud').classList.remove('hidden');$('touchBar').classList.remove('hidden');$('homeTools').classList.toggle('hidden',game.level!==5);updateHUD();if(showIntro)startDialogue(levelState().intro);
}
function setMenu(){
 game.mode='menu';game.level=clamp(save.lastLevel,0,LEVELS.length-1);game.camera=0;game.player.x=45;game.player.y=195;game.partner.x=16;game.partner.y=195;
 for(const id of ['hud','touchBar','homeTools','panelOverlay','dialogueBox','actionHint'])$(id).classList.add('hidden');$('menuOverlay').classList.remove('hidden');$('continueBtn').classList.toggle('hidden',!save.started);
}
function localStorageAvailable(){try{return typeof localStorage!=='undefined'}catch(e){return false}}
function startDialogue(lines,onComplete){game.dialogue=lines;game.dialogueIndex=0;game.afterDialogue=onComplete||null;game.mode='dialogue';$('dialogueBox').classList.remove('hidden');$('actionHint').classList.add('hidden');showDialogue()}
function showDialogue(){const line=game.dialogue[game.dialogueIndex];if(!line)return;$('dialogueWho').textContent=line[0];$('dialogueText').textContent=line[1];$('dialogueAvatar').textContent=line[0]==='TANYA'?'🌸':line[0]==='TAN'?'🍯':line[0]==='Pudding'?'🐶':line[0].includes('Florist')?'☕':'✦';}
function nextDialogue(){if(game.mode!=='dialogue')return;game.dialogueIndex++;if(game.dialogueIndex<game.dialogue.length){beep('collect');showDialogue();return}$('dialogueBox').classList.add('hidden');const done=game.afterDialogue;game.afterDialogue=null;game.mode='playing';if(done)done()}
$('dialogueNext').addEventListener('click',nextDialogue);
function showPanel(html,mode='panel'){game.mode=mode;$('actionHint').classList.add('hidden');$('panelCard').innerHTML=html;$('panelOverlay').classList.remove('hidden')}
function hidePanel(){if(game.mode==='complete' || game.mode==='ending')return;$('panelOverlay').classList.add('hidden');game.mode=$('menuOverlay').classList.contains('hidden')?'playing':'menu'}
function showMap(){
 const fromGame=game.mode!=='menu';const rows=LEVELS.map((l,i)=>{const unlocked=i<=save.highestUnlocked;const p=save.levels[l.id]||freshProgress();return `<button class="level-row" data-level="${i}" ${unlocked?'':'disabled'}><span class="level-emoji">${l.emoji}</span><span><strong>CHAPTER ${l.number} · ${l.title}</strong><small>${l.short}</small></span><span class="level-status">${unlocked?`${p.collected.length} ♥`:'🔒 Locked'}</span></button>`}).join('');
 showPanel(`<div class="panel-kicker">TEN CHAPTERS · ONE HEART</div><h2>♡ Journey Map</h2><p>Replay any unlocked chapter. Your collectibles and decorations stay saved.</p><div class="level-list">${rows}</div><div class="panel-actions"><button id="mapClose" class="soft-button">Back to ${fromGame?'Game':'Menu'}</button></div>`,'map');$('mapClose').onclick=hidePanel;document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>initLevel(Number(btn.dataset.level))));
}
function showPause(){
 if(game.mode!=='playing')return;
 showPanel(`<div class="panel-kicker">TAKE A LITTLE BREATHER</div><h2>☕ Paused</h2><p>Every step counts. There is no rush when we are together.</p><div class="summary-stats"><div class="stat-block"><b>${progress().collected.length}</b><small>Hearts found</small></div><div class="stat-block"><b>${game.level+1}/${LEVELS.length}</b><small>Chapter</small></div></div><div class="panel-actions"><button id="resumeBtn" class="main-button">▶ Resume</button><button id="panelMapBtn" class="soft-button">◫ Journey Map</button><button id="backMenuBtn" class="soft-button">⌂ Main Menu</button></div>`,'pause');$('resumeBtn').onclick=hidePanel;$('panelMapBtn').onclick=showMap;$('backMenuBtn').onclick=()=>{writeSave();setMenu()};
}
function levelGoalCheck(){
 const L=levelState(),p=progress(),missing=[];
 if(p.collected.length<L.goal)missing.push(`${L.goal-p.collected.length} more heart(s)`);
 if(game.level===1&&p.keys.length<3)missing.push(`${3-p.keys.length} more key(s)`);
 if(game.level===2){if(!p.umbrella)missing.push('Find the umbrella');if(p.switches.length<2)missing.push('Light both rain switches')}
 if(game.level===3){if(!(p.dogRescued||save.dogUnlocked))missing.push('Rescue Pudding');if(p.switches.length<2)missing.push('Light both forest bridges')}
 if(game.level===4){if(p.stars.length<3)missing.push('Find three star wishes');if(p.switches.length<3)missing.push('Light all three cloud bridges')}
 if(game.level===5){if(p.switches.length<3)missing.push('Turn on three lamps');if(save.furniture.length<2)missing.push('Buy two decorations')}
 if(game.level>=6){if(p.stars.length<3)missing.push('Find three glowing stars');const need=game.level===9?4:3;if(p.switches.length<need)missing.push(`Activate ${need-p.switches.length} more switch(es)`)}
 return missing;
}
function finishLevel(){
 if(game.mode==='complete'||game.mode==='ending')return;
 const L=levelState(),p=progress();game.mode='complete';save.highestUnlocked=Math.max(save.highestUnlocked,Math.min(game.level+1,LEVELS.length-1));save.lastLevel=Math.min(game.level+1,LEVELS.length-1);
 if(game.level===LEVELS.length-1)save.finished=true;writeSave();beep('finish');particles(game.player.x+8,game.player.y-8,'#ffdc75',26);
 startDialogue(L.outro,()=>{
  game.mode='complete';
  if(game.level<LEVELS.length-1){
   const bonus=game.level===3?'<div class="unlock-note">🐶 Pudding has joined your adventure!</div>':'';
   showPanel(`<div class="panel-kicker">CHAPTER COMPLETE · ${L.number}</div><h2>♥ ${L.title}</h2><p>Another beautiful chapter. Your next adventure is waiting.</p>${bonus}<div class="summary-stats"><div class="stat-block"><b>${p.collected.length}</b><small>Hearts found</small></div><div class="stat-block"><b>${(p.stars?.length||p.keys?.length||p.switches?.length)||'✓'}</b><small>Extra treasures</small></div></div><div class="panel-actions"><button class="main-button" id="nextLevelBtn">Next Chapter →</button><button class="soft-button" id="finishMenuBtn">Main Menu</button></div>`,'complete');
   $('nextLevelBtn').onclick=()=>initLevel(game.level+1);$('finishMenuBtn').onclick=setMenu;
  }else showEnding();
 });
}
function showEnding(){
 game.mode='ending';const total=LEVELS.reduce((sum,l)=>sum+(save.levels[l.id]?.collected?.length||0),0);
 const secrets=LEVELS.reduce((sum,l)=>sum+(save.levels[l.id]?.secrets?.length||0),0);
 const more=secrets>=7?'<p class="love-quote">💌 Secret ending: You collected every hidden letter. Some love stories are written in tiny moments.</p>':'';
 showPanel(`<div class="panel-kicker">OUR LOVE ADVENTURE · THE END</div><h2>💞 Here’s to Every Tomorrow</h2><p>From the first spring garden to this starlit night, every chapter brought us here.</p><p class="love-quote">“The greatest adventure isn’t finding a perfect world. It’s finding someone who makes every world feel like home.” ♡</p>${more}<div class="summary-stats"><div class="stat-block"><b>10 / 10</b><small>Chapters</small></div><div class="stat-block"><b>${total}</b><small>Hearts found</small></div><div class="stat-block"><b>${secrets} / 7</b><small>Hidden letters</small></div></div><p>🐶 Pudding is cheering for you both. Your story is just beginning.</p><div class="panel-actions"><button class="main-button" id="endingHome">🏡 Visit Our Cozy Home</button><button class="soft-button" id="endingMap">♡ Replay the Journey</button><button class="soft-button" id="endingMenu">⌂ Main Menu</button></div>`,'ending');
 $('endingHome').onclick=()=>initLevel(5,false);$('endingMap').onclick=showMap;$('endingMenu').onclick=setMenu;
}
function shopPanel(){
 if(game.level!==5)return;
 const items=HOME_ITEMS.map(item=>{const owned=save.furniture.includes(item.id),canAfford=save.coins>=item.price;
  return `<button class="shop-item" data-buy="${item.id}" ${owned||!canAfford?'disabled':''}><span class="shop-icon">${item.icon}</span><span class="shop-description"><strong>${item.name}</strong><small>${item.desc}</small></span><span class="shop-price">${owned?'✓ Owned':item.price+' ♥'}</span></button>`}).join('');
 showPanel(`<div class="panel-kicker">OUR COZY HOME · FURNITURE</div><h2>🛋️ Decorate Together</h2><p>Your love coins: <strong>${save.coins} ♥</strong> · Decorations: ${save.furniture.length}/6. Purchased items will appear in their cozy little spots.</p><div class="shop-grid">${items}</div><div class="panel-actions"><button class="soft-button" id="shopClose">Back to Our Home</button></div>`,'shop');
 document.querySelectorAll('[data-buy]').forEach(btn=>btn.addEventListener('click',()=>{const item=HOME_ITEMS.find(item=>item.id===btn.dataset.buy);if(!item||save.furniture.includes(item.id)||save.coins<item.price)return;save.coins-=item.price;save.furniture.push(item.id);writeSave();beep('heart');particles(item.x,180,'#f0bda7',22);updateHUD();shopPanel();toast('♥ Placed: '+item.name)}));$('shopClose').onclick=hidePanel;
}
function wardrobePanel(){
 if(game.level!==5)return;
 const items=CLOTHES.map(item=>`<button class="shop-item" data-outfit="${item.id}"><span class="shop-icon">${item.id==='daily'?'🧸':item.id==='pajama'?'🌙':'⭐'}</span><span class="shop-description"><strong>${item.name}</strong><small>${item.description}</small></span><span class="shop-price">${save.outfit===item.id?'✓ Wearing':'Try on →'}</span></button>`).join('');
 showPanel(`<div class="panel-kicker">TWO LITTLE OUTFITS</div><h2>🧥 Matching Wardrobe</h2><p>Pick a look for today. TAN and TANYA will change together.</p><div class="shop-grid">${items}</div><div class="panel-actions"><button class="soft-button" id="wardrobeClose">Keep Exploring</button></div>`,'wardrobe');
 document.querySelectorAll('[data-outfit]').forEach(btn=>btn.addEventListener('click',()=>{save.outfit=btn.dataset.outfit;writeSave();beep('heart');wardrobePanel();toast('✨ Wearing: '+CLOTHES.find(c=>c.id===save.outfit).name)}));$('wardrobeClose').onclick=hidePanel;
}
function beginNew(){
 if(save.started&&typeof window.confirm==='function'&&!window.confirm('Start a new game? This replaces your current progress. Export your save first if you want to keep it.'))return;
 const sound=save.sound;save=freshSave();save.sound=sound;writeSave();initLevel(0);
}
$('homeShopBtn').onclick=shopPanel;$('homeClothesBtn').onclick=wardrobePanel;
$('startBtn').onclick=beginNew;$('continueBtn').onclick=()=>initLevel(clamp(save.lastLevel,0,save.highestUnlocked),false);$('selectBtn').onclick=showMap;$('mapBtn').onclick=showMap;$('pauseBtn').onclick=showPause;
// Safe, portable save transfer: use Export on a device and Import on another.
$('exportSaveBtn').onclick=()=>{
 const data=JSON.stringify({game:'Our Love Adventure',exportedAt:new Date().toISOString(),save},null,2);
 const blob=new Blob([data],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='our-love-adventure-save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
 toast('Save downloaded. Keep it somewhere safe!');
};
$('importSaveBtn').onclick=()=>$('importSaveInput').click();
$('importSaveInput').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  if(file.size>200000)throw Error('File is too large.');
  const data=JSON.parse(await file.text());const raw=data?.save||data;const imported=adaptSave(raw);
  if(!imported)throw Error('This is not a compatible adventure save.');
  if(!window.confirm('Import this save and replace progress on this browser?'))return;
  save=imported;writeSave();soundUpdate();setMenu();toast('Save imported! Your journey is ready.');
 }catch(error){window.alert('Could not import save: '+error.message)}finally{e.target.value='';}
});
function interact(){
 if(game.mode==='dialogue'){nextDialogue();return}if(game.mode!=='playing')return;
 const L=levelState(),p=progress(),x=game.player.x+7;
 if(range(x,L.exit)<42){const missing=levelGoalCheck();if(missing.length){toast('🚪 '+missing.join(' · '));beep('fail')}else finishLevel();return}
 const near=L.objects.map(o=>({...o,dist:range(x,o.x)})).filter(o=>o.dist<35).sort((a,b)=>a.dist-b.dist)[0];
 if(near){
  if(near.type==='sign'){startDialogue(near.lines);return}
  if(near.type==='decor'){shopPanel();return}
  if(near.type==='wardrobe'){wardrobePanel();return}
  if(near.type==='dog'){
   if(p.dogRescued||save.dogUnlocked){toast('🐶 Pudding wags his tail!');beep('heart');particles(near.x,193,'#ffdca7',7);return}
   p.dogRescued=true;save.dogUnlocked=true;game.dog.x=game.player.x-38;game.dog.y=game.player.y+9;writeSave();beep('heart');particles(near.x,199,'#e1b2aa',20);updateHUD();
   startDialogue([['TANYA','A little puppy! Are you lost?'],['TAN','His name tag says Pudding. Want to come with us?'],['Pudding','Woof! ♥ Pudding has joined the adventure!']]);return;
  }
  if(near.type==='secret'){
   if(p.secrets.includes(near.secretId)){toast('💌 You already found this secret letter.');return}
   p.secrets.push(near.secretId);writeSave();beep('heart');particles(near.x,184,'#fff3cb',20);startDialogue(near.lines);return;
  }
  if(near.type==='flower'){
   if(!p.flower){p.flower=true;writeSave();particles(near.x,170,'#edaaa4');beep('heart');startDialogue(near.lines)}else startDialogue([['Florist','Carry your flowers gently. Your adventure has only begun!']]);return;
  }
  if(near.type==='switch'){
   if(p.switches.includes(near.switchId)){toast('✨ This switch is already glowing.');return}
   const partnerNear=range(game.partner.x+7,near.x)<65,dogNear=range(game.dog.x+6,near.x)<88;
   if(near.needs==='dogpartner'&&!(p.dogRescued||save.dogUnlocked)){toast('🐶 Rescue Pudding first!');return}
   if(near.needs==='dogpartner'&&(!partnerNear||!dogNear)){toast('💕 Wait for TANYA and Pudding!');return}
   if(near.needs==='partner'&&!partnerNear){toast('💕 Wait for TANYA to join you!');return}
   if(near.needs==='dog'&&(!save.dogUnlocked||!dogNear)){toast('🐶 Pudding needs to be nearby!');return}
   if(near.needs==='stars'&&p.stars.length<3){toast('⭐ Find three glowing stars first!');return}
   p.switches.push(near.switchId);writeSave();particles(near.x,160,'#ffdf88',24);beep('puzzle');updateHUD();
   const lines={home_living:'The living room feels warmer already!',home_kitchen:'We can bake cookies here someday!',home_balcony:'Woof! The balcony lamp shines!',bridge:'The bridge is back! We can cross safely.',beacon:'The rain is ending. Look at that light!',forest_bridge:'Pudding helped light the first bridge!',forest_glade:'The forest opened a path for us.',sky_wind:'The first cloud bridge is glowing!',sky_cloud:'Pudding made the next bridge appear!',sky_wish:'The final cloud bridge is ready!',lake_one:'A lantern bridge rises from the lake!',lake_two:'Pudding found another hidden path!',lake_three:'Every lantern is reflecting the stars!',fair_candy:'Sweet treats for everyone!',fair_carousel:'The carousel is spinning again!',fair_fireworks:'Look! A thousand lights in the sky!',coast_pier:'The first pier is safe to cross!',coast_bridge:'The second pier is back!',coast_beacon:'The lighthouse can guide everyone home!',wish_laugh:'May we always have reasons to laugh.',wish_courage:'May we be brave for each other.',wish_home:'May home always feel like this.',wish_forever:'May every tomorrow be a new chapter.'};
   startDialogue([[near.needs==='dog'?'Pudding':'TANYA',lines[near.switchId]||'A warm light awakens.']]);return;
  }
 }
 if(save.dogUnlocked&&range(x,game.dog.x+6)<29&&game.level>=3){toast('🐾 Pudding nuzzles your hand!');beep('heart');particles(game.dog.x,game.dog.y,'#eebfa5',6);return}
 if(range(x,game.partner.x+7)<50){if(game.ticks-game.hugTick<70){toast('♡ We are already together.');return}game.hugTick=game.ticks;particles(x,game.player.y+4,'#f3a8b6',13);beep('heart');toast(['♡ A big, warm hug!','♥ Even ordinary days sparkle with you.','♡ Hand in hand, all the way.'][Math.floor(seeded(game.ticks)*3)]);return}
 toast('Move closer to a sign, switch, letter, or gate, then press E.');
}
function wantJump(){if(game.mode==='dialogue'){nextDialogue();return}if(game.mode==='playing')game.jumpBuffer=8}
function keydown(e){const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='TEXTAREA')return;const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','w','a','d','e','escape','enter'].includes(key))e.preventDefault();if(game.mode==='dialogue'){if(['e',' ','enter'].includes(key)&&!e.repeat)nextDialogue();return}
 if(key==='escape'){if(game.mode==='playing')showPause();else if(['pause','map'].includes(game.mode))hidePanel();return}
 if(game.mode!=='playing')return;if(key==='arrowleft'||key==='a')buttons.left=true;if(key==='arrowright'||key==='d')buttons.right=true;if((key==='arrowup'||key==='w'||key===' ')&&!e.repeat)wantJump();if(key==='e'&&!e.repeat)interact()}
function keyup(e){const key=e.key.toLowerCase();if(key==='arrowleft'||key==='a')buttons.left=false;if(key==='arrowright'||key==='d')buttons.right=false}
document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',()=>{buttons.left=false;buttons.right=false});
function touchHold(id,key){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture?.(e.pointerId);el.classList.add('pressed');buttons[key]=true});const end=e=>{e.preventDefault();buttons[key]=false;el.classList.remove('pressed')};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('lostpointercapture',end)}
touchHold('leftTouch','left');touchHold('rightTouch','right');function tap(id,action){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();el.classList.add('pressed');action()});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>el.classList.remove('pressed')))}tap('jumpTouch',wantJump);tap('actTouch',interact);

function colliders(){const L=levelState();const base=L.grounds.map(([start,end])=>({x:start,y:FLOOR,w:end-start,h:H-FLOOR}));const plats=L.platforms.map(([x,y,w,h])=>({x,y,w,h}));if(game.level===2 && progress().switches.includes('bridge'))base.push({x:1064,y:FLOOR,w:105,h:H-FLOOR});
 const active=progress().switches;
 if(game.level===3){if(active.includes('forest_bridge'))base.push({x:856,y:FLOOR,w:132,h:H-FLOOR});if(active.includes('forest_glade'))base.push({x:1374,y:FLOOR,w:131,h:H-FLOOR})}
 if(game.level===4){if(active.includes('sky_wind'))base.push({x:488,y:FLOOR,w:130,h:H-FLOOR});if(active.includes('sky_cloud'))base.push({x:1060,y:FLOOR,w:130,h:H-FLOOR});if(active.includes('sky_wish'))base.push({x:1683,y:FLOOR,w:131,h:H-FLOOR})}
 for(const [id,from,to] of (L.bridgeGaps||[]))if(active.includes(id))base.push({x:from,y:FLOOR,w:to-from,h:H-FLOOR});
 return base.concat(plats)}
function respawn(){const x=getCheckpoint(game.player.x);game.player.x=x;game.player.y=FLOOR-22;game.player.vy=0;game.player.onGround=false;game.partner.x=x-27;game.partner.y=FLOOR-22;game.dog.x=x-50;game.dog.y=FLOOR-13;if(game.ticks-lastCheckpointToast>60){toast('☁ It is okay! Try again from the last signpost.');lastCheckpointToast=game.ticks;beep('fail')}}
function step(){game.ticks++;if(game.mode!=='playing')return;
 const L=levelState(),p=progress(),pl=game.player;
 const move=(Number(buttons.right)-Number(buttons.left));pl.vx=move*2.62;if(move)pl.face=move;if(game.jumpBuffer>0)game.jumpBuffer--;if(game.jumpBuffer>0 && pl.onGround){pl.vy=-7.45;pl.onGround=false;game.jumpBuffer=0;beep('jump');particles(pl.x+7,pl.y+20,'#fff2d2',5)}
 pl.x=clamp(pl.x+pl.vx,0,L.width-pl.w);const before=pl.y+pl.h;
 pl.vy=Math.min(pl.vy+.38,9);pl.y+=pl.vy;pl.onGround=false;
 if(pl.vy>=0){let landing=Infinity;for(const s of colliders()){const foot=pl.y+pl.h;if(pl.x+pl.w>s.x+2&&pl.x<s.x+s.w-2&&before<=s.y+7&&foot>=s.y&&s.y<landing)landing=s.y}if(landing<Infinity){pl.y=landing-pl.h;pl.vy=0;pl.onGround=true}}
 if(pl.y>H+30){respawn();return}
 // Slow only very slightly in deep puddles: a visual environmental effect, not a punishment.
 if(game.level===2&&pl.onGround&&[295,1008,1530].some(px=>range(px,pl.x)<14)&&game.ticks%9===0)particles(pl.x+7,FLOOR,'#93c6cd',2);
 game.checkpoint=getCheckpoint(pl.x);
 const followX=pl.x-30;const stepX=clamp((followX-game.partner.x)*.16,-3,3);game.partner.x+=stepX;game.partner.y+=(pl.y-game.partner.y)*.13;game.partner.face=stepX>0.05?1:stepX<-.05?-1:game.partner.face;
  if(save.dogUnlocked || (game.level===3&&p.dogRescued)){
   const toX=game.partner.x-23,stepDog=clamp((toX-game.dog.x)*.19,-3.6,3.6);
   game.dog.x+=stepDog;game.dog.y+=(pl.y+10-game.dog.y)*.2;
   game.dog.face=stepDog>0.05?1:stepDog<-0.05?-1:game.dog.face;game.dog.wag=game.ticks;
  }
 game.camera=clamp(pl.x-149,0,L.width-W);
 for(let i=0;i<L.hearts.length;i++){if(p.collected.includes(i))continue;const item=L.hearts[i];if(range(pl.x+pl.w/2,item[0])<16&&range(pl.y+pl.h/2,item[1])<22){p.collected.push(i);save.coins+=12;writeSave();beep('collect');particles(item[0],item[1],'#f5b0ad');updateHUD();toast(`♥ Hearts ${p.collected.length} / ${L.goal}`)}}
 if(game.level===1){for(let i=0;i<L.keys.length;i++){if(p.keys.includes(i))continue;const item=L.keys[i];if(range(pl.x+7,item[0])<18&&range(pl.y+11,item[1])<20){p.keys.push(i);writeSave();beep('puzzle');particles(item[0],item[1],'#f9d68c',14);updateHUD();toast(`🗝 Keys ${p.keys.length} / 3`)}}}
 if(game.level===2&&!p.umbrella&&range(pl.x+7,L.umbrellaX)<17&&range(pl.y+11,192)<27){p.umbrella=true;writeSave();beep('puzzle');particles(L.umbrellaX,188,'#c2aee9');updateHUD();startDialogue([['TAN','An umbrella! No more soggy shoes.'],['TANYA','Let’s share it while we repair the star switches.']])}
 if([4,6,7,8,9].includes(game.level)){for(let i=0;i<L.stars.length;i++){
  if(p.stars.includes(i))continue;const [sx,sy]=L.stars[i];
  if(range(pl.x+7,sx)<17&&range(pl.y+11,sy)<22){p.stars.push(i);writeSave();beep('puzzle');particles(sx,sy,'#fff0ae',12);updateHUD();toast(`⭐ Glowing stars ${p.stars.length} / 3`)}
 }}
 for(let i=game.particles.length-1;i>=0;i--){const q=game.particles[i];q.x+=q.dx;q.y+=q.dy;q.dy+=.058;q.life--;if(q.life<=0)game.particles.splice(i,1)}
 const nearby=[...L.objects.filter(o=>range(pl.x+7,o.x)<38).map(o=>({label:o.label,x:o.x}))];if(range(pl.x+7,L.exit)<44)nearby.push({label:game.level===9?'Finish the adventure':'Next chapter',x:L.exit});if(nearby.length){const first=nearby.sort((a,b)=>range(pl.x-a.x)-range(pl.x-b.x))[0];$('actionHint').textContent=`E / ♥ · ${first.label}`;$('actionHint').classList.remove('hidden')}else{$('actionHint').classList.add('hidden')}
 // Autosave the current chapter and collectibles; returning starts at its safe entrance.
 if(game.ticks%300===0)writeSave();
}
function heart(x,y,color='#e58e91',scale=1){const rows=['0110110','1111111','1111111','0111110','0011100','0001000'];const px=scale;for(let r=0;r<rows.length;r++){for(let c=0;c<rows[r].length;c++)if(rows[r][c]==='1')rect(x+(c-3)*px,y+(r-2)*px,px,px,color)}}
function sparkle(x,y,color='#fff5d4',f=0){dot(x,y-3,color,2);dot(x-3,y,color,2);dot(x+3,y,color,2);dot(x,y+3,color,2);if(f)dot(x,y,color,2)}
function drawCloud(x,y,s=1){rect(x+9*s,y,28*s,5*s,'#fff9e9');rect(x+3*s,y+5*s,44*s,8*s,'#fff9e9');rect(x+0*s,y+10*s,49*s,5*s,'#fff9e9');rect(x+10*s,y+15*s,33*s,2*s,'#f1e4db')}
function drawBackground(){if(game.level===5){drawHomeBackground();return}if(game.level>=6){drawNewChapterBackground();return}if(game.level>=3){drawFantasyBackground();return}const L=levelState(),rain=game.level===2,town=game.level===1;const palettes=rain?['#b7c6c9','#bfcbd0','#c8d3d3','#d4d7d0','#dcd9cf','#e5d6c7']:town?['#b9d9da','#c5ded8','#d5e5d9','#e7e9d7','#f8e7cc','#f8e1c9']:['#c1dedb','#cfe8de','#e1eedc','#f2ebd4','#fae0c9','#f9d6c1'];for(let i=0;i<27;i++)rect(0,i*10,W,11,palettes[Math.min(5,Math.floor(i/5))]);
 const sunX=town?410:rain?405:370,sunY=town?55:rain?48:54;rect(sunX-3,sunY-14,34,31,rain?'#e7e9df':'#fff8d0');rect(sunX+4,sunY-20,20,42,rain?'#e7e9df':'#fff8d0');rect(sunX-9,sunY-7,46,17,rain?'#e7e9df':'#fff8d0');
 for(let i=0;i<13;i++){const cX=Math.round(i*172-game.camera*.18)%700;drawCloud(cX-65,22+(i*29)%58,i%3===0?1.0:.68)}
 if(town){for(let i=0;i<22;i++){const x=Math.round(i*78-game.camera*.27)-90;const hh=40+(i*17)%55;rect(x,170-hh,61,hh+80,i%2?'#abc1b5':'#bbcbbe');for(let d=0;d<3;d++)for(let c=0;c<4;c++)rect(x+9+c*12,177-hh+d*13,5,6,'#dee2ce')}
  for(let i=0;i<17;i++){const x=Math.round(i*132-game.camera*.53)-115;drawBackHouse(x,155+(i%3)*6,i)}
 }else{for(let i=0;i<18;i++){const x=Math.round(i*98-game.camera*.25)-90;const top=160+(i%3)*12;rect(x+10,top,105,H-top,rain?'#a3b6b7':'#b9d0b3');rect(x+33,top-14,65,15,rain?'#a3b6b7':'#b9d0b3');rect(x+56,top-25,24,12,rain?'#a3b6b7':'#b9d0b3')}
  for(let i=0;i<20;i++){const x=Math.round(i*104-game.camera*.48)-90;drawFarTree(x,158+(i%3)*8,rain)}
 }
 // tiny drifting light dots
 if(!rain){for(let i=0;i<23;i++){const x=((i*73-game.camera*.12)%520+520)%520;let y=115+((i*39)%80);dot(x,y,i%2?'#fff5cf':'#f6d9b1',i%3===0?2:1)}}
}
function drawFantasyBackground(){
 const forest=game.level===3;
 const colors=forest?['#546d7e','#657a89','#718c91','#8ca5a0','#abbfb0','#d3d3b7']:['#8199ba','#9ca8c9','#c5b7d1','#edd0cb','#f5ded2','#fbe6cc'];
 for(let i=0;i<27;i++)rect(0,i*10,W,11,colors[Math.min(5,Math.floor(i/5))]);
 if(forest){
  rect(374,29,29,31,'#fff4c7');rect(368,37,41,16,'#fff4c7');rect(369,26,17,10,'#fff4c7');
  for(let i=0;i<52;i++){const x=(i*59-game.camera*.09+800)%W,y=(i*41)%155+8;dot(x,y,i%3===0?'#f7e1b8':'#e4ecdf',i%9===0?2:1)}
  for(let i=0;i<25;i++){const x=Math.round(i*85-game.camera*.27)-90,y=160+(i%4)*8;drawPine(x,y,'#688b8d',.72)}
  for(let i=0;i<21;i++){const x=Math.round(i*116-game.camera*.5)-95,y=196+(i%3)*4;drawPine(x,y,'#658b80',1)}
 }else{
  rect(377,43,50,25,'#fff0cf');rect(387,33,32,44,'#fff0cf');
  for(let i=0;i<30;i++){const x=((i*123-game.camera*.11)%610+610)%610-45,y=13+(i*47)%134;dot(x,y,i%3===0?'#fff4ca':'#fff1e0',i%5===0?2:1)}
  for(let i=0;i<17;i++){const x=Math.round(i*123-game.camera*.28)-80,y=145+(i%4)*9;drawCloud(x,y,.7)}
  for(let i=0;i<14;i++){const x=Math.round(i*158-game.camera*.45)-110,y=194+(i%3)*10;rect(x+5,y+1,100,8,'#bdc4c0');rect(x,y+9,113,5,'#c4cbd0');rect(x+21,y-7,75,10,'#e4ddd2')}
  // pastel pixel rainbow on distant horizon
  for(let k=0;k<4;k++){const c=['#e7b9bf','#ead0ac','#d0d6b7','#b9d3cd'][k];for(let x=341;x<478;x+=3){const yy=171-Math.sin((x-341)/137*Math.PI)*67+k*5;rect(x,yy,3,5,c)}}
 }
}

function drawNewChapterBackground(){
 const palettes={
  6:['#536b86','#677c96','#8194a7','#9facac','#c6c7b6','#d8d2b4'],
  7:['#ae8aa5','#c29bb3','#dab8bc','#f1d2bf','#f9e2c7','#f6ddbd'],
  8:['#5a6c89','#6d839b','#819bab','#9eb3b5','#bbc7bd','#ded5c0'],
  9:['#665f85','#887599','#ab94ae','#cbb7b7','#e4cfc2','#f7dfc7']};
 const c=palettes[game.level];for(let i=0;i<27;i++)rect(0,i*10,W,11,c[Math.min(5,Math.floor(i/5))]);
 const coast=game.level===8,lake=game.level===6,final=game.level===9;
 const moonX=final?370:lake?372:coast?393:408,moonY=final?42:lake?55:coast?56:48;
 rect(moonX-5,moonY-14,32,33,final?'#fff0ca':'#f9e5c3');rect(moonX-11,moonY-6,43,15,final?'#fff0ca':'#f9e5c3');
 for(let i=0;i<65;i++){const x=((i*61-game.camera*.08)%W+W)%W,y=(i*47)%150+10;dot(x,y,i%4?'#f9ebd6':'#fffbd4',i%9===0?2:1)}
 if(lake||coast){rect(0,179,W,53,coast?'#8cabae':'#879daf');for(let i=0;i<26;i++){const x=(i*39-game.camera*.13)%W;rect(x,187+(i*13)%34,22+(i%3)*7,2,coast?'#e4dfc4':'#c8ccd1')}for(let i=0;i<12;i++){const x=i*64-game.camera*.25-35;rect(x,148+(i%3)*5,83,32,coast?'#839d9f':'#798e9c')}}
 else if(final){for(let i=0;i<16;i++){const x=i*75-game.camera*.24;drawPine(x,184,'#998da7',.7)}}
 else {for(let i=0;i<15;i++){const x=i*101-game.camera*.3;rect(x,167-(i%3)*10,87,52,'#bba3b1');rect(x+8,160-(i%3)*10,61,12,'#e6c3c4')}}
}
function drawNewChapterGround(){
 const L=levelState();const colors={6:['#687b83','#b2bfaa'],7:['#b99e99','#f4d7b2'],8:['#748b84','#ced2b3'],9:['#8d8397','#cfc0c7']};const [deep,top]=colors[game.level];
 for(const [a,b] of L.grounds){rect(a,FLOOR,b-a,H-FLOOR,deep);rect(a,FLOOR,b-a,7,top);rect(a,FLOOR+7,b-a,4,'#8a8a8e');for(let x=a;x<b;x+=20){rect(x+4,FLOOR+17,10,2,'#c5b1a2');rect(x+10,FLOOR+29,8,2,'#aaa4a2')}}
 for(const [id,a,b] of (L.bridgeGaps||[]))if(progress().switches.includes(id)){rect(a,FLOOR,b-a,H-FLOOR,'#bda4a5');rect(a,FLOOR,b-a,5,'#fce1ba');for(let x=a+7;x<b;x+=17)rect(x,FLOOR+8,2,H-FLOOR-10,'#927d88')}
 for(const [x,y,w,h] of L.platforms){rect(x,y,w,h,deep);rect(x,y,w,5,top);for(let t=x+9;t<x+w-4;t+=22)rect(t,y+6,8,2,'#e2d0b2')}
}
function paintNewChapterDecor(){
 const L=levelState(),type=game.level;ctx.save();ctx.translate(-Math.round(game.camera),0);
 if(type===6){for(let x=60;x<L.width;x+=178){rect(x-3,192,7,30,'#816f7d');rect(x-12,170,25,20,'#e3bea7');rect(x-15,179,32,11,'#f6dab7');sparkle(x,173,'#fff4cb',game.ticks%30<18)}for(let x=95;x<L.width;x+=107){flower(x,221,'#e6bcc4');rect(x-6,223,19,3,'#9daaa1')}}
 if(type===7){for(let x=40;x<L.width;x+=190){rect(x-25,160,76,62,'#c4949c');rect(x-20,153,66,12,'#fff1d7');rect(x-17,169,60,8,'#e9b7bb');for(let j=0;j<4;j++){rect(x-15+j*14,185,10,17,['#e5d3aa','#bc9fab','#a8c6b2','#e7bcb0'][j]);rect(x-13+j*14,180,6,5,'#fff3d9')}}for(let x=80;x<L.width;x+=125)flower(x,221,'#e9b5b7')}
 if(type===8){for(let x=110;x<L.width;x+=168){rect(x-10,172,9,50,'#8f9185');rect(x-18,167,25,8,'#d9d7c1');rect(x-17,162,23,5,'#ffe3a0');for(let j=0;j<7;j++)rect(x-26+j*7,214,4,4,'#b7c6b4')}rect(1835,94,55,128,'#e1c9af');rect(1827,89,71,9,'#c5a0a5');rect(1847,67,33,24,'#eeddbb');rect(1853,56,21,12,'#fce4b6');for(let x=1844;x<1890;x+=8)rect(x,102,3,110,'#a9ad9e')}
 if(type===9){for(let x=45;x<L.width;x+=171){drawPine(x,222,'#948da8',.63);for(let n=0;n<3;n++)flower(x+28+n*11,221,['#e9a9b4','#d7b2d1','#f1d9a9'][n])}for(let x=150;x<L.width;x+=270){rect(x-28,196,56,26,'#b79aa7');rect(x-22,185,44,16,'#e0b8c0');heart(x,178,'#fff0cc',2)}for(const o of L.objects.filter(o=>o.type==='switch'&&progress().switches.includes(o.switchId))){sparkle(o.x,140,'#fff3bd',true);heart(o.x,158,'#e7b7c4',2)}}
 ctx.restore();
}

function drawPine(x,y,color,scale=1){const w=Math.round(22*scale),h=Math.round(68*scale);rect(x+w/2-2,y-h/3,5,Math.round(h*.55),'#817f79');for(let k=0;k<3;k++){const top=y-h+19*k*scale;const rowW=w+12*k*scale;rect(x-rowW/2+w/2,top,rowW,12*scale,color);rect(x-rowW/2+w/2+4,top-7,Math.max(6,rowW-8),8*scale,k===0?'#83a69a':color)}}
function drawFarTree(x,y,rain){rect(x+19,y-9,8,70,rain?'#879fa0':'#a0aa91');rect(x+7,y-34,31,34,rain?'#8da5a4':'#a6c1a4');rect(x,y-23,45,21,rain?'#8da5a4':'#a6c1a4');rect(x+12,y-44,21,15,rain?'#9eafad':'#b1cead');if(!rain){dot(x+10,y-17,'#fbe1d6',3);dot(x+33,y-33,'#ffebda',3)}}
function drawBackHouse(x,y,i){const b=i%2===0?'#e0c6b0':'#c7d1ba';rect(x,y-40,83,95,b);rect(x+7,y-51,68,13,i%3===0?'#bd9990':'#acaca0');rect(x+17,y-23,16,19,'#fff1d6');rect(x+51,y-23,17,19,'#fff1d6');rect(x+37,y+10,22,36,'#9c8272');rect(x+41,y+13,14,13,'#fce3b6')}
function flower(x,y,c='#e0a9ac'){rect(x,y-5,1,8,'#91a87d');dot(x-2,y-9,c,3);dot(x+1,y-9,c,3);dot(x,y-11,c,2);dot(x,y-8,'#ffeac8',2)}
function bush(x,y){rect(x+2,y-11,19,12,'#779e86');rect(x-2,y-7,26,8,'#87b39a');rect(x+6,y-16,11,7,'#a6c8a0');dot(x+5,y-8,'#e8b2b1',2);dot(x+17,y-10,'#edc3b5',2)}
function drawGround(){if(game.level===5){drawHomeGround();return}if(game.level>=6){drawNewChapterGround();return}if(game.level>=3){drawFantasyGround();return}const L=levelState(),rain=game.level===2,town=game.level===1;for(const [a,b] of L.grounds){rect(a,FLOOR,b-a,H-FLOOR,rain?'#9fa79b':town?'#cfbba3':'#d8b996');rect(a,FLOOR,b-a,7,rain?'#88ac9e':town?'#b8ae96':'#94b98b');rect(a,FLOOR+7,b-a,3,rain?'#83948e':'#ad917d');for(let x=a;x<b;x+=19){rect(x+((Math.floor(x/19)%3)*2),FLOOR+12,10,2,rain?'#879d95':'#b99e83');rect(x+8,FLOOR+29,13,2,rain?'#91a29c':'#c4a587');if((Math.floor(x/19)%4)===0){dot(x+2,FLOOR+2,rain?'#c8d7c4':'#c8d4a2',2)}}}
 if(game.level===2&&progress().switches.includes('bridge')){rect(1064,222,105,45,'#9aa9a2');rect(1064,221,105,5,'#f1cc9a');for(let x=1065;x<1169;x+=12)rect(x,227,2,31,'#7c9392');for(let x=1070;x<1165;x+=23)sparkle(x,214,'#fff1b8')}
 for(const [x,y,w,h] of L.platforms){rect(x,y,w,h,game.level===2?'#a7b6ae':'#d2b49c');rect(x,y,w,4,game.level===2?'#c9d7c5':'#f3d9b6');rect(x+6,y+6,w-12,2,game.level===2?'#81958d':'#ae8d78');for(let i=4;i<w;i+=17)rect(x+i,y+4,2,5,'#f6e1c0')}
}
function drawFantasyGround(){
 const L=levelState(),p=progress(),forest=game.level===3;
 for(const [a,b] of L.grounds){
  rect(a,FLOOR,b-a,H-FLOOR,forest?'#56736e':'#a29eb3');rect(a,FLOOR,b-a,7,forest?'#a5bda6':'#e0d4c2');rect(a,FLOOR+7,b-a,4,forest?'#7d9b85':'#c0bbc4');
  for(let x=a;x<b;x+=20){rect(x+3,FLOOR+18,12,2,forest?'#6d9082':'#898ba1');rect(x+9,FLOOR+31,8,2,forest?'#63847b':'#b4a6af')}
 }
 const bridges=forest?[[856,988,'forest_bridge'],[1374,1505,'forest_glade']]:[[488,618,'sky_wind'],[1060,1190,'sky_cloud'],[1683,1814,'sky_wish']];
 for(const [a,b,key] of bridges)if(p.switches.includes(key)){
  rect(a,FLOOR,b-a,H-FLOOR,forest?'#687f83':'#c7bdc7');rect(a,FLOOR,b-a,7,forest?'#d7d7ae':'#ffeac9');
  for(let x=a+5;x<b;x+=18){rect(x,FLOOR+9,3,29,forest?'#91afa6':'#ad9db6');sparkle(x,FLOOR-10,forest?'#ffedba':'#fff5d9')}
 }
 for(const [x,y,w,h] of L.platforms){rect(x,y,w,h,forest?'#7d9690':'#c7b8b9');rect(x,y,w,5,forest?'#cfdeb7':'#fff0d7');for(let j=7;j<w;j+=19)dot(x+j,y+7,forest?'#5c7b75':'#e2d4ca',3)}
}
function drawTree(x,y,type=0){const trunk='#977b65';rect(x+24,y-33,11,37,trunk);rect(x+18,y-55,22,30,type?'#84a896':'#a9c6a4');rect(x+2,y-44,58,27,type?'#83ada5':'#b6d4b1');rect(x+10,y-65,44,32,type?'#95b7ad':'#c2dcbc');rect(x+17,y-75,30,15,type?'#acc4b5':'#cde3c4');for(let i=0;i<7;i++){const xx=x+7+(i*13)%44,yy=y-57+(i*9)%31;dot(xx,yy,type?'#dee5cf':'#f3c2c6',i%2?2:3)}}
function lamp(x){rect(x-1,166,5,56,'#917f76');rect(x-8,160,19,8,'#8c746d');rect(x-5,168,13,17,'#ffeac3');rect(x-8,167,19,2,'#826b67');rect(x-8,185,19,3,'#826b67');rect(x-9,219,24,3,'#806d69');rect(x-13,151,29,8,'#997e72');rect(x-17,155,37,3,'#b79380')}
function house(x,width=92,variant=0){let y=154;rect(x,y,width,68,variant?'#e7c7ac':'#f1ddc5');rect(x+7,y-13,width-14,13,variant?'#bb9290':'#bdafa1');rect(x+15,y+9,19,23,'#abada9');rect(x+17,y+11,15,18,'#fae4b9');rect(x+width-32,y+10,17,22,'#b4aca0');rect(x+width-30,y+12,13,17,'#fff1ca');rect(x+42,y+37,23,31,'#b28c7e');rect(x+45,y+42,17,11,'#e7c3a6');rect(x+58,y+54,3,3,'#ffe8ad');rect(x+11,y+39,24,4,'#e9b3a3')}
function paintDecor(){if(game.level===5){paintHomeDecor();return}if(game.level>=6){paintNewChapterDecor();return}if(game.level>=3){paintFantasyDecor();return}const L=levelState();ctx.save();ctx.translate(-Math.round(game.camera),0);if(game.level===0){for(let x=72;x<L.width;x+=233){drawTree(x,223,x%3===0?1:0)}for(const [a,b] of L.grounds){for(let x=a+24;x<b;x+=68){if(x%4===0)bush(x,223);else flower(x,221,(x%3===0)?'#f1b7bc':'#f8d7ad')}}
 rect(609,176,2,44,'#ab927b');rect(594,176,27,15,'#fbe9c9');textAt('✿',601,188,'#b98880','12px sans-serif')
 }else if(game.level===1){for(let x=70;x<L.width;x+=205){house(x,92,Math.round(x/205)%2);if(x+132<L.width)lamp(x+130)}for(let x=42;x<L.width;x+=140){flower(x,221,'#e0a6ae');bush(x+20,223)}
 // cafe sign and flower shop decorations
 rect(1120,177,80,26,'#f1e4d1');textAt('COFFEE',1161,196,'#957b6e','bold 10px monospace','center');
 rect(728,183,84,19,'#d3a39c');textAt('FLOWERS',770,196,'#fff7ed','bold 9px monospace','center');for(let j=0;j<5;j++)flower(745+j*11,216,j%2?'#ebc1bd':'#f6d69d');
 }else{for(let x=65;x<L.width;x+=245){drawTree(x,223,1)}for(let x=90;x<L.width;x+=315)lamp(x);for(let x=48;x<L.width;x+=130){bush(x,223)}for(let x of [295,1008,1530]){rect(x-17,220,34,3,'#87abb0');rect(x-10,219,22,2,'#b7d1cd')}}
 ctx.restore()}
function paintFantasyDecor(){
 const L=levelState(),forest=game.level===3;
 ctx.save();ctx.translate(-Math.round(game.camera),0);
 if(forest){
  for(let x=60;x<L.width;x+=186){drawPine(x,224,'#57877a',1.03);drawPine(x+52,224,'#659083',.83)}
  for(const [a,b] of L.grounds)for(let x=a+40;x<b;x+=76){drawMushroom(x,219,x%3===0);if(x%2)flower(x+13,221,'#d5bed5')}
 }else{
  for(const [a,b] of L.grounds){for(let x=a+30;x<b;x+=92){drawSkyFlower(x,218);if(x%2)drawCloud(x+22,181,.42)}}
  for(let i=0;i<15;i++){const x=65+i*150;rect(x,207,15,15,'#c6a6b6');rect(x-4,203,24,5,'#f7dfd1');dot(x+6,198,'#fff1ca',3)}
 }
 ctx.restore();
}

function drawHomeBackground(){
 const colors=['#f3d9be','#f6dec7','#fae8d0','#f5e2ca','#f4e6d6','#faeedd'];
 for(let i=0;i<27;i++)rect(0,i*10,W,10,colors[Math.min(5,Math.floor(i/5))]);
 // Repeating cream wallpaper with a small stitched motif and skirting boards.
 for(let x=0;x<W+30;x+=36){for(let y=27;y<214;y+=36){dot(x+13,y,'#ddc7b1',2);dot(x+18,y+7,'#e4d2c0',2)}}
 rect(0,208,W,14,'#dfc4a9');rect(0,208,W,4,'#f6e4cc');
 for(let x=0;x<W;x+=31)rect(x,236,2,34,'#be9a7f');
}
function drawHomeGround(){
 const L=levelState();rect(0,FLOOR,L.width,H-FLOOR,'#bf9b80');rect(0,FLOOR,L.width,7,'#f1d8b6');rect(0,FLOOR+8,L.width,5,'#9d856f');
 for(let x=0;x<L.width;x+=24){rect(x+2,FLOOR+16,19,2,'#d3b096');rect(x+9,FLOOR+32,13,2,'#ad8b76')}
}
function pixelWindow(x,y,w=76,h=76){
 rect(x-6,y-6,w+12,h+12,'#aa8c80');rect(x,y,w,h,'#9fb8ba');
 rect(x+4,y+4,w-8,h-8,'#9ab1be');rect(x+8,y+18,w-16,18,'#b4bdcc');
 for(let i=0;i<12;i++){dot(x+10+(i*13)%(w-17),y+7+(i*11)%(h-13),'#ffedc6',i%3===0?2:1)}
 rect(x+w/2-2,y,4,h,'#f7e5cf');rect(x,y+h/2-3,w,6,'#f7e5cf');
 rect(x-10,y+h,w+20,7,'#f8e5cd');rect(x+2,y+5,9,h-11,'#e6b8ad');rect(x+w-11,y+5,9,h-11,'#e6b8ad');
}
function drawFurniture(item){const x=item.x,y=FLOOR,kind=item.id;
 if(kind==='sofa'){rect(x-29,y-28,72,27,'#b77e7a');rect(x-25,y-24,64,21,'#dca19a');rect(x-24,y-21,28,14,'#efbcb0');rect(x+8,y-21,27,14,'#edb4a7');rect(x-31,y-20,8,19,'#ac7570');rect(x+39,y-20,8,19,'#ac7570');rect(x-23,y-3,4,5,'#7d685e');rect(x+36,y-3,4,5,'#7d685e');heart(x+4,y-21,'#fff2dc',1)}
 if(kind==='rug'){rect(x-37,y-3,88,6,'#ddb6a9');rect(x-26,y-7,66,5,'#f1d5c5');heart(x+8,y-7,'#d38e8d',1)}
 if(kind==='plant'){rect(x-10,y-17,22,17,'#c89072');rect(x-12,y-19,26,5,'#d7a689');rect(x-2,y-45,5,30,'#73947d');rect(x-21,y-44,25,10,'#83a58a');rect(x-1,y-54,18,13,'#a4c0a0');rect(x-10,y-37,25,10,'#739a81')}
 if(kind==='books'){rect(x-28,y-72,62,70,'#b78f76');rect(x-24,y-67,54,62,'#e9c6a5');for(let n=0;n<3;n++){rect(x-21,y-49+n*19,48,3,'#9c7d6c');for(let b=0;b<5;b++){rect(x-19+b*9,y-65+n*19,6,15,['#a8aea0','#dfaaa5','#d8bc88','#ab99a4','#9bafad'][b])}}}
 if(kind==='bed'){rect(x-22,y-8,50,9,'#bb897a');rect(x-18,y-12,42,9,'#eed7bf');rect(x-14,y-11,33,3,'#cfab97');heart(x+4,y-7,'#d68f91',1)}
 if(kind==='lamp'){rect(x-2,y-54,5,53,'#b59a80');rect(x-20,y-66,41,15,'#ffe3ad');rect(x-13,y-74,27,9,'#f4d29a');rect(x-16,y-1,34,3,'#ab866e');}
}
function paintHomeDecor(){
 ctx.save();ctx.translate(-Math.round(game.camera),0);
 // Hand-drawn connected rooms: lounge, kitchen, bedroom, balcony, and the star door.
 for(let x=0;x<levelState().width;x+=190){rect(x,44,4,179,'#dcc1aa');rect(x+3,44,2,179,'#fff2d9')}
 pixelWindow(77,79,74,63);pixelWindow(548,71,70,63);pixelWindow(963,73,70,64);
 rect(31,119,20,79,'#bfa08a');rect(28,113,26,8,'#efdbbc');rect(25,189,31,32,'#d7ad8e');flower(40,203,'#f1c4c7');
 rect(359,126,60,69,'#cfb093');rect(365,133,48,60,'#e6caaa');rect(369,145,38,3,'#9c8871');rect(377,148,24,17,'#a4b8a5');textAt('HOME',388,143,'#927b6c','bold 8px monospace','center');
 rect(672,121,86,79,'#c89e85');rect(677,127,76,67,'#f6e4c7');rect(690,136,51,19,'#ad9e8c');rect(692,140,47,9,'#e3c4a5');rect(695,163,41,31,'#d4b398');rect(697,168,15,3,'#ad8e80');rect(723,168,11,3,'#ad8e80');
 rect(906,128,44,76,'#b69e8c');rect(909,134,38,66,'#f4e6d1');rect(914,138,29,54,'#dcc6ad');
 for(const o of levelState().objects){if(o.type==='switch'){const enabled=progress().switches.includes(o.switchId);rect(o.x-8,165,16,17,enabled?'#ffedbf':'#b8a4a2');rect(o.x-12,173,24,4,'#ae8e7e');rect(o.x-2,177,4,23,'#b29b8c');if(enabled){rect(o.x-20,153,40,11,'#fff1bf');sparkle(o.x,148,'#fffcda',true)}}}
 rect(1090,119,19,101,'#c6a189');rect(1086,120,26,6,'#eac9ac');rect(1096,125,8,68,'#ffebcf');
 // Little wall paintings.
 rect(480,87,45,39,'#c19784');rect(484,90,37,31,'#fbe2cf');heart(502,105,'#e6a5a1',2);
 rect(813,87,47,42,'#b99b88');rect(817,91,39,33,'#e8dec6');drawPine(826,120,'#8fac97',.33);
 HOME_ITEMS.filter(item=>save.furniture.includes(item.id)).forEach(drawFurniture);
 ctx.restore();
}

function drawMushroom(x,y,large){const c=large?'#d2b8d8':'#c5a6b9';rect(x,y-8,4,9,'#f0dfc7');rect(x-6,y-13,17,6,c);rect(x-3,y-17,11,6,c);dot(x-1,y-15,'#fff3dc',3);if(large)sparkle(x+14,y-16,'#f9e4c4')}
function drawSkyFlower(x,y){rect(x,y-10,2,12,'#789c90');heart(x+1,y-13,'#eed4d3',1)}
function drawSign(o){const x=o.x,y=203;rect(x-1,y-4,3,23,'#a38875');rect(x-19,y-16,38,19,'#e9d5b7');rect(x-18,y-15,36,17,'#fff2d6');rect(x-13,y-11,24,2,'#a98e74');rect(x-10,y-5,18,2,'#d2ae91');}
function drawSwitch(o,on){const x=o.x,y=200;rect(x-8,y,16,22,'#958983');rect(x-10,y,20,4,'#ead3b0');rect(x-5,y-12,10,13,on?'#ffe09f':'#c4bdc5');rect(x-9,y-8,18,5,on?'#f6c87c':'#b0aab9');sparkle(x,y-16,on?'#ffe2a5':'#b8b0c6',on)}
function drawFlowerStall(x){rect(x-29,200,61,22,'#b9947f');rect(x-32,195,67,6,'#f8ddc4');rect(x-25,185,5,10,'#ad917b');rect(x+23,185,5,10,'#ad917b');for(let i=0;i<5;i++)flower(x-20+i*10,198,['#ecb0be','#f2d6a5','#f0c3c4'][i%3]);}
function drawExit(x,y=222,open=false){rect(x-30,y-55,9,55,'#c9a39a');rect(x+22,y-55,9,55,'#c9a39a');rect(x-30,y-72,61,19,'#dcaca1');rect(x-23,y-79,47,13,'#e4b5a8');rect(x-10,y-85,21,7,'#f1cbb7');rect(x-21,y-52,43,50,open?'#f7e8bc':'#f5d8c9');rect(x-19,y-49,39,43,open?'#fff6d9':'#b78e8a');for(let y2=y-45;y2<y-10;y2+=13){dot(x-14,y2,open?'#edce89':'#ead3c2',3);dot(x+13,y2,open?'#edce89':'#ead3c2',3)}heart(x,y-70,open?'#fff7d3':'#f3c0ba',2)}
function drawHomeExit(x,open){
 rect(x-30,110,64,113,'#b98d76');rect(x-24,116,51,104,open?'#f5ddbc':'#d8ac90');rect(x-21,124,44,92,open?'#fff1d0':'#c49a83');rect(x+14,172,6,6,'#f9e6ab');rect(x-39,109,82,8,'#e7c4a3');heart(x,100,open?'#ffedae':'#e9b8b1',2);if(open)sparkle(x,88,'#fff2c5',true);
}
function drawUmbrella(x){rect(x-13,180,26,4,'#aa92b9');rect(x-9,173,18,8,'#bca6d2');rect(x-3,168,7,9,'#d6c6e4');rect(x,181,2,18,'#886c80');rect(x,197,7,2,'#886c80')}
function drawCollectibles(){const L=levelState(),p=progress();ctx.save();ctx.translate(-Math.round(game.camera),0);L.hearts.forEach(([x,y],i)=>{if(p.collected.includes(i))return;const bob=Math.sin(game.ticks*.09+i*3)*2.2;heart(x,y+bob,'#db8589',2);dot(x-4,y-4+bob,'#fff2e8',2);if(i%3===0)sparkle(x+16,y-13+bob,'#ffe8c8',game.ticks%24<12)});
 if(game.level===1)L.keys.forEach(([x,y],i)=>{if(p.keys.includes(i))return;const bob=Math.sin(game.ticks*.08+i*2)*2;rect(x-2,y-4+bob,8,8,'#fff1bd');rect(x,y-2+bob,4,4,'#e3b56f');rect(x+5,y+3+bob,3,11,'#dfb76d');rect(x+5,y+10+bob,7,3,'#dfb76d');rect(x+11,y+10+bob,2,5,'#dfb76d');sparkle(x-8,y-10,'#ffe7a8')});
 if(game.level===2&&!p.umbrella)drawUmbrella(L.umbrellaX);
 for(const o of L.objects){if(o.type==='sign')drawSign(o);else if(o.type==='flower')drawFlowerStall(o.x);else if(o.type==='switch')drawSwitch(o,p.switches.includes(o.switchId))}
 if(game.level>=3){
  for(const o of L.objects){if(o.type==='dog'&&!save.dogUnlocked&&!p.dogRescued){drawDog(o.x-6,207,true)}
   if(o.type==='secret'){const found=p.secrets?.includes(o.secretId);drawSecret(o.x,found)}
  }
  if([4,6,7,8,9].includes(game.level)){L.stars.forEach(([x,y],i)=>{if(p.stars.includes(i))return;sparkle(x,y+Math.sin(game.ticks*.08+i)*2,'#fff3b9',true);dot(x-1,y-1,'#fee9a9',3)})}
 }
 const open=levelGoalCheck().length===0;if(game.level===5)drawHomeExit(L.exit,open);else drawExit(L.exit,FLOOR,open);
 if(game.level===2&&p.umbrella){/* A tiny carried umbrella indicates progress. */}
 ctx.restore()}
function drawSecret(x,found){rect(x-9,195,19,13,found?'#a2a7a0':'#fff0d7');rect(x-7,196,15,10,found?'#87978e':'#f5d4ba');rect(x-5,194,12,2,'#f7e8be');heart(x,193,found?'#b5bea9':'#e39a9e',1);if(!found)sparkle(x+13,180,'#fff0be')}
function drawDog(x,y,sit=false){x=Math.round(x);y=Math.round(y);const wag=Math.sin(game.ticks*.31)>0;
 rect(x+1,y+5,17,8,'#c99970');rect(x+2,y+12,4,4,'#876c5e');rect(x+14,y+12,4,4,'#876c5e');
 rect(x+16,y+2,13,12,'#e5ba8d');rect(x+16,y,4,6,'#947463');rect(x+24,y-1,4,6,'#947463');
 rect(x+26,y+6,5,3,'#f5dec1');dot(x+24,y+4,'#58494c',2);dot(x+30,y+7,'#7c5962',2);
 rect(x-2,y+(wag?4:7),6,3,'#e7b991');rect(x+8,y+5,5,5,'#f2dbc4');
 if(!sit&&Math.sin(game.ticks*.27)>0)rect(x+13,y+13,4,4,'#ae856e');
}
function drawAvatar(x,y,which,face=1,walk=0){x=Math.round(x);y=Math.round(y);const player=which==='player';const hair=player?'#76574e':'#77555d',skin=player?'#f5c9ac':'#f8d1b5',shirt=player?'#d2a98c':'#e8a6aa',shorts=player?'#797d76':'#ab8e95',shoe='#78645e';
 const selected=save.outfit||'daily';const playerShirt=selected==='pajama'?'#a7c0cc':selected==='stars'?'#8a9f9e':shirt;const partnerShirt=selected==='pajama'?'#eeb6ba':selected==='stars'?'#d9b4c4':shirt;const bounce=walk?Math.abs(Math.sin(game.ticks*.28))*.8:0;y=Math.round(y-bounce);rect(x+2,y+1,10,2,hair);rect(x+1,y+3,12,8,hair);rect(x+2,y+5,10,7,skin);rect(x+3,y+7,2,2,'#594c4c');rect(x+9,y+7,2,2,'#594c4c');rect(x+6,y+10,2,1,'#ce9184');
 if(player){rect(x+2,y+1,8,2,'#674d44');dot(x+9,y+2,'#654a44')}else{rect(x+1,y+5,2,9,hair);rect(x+11,y+5,2,9,hair);rect(x+2,y+2,2,2,'#f5d9b4');rect(x+9,y+2,4,3,'#e6c5a0');dot(x+11,y+1,'#eeb3b5',3)}
 rect(x+2,y+12,10,6,player?playerShirt:partnerShirt);if(selected==='stars'){dot(x+6,y+13,'#ffefb5',2);}rect(x+0,y+13,2,5,skin);rect(x+12,y+13,2,5,skin);rect(x+3,y+17,8,3,shorts);
 const legshift=walk?Math.round(Math.sin(game.ticks*.24)*2):0;rect(x+3,y+19,3,3+Math.max(0,legshift),shorts);rect(x+8,y+19,3,3+Math.max(0,-legshift),shorts);rect(x+2,y+21+Math.max(0,legshift),5,2,shoe);rect(x+8,y+21+Math.max(0,-legshift),5,2,shoe);
 if(face<0){/* Sprite is visually symmetric; facing remains part of movement state. */}
}
function paintActors(){ctx.save();ctx.translate(-Math.round(game.camera),0);const pl=game.player,pn=game.partner;const groundShadow=(x,y)=>{rect(x+2,Math.min(FLOOR+3,y+22),12,2,'#957a7544')};groundShadow(pn.x,pn.y);groundShadow(pl.x,pl.y);drawAvatar(pn.x,pn.y,'partner',pn.face,range(pn.x,pl.x-30)>4);drawAvatar(pl.x,pl.y,'player',pl.face,Math.abs(pl.vx)>.1);
 // Personalized name labels. Player is TAN (boy), companion is TANYA (girl).
 const drawName=(name,x,y,color)=>{const center=Math.round(x+7),top=Math.round(y-16),width=name.length*5+9;rect(center-Math.round(width/2),top-2,width,11,'#fff9ede8');textAt(name,center,top+6,color,'bold 8px monospace','center')};
 drawName('TANYA',pn.x,pn.y,'#a05d71');drawName('TAN',pl.x,pl.y,'#806d5b');
 if(game.level>=3&&(save.dogUnlocked||progress().dogRescued))drawDog(game.dog.x,game.dog.y);
 if(game.level===2&&progress().umbrella){const anchorX=pn.x+10,anchorY=pn.y-8;rect(anchorX-10,anchorY,24,4,'#af91bd');rect(anchorX-7,anchorY-5,18,6,'#c2accc');rect(anchorX-3,anchorY-9,10,5,'#d6c3df');rect(anchorX+2,anchorY+4,2,13,'#a38b9a');}
 for(const q of game.particles){rect(q.x,q.y,q.size,q.size,q.color)}
 if(game.ticks-game.hugTick<26){const mid=(pl.x+pn.x)/2+7;heart(mid,Math.min(pn.y,pl.y)-11-Math.sin(game.ticks*.25)*4,'#e698a8',1)}
 ctx.restore()}
function drawRain(){const dark=game.level===2;if(!dark||game.mode==='ending')return;for(let i=0;i<82;i++){const x=((i*61+game.ticks*(1+(i%3)))%W+W)%W;let y=(i*41+game.ticks*(3+(i%2)))%H;rect(x,y,1,i%3===0?6:4,'#e8f1eb77')}for(let i=0;i<20;i++){const x=(i*79+game.ticks*.28)%W;dot(x,225,'#e9e7d688',1)}}
function drawCheckpointMarkers(){ctx.save();ctx.translate(-Math.round(game.camera),0);const c=levelState().checkpoint;for(let i=1;i<c.length;i++){const x=c[i];rect(x,198,3,24,'#a28d7a');rect(x-2,193,20,12,'#f5e6c8');textAt('⌂',x+7,203,'#b68d7e','bold 9px sans-serif','center')}ctx.restore()}
function paintOverlayEdges(){rect(0,H-9,W,9,game.level===5?'#b88f78':game.level===3?'#52796f':game.level===4?'#c3b1be':game.level===2?'#a0b4aa':'#bca183');rect(0,H-7,W,2,game.level===5?'#e8c6a6':game.level===3?'#89aca1':game.level===4?'#e5d2c9':game.level===2?'#97a89e':'#cbb392');for(let i=0;i<9;i++)rect(i*62+Math.round(game.camera*.3)%34,H-6,24,1,'#eee0bf')}
function drawFireflies(){
 if(![3,4,6,8,9].includes(game.level))return;
 for(let i=0;i<24;i++){
  const x=((i*71+Math.sin(game.ticks*.008+i)*13-game.camera*.26)%W+W)%W;
  const y=45+(i*41)%155+Math.sin(game.ticks*.028+i*2)*6;
  dot(x,y,game.level===3?(i%3===0?'#fff2c4':'#bedad2'):'#fff7d9',i%5===0?2:1);
 }
}
function render(){ctx.imageSmoothingEnabled=false;drawBackground();ctx.save();ctx.translate(-Math.round(game.camera),0);drawGround();ctx.restore();paintDecor();drawCheckpointMarkers();drawCollectibles();paintActors();drawRain();drawFireflies();paintOverlayEdges();
 if(game.mode==='ending'){for(let i=0;i<34;i++){let x=(i*83+Math.sin(game.ticks*.013+i)*18)%W,y=15+(i*31)%185;sparkle(x,y,['#fff0ab','#f7c4cb','#e9f2d8'][i%3],true)}}if(game.mode==='menu'){rect(0,0,W,H,'#ffffff12');for(let i=0;i<6;i++){const x=18+i*88,y=42+(i%3)*45;heart(x,y,'#f3c4b8',1)}}}
let last=0,acc=0;function frame(time){let delta=Math.min(100,time-last||16.67);last=time;acc+=delta;let steps=0;while(acc>=16.6667&&steps<6){step();acc-=16.6667;steps++}render();requestAnimationFrame(frame)}
setMenu();requestAnimationFrame(frame);
window.OLA_DEBUG={getState:()=>({mode:game.mode,level:game.level,playerX:game.player.x,playerY:game.player.y,hearts:progress().collected.length,keys:progress().keys.length,switches:progress().switches.length,umbrella:progress().umbrella,dog:save.dogUnlocked,stars:progress().stars?.length,coins:save.coins,furniture:[...save.furniture],outfit:save.outfit,secrets:progress().secrets?.length,save}),jump:wantJump,interact,shopPanel,wardrobePanel,loadLevel:initLevel,step,finishLevel,reset:()=>{save=freshSave();writeSave();setMenu()},moveTo:(x,y=FLOOR-22)=>{game.player.x=x;game.player.y=y;game.player.vy=0;game.player.onGround=true;game.camera=clamp(x-149,0,levelState().width-W)},progress:()=>progress(),levelData:()=>levelState(),colliders:()=>colliders()};
})();
