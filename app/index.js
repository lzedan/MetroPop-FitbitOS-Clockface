//A lot of these are specific to FitBit OS, and they're even more specific as individual components.
import clock from "clock";
import document from "document";
import { me } from "appbit";
import * as messaging from "messaging";
import * as fs from "fs";
import { preferences } from "user-settings";
import { settingsStorage } from "settings";
import * as util from "../common/utils";
import { goals } from "user-activity";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { me as device } from "device";


// Update the clock every second
//Ideally, this only needs to be updated every minute,
//But in my own experience using this clockface a granularity of seconds
//allowed for that textual feedback on my steps. In other words, it let the
//step count update while I was viewing it on the watchface.
clock.granularity = "seconds";

//Template code for storing our settings
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";
let settings = loadSettings();

//OKAY SO, if the app can't pull up what the primary colour of the theme is,
//it means either there's a glitch with the theme or, more likely, the app is in its
//initial start-up. Given that case, hard-code the fuschia theme into the settings
if(settings.lightC == null){
  settings.lightC = '#e8004e';
  settings.stepC = '#a1063a';
  settings.darkC = '#571d2f';
}

//Then apply the theme using the colours determined by the default or stored values.
applyTheme(settings.lightC, settings.stepC, settings.darkC);

//Over time, the UI elements in the resources/index.gui file increased in number.
//I'm not sure that every line of text needs its own label object, but it makes
//for a practical application here based on positioning of the text elements and
//text styling.
//We're just getting these text objects by their ID in the .gui file, so we can manipulate
//them here using JavaScript.
const timeLabel = document.getElementById("timeLabel");
const dayLabel = document.getElementById("dayLabel");
const goalLabel = document.getElementById("goalLabel");
const bpmLabel = document.getElementById("bpmLabel");
const batteryText = document.getElementById("batteryText");

//Instanstiate an object that listens to updates from the heart rate sensor
var hrm = new HeartRateSensor();

//FUNCTION: applyTheme
//Using input strings for three colours, assign those colours as fill
//for corresponding GUI objects using the same internal color names
//as their class names
function applyTheme(lightC, stepC, darkC) {
  let items = document.getElementsByClassName("lightC");
  items.forEach(function(item) {
    item.style.fill = lightC;
  });
  let items = document.getElementsByClassName("stepC");
  items.forEach(function(item) {
    item.style.fill = stepC;
  });
  let items = document.getElementsByClassName("darkC");
  items.forEach(function(item) {
    item.style.fill = darkC;
  });
  
  //Then store these colours to settings
  settings.lightC = lightC;
  settings.stepC = stepC;
  settings.darkC = darkC;
}

//----Display Accommodations----
//Accommodations are entirely just font sizes.
//"12:46 PM" is gonna look different on a Versa
//compared to its stylistic opposite on Ionic, 08:23
// VERSA Accommodations
if(device.modelName == "Versa") {
  if(preferences.clockDisplay === "12h") {
    timeLabel.style.fontSize = 65;
  }
  else {
    timeLabel.style.fontSize = 90;
  }
  goalLabel.style.fontSize = 36;
  bpmLabel.style.fontSize = 36;
}
//The Ionic also needs its own accommodations if the wearer likes 12 hour time with AM/PM
if((device.modelName == "Ionic") && (preferences.clockDisplay === "12h")){
  timeLabel.style.fontSize = 75;
}


//Get Screens and touch spaces by ID
const timeScreen = document.getElementById("mainClock");
const statScreen = document.getElementById("activiteView");
const clockTouch = document.getElementById("clockTouch");
const statTouch = document.getElementById("statTouch");

//Get the minute-hand analogue rectangle
const minuteRect = document.getElementById("rotateMinRect");

// Update the UI text elements every time the clock passes by a second (as determined by granularity)
clock.ontick = (evt) => {
  let thisDay = evt.date;
  let hours = thisDay.getHours();
  let twelveLabel = " AM";
  
  //Pad the text with AM/PM if the wearer has a preference for 12 hour time
  if (preferences.clockDisplay === "12h") {
    // 12h format
    if(hours >= 12) {
      twelveLabel = " PM";
    }
    hours = util.zeroPad(hours % 12 || 12);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(thisDay.getMinutes());
  
  if (preferences.clockDisplay === "12h") {
    //Format the clock for 12-hour time
    timeLabel.text = `${hours}:${mins}` + twelveLabel;
  }
  else {
    timeLabel.text = `${hours}:${mins}`;
  }
  
  
  //Date and Month text
  let dRaw = new Date();
  let day = dRaw.getDate();
  var weekday = new Array(7);
  weekday[0] = "SUNDAY";
  weekday[1] = "MONDAY";
  weekday[2] = "TUESDAY";
  weekday[3] = "WEDNESDAY";
  weekday[4] = "THURSDAY";
  weekday[5] = "FRIDAY";
  weekday[6] = "SATURDAY";
  
  var month = new Array();
  month[0] = "JAN";
  month[1] = "FEB";
  month[2] = "MAR";
  month[3] = "APR";
  month[4] = "MAY";
  month[5] = "JUN";
  month[6] = "JUL";
  month[7] = "AUG";
  month[8] = "SEP";
  month[9] = "OCT";
  month[10] = "NOV";
  month[11] = "DEC";
  
  
  dayLabel.text = weekday[dRaw.getDay()]+", "+month[dRaw.getMonth()]+" "+util.zeroPad(day);
  
  //Update the step count on the activite page during the clock event
  goalLabel.text = today.local.steps + " steps";
}

goalLabel.text = today.local.steps + " steps";
hrm.onreading = function() {
  bpmLabel.text = hrm.heartRate + " bpm";
}
hrm.start();

const stepBar = document.getElementById("stepBar");

//Screen switching
//We use onmouseup so that the touch event in tandem with the screen switching won't seem so fickle.
//When a touch is detected on one touch rectangle space, hide the associated screen and turn on the opposite screen.
//Nothing is disabled, disabled, or transitioned. Both pages technically are shown simultaneously, it's just that
//Only one of them is set to visible at a time.
clockTouch.onmouseup = function(evt) {
  if(timeScreen.style.visibility == "visible"){
    timeScreen.style.visibility = "hidden";
    stepBar.width = (today.local.steps/goals.steps)*device.screen.width;
    goalLabel.text = today.local.steps + " steps";
    statScreen.style.visibility = "visible";
    batteryText.text = Math.floor(battery.chargeLevel) + "%";
  }
}
statTouch.onmouseup = function(evt) {
  if(statScreen.style.visibility == "visible") {
    statScreen.style.visibility = "hidden";
    timeScreen.style.visibility = "visible";
  }
}



//-----Almost everything below this line is template code-----
//Specific implementations were made to accommodate the colorAssociation function in utils
//As well as using three colours in applyTheme.
//The rest of this block is for saving and loading settings.
messaging.peerSocket.onmessage = evt => {
  var colorList = new Array(2);
  colorList = util.colorAssociation(evt.data);
  applyTheme(evt.data, colorList[0], colorList[1]);
}

// Register for the unload event
me.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return {
      value: '#e8004e',
    }
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}