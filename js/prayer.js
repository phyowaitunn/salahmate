// LOCATION (Pulau Pinang example)
const lat = 5.4141;
const lon = 100.3288;

// ELEMENTS
const nextPrayerEl = document.getElementById("nextPrayer");
const countdownEl = document.getElementById("countdown");
const progressBar = document.getElementById("progressBar");

const fajrEl = document.getElementById("fajr");
const dhuhrEl = document.getElementById("dhuhr");
const asrEl = document.getElementById("asr");
const maghribEl = document.getElementById("maghrib");
const ishaEl = document.getElementById("isha");


// GET PRAYER TIMES
fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=3`)
.then(res => res.json())
.then(data => {

const timings = data.data.timings;

// SHOW TIMES
fajrEl.innerText = timings.Fajr;
dhuhrEl.innerText = timings.Dhuhr;
asrEl.innerText = timings.Asr;
maghribEl.innerText = timings.Maghrib;
ishaEl.innerText = timings.Isha;


// PRAYER ARRAY
const prayers = [
{ name: "Fajr", time: timings.Fajr },
{ name: "Dhuhr", time: timings.Dhuhr },
{ name: "Asr", time: timings.Asr },
{ name: "Maghrib", time: timings.Maghrib },
{ name: "Isha", time: timings.Isha }
];


let nextPrayer = null;
let targetTime = null;
let now = new Date();


// FIND NEXT PRAYER
for (let p of prayers) {

let parts = p.time.split(":");

let prayerTime = new Date();
prayerTime.setHours(parseInt(parts[0]));
prayerTime.setMinutes(parseInt(parts[1]));
prayerTime.setSeconds(0);

if (prayerTime > now) {
nextPrayer = p.name;
targetTime = prayerTime;
break;
}

}


// AFTER ISHA → NEXT DAY FAJR
if (!nextPrayer) {

let parts = prayers[0].time.split(":");

targetTime = new Date();
targetTime.setDate(targetTime.getDate()+1);
targetTime.setHours(parseInt(parts[0]));
targetTime.setMinutes(parseInt(parts[1]));
targetTime.setSeconds(0);

nextPrayer = prayers[0].name;

}


// SHOW NEXT PRAYER
nextPrayerEl.innerText = nextPrayer + " • " + prayers.find(p=>p.name===nextPrayer).time;


// HIGHLIGHT ROW
document.querySelectorAll(".prayer-row").forEach(r => r.classList.remove("active"));

let row = document.getElementById("row-" + nextPrayer.toLowerCase());
if(row) row.classList.add("active");


// COUNTDOWN
function updateCountdown(){

let now = new Date();
let diff = targetTime - now;

let h = Math.floor(diff / 3600000);
let m = Math.floor((diff % 3600000) / 60000);
let s = Math.floor((diff % 60000) / 1000);

countdownEl.innerText = `${h}h ${m}m ${s}s remaining`;


// PROGRESS BAR
let day = 24*60*60*1000;
let progress = ((day - diff) / day) * 100;

progressBar.style.width = progress + "%";

}

updateCountdown();
setInterval(updateCountdown,1000);

})
.catch(err=>{
console.log("Prayer API Error:",err);
});


function checkAzan(){

const now = new Date();

const current =
now.getHours().toString().padStart(2,'0') + ":" +
now.getMinutes().toString().padStart(2,'0');

const prayers = {

Fajr:document.getElementById("fajr").innerText,
Dhuhr:document.getElementById("dhuhr").innerText,
Asr:document.getElementById("asr").innerText,
Maghrib:document.getElementById("maghrib").innerText,
Isha:document.getElementById("isha").innerText

};

for(let p in prayers){

if(prayers[p] === current){

// play azan
document.getElementById("azanSound").play();

// show notification
if(Notification.permission === "granted"){

new Notification("Azan Time",{
body:p + " prayer time has started",
icon:"icon.png"
});

}

}

}

}

setInterval(checkAzan,60000);
