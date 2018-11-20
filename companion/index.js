import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { preferences } from "user-settings";
import * as messaging from "messaging";

//When our settings change in the companion settings page,
//parse the value contained in the Select module and send that
//value to the FitBit side of processing.
//This is mostly template code from either the SDK-Moment example
//or something else in the reference documentation.
settingsStorage.onchange = function(evt) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (evt.key === "colour") {
      let data = JSON.parse(evt.newValue);
      messaging.peerSocket.send(data);
    }
  }
}