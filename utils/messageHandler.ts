import dataStore from "../electron/store";
import { ipcRenderer } from "electron";

var previousMessage = "";

const submitMessage = (msg: string) => {
  if (msg.indexOf("ONLINE:") !== -1 && msg.indexOf(",") !== -1) {
    playerHandler.clearPlayers();
    playerHandler.setInLobby(false);
    const who = msg.substring(8).split(", ");
    for (var i = 0; i < who.length; i++) {
      if (who[i].includes("[") && i == who.length - 1) {
        playerHandler.addPlayer(who[i].slice(0, who[i].indexOf("[") - 1)); // Needed for Anti-Spam features in Clients that compact chat by adding [x3] etc.
        break;
      }
      playerHandler.addPlayer(who[i]);
    }
  } else if (msg.indexOf("has joined") !== -1 && msg.indexOf(":") === -1) {
    playerHandler.setInLobby(false);
    playerHandler.addPlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("has quit") !== -1 && msg.indexOf(":") === -1) {
    playerHandler.setInLobby(false);
    playerHandler.removePlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("Sending you") !== -1 && msg.indexOf(":") === -1) {
    playerHandler.setInLobby(false);
    playerHandler.clearPlayers();
    if (dataStore.get("queueNotification") === true) {
      ipcRenderer.send("notification", "You have queued a game!");
    }
    if (dataStore.get("hideIngame") === true) {
      ipcRenderer.send("windowEvent", "show");
    }
  } else if (!playerHandler.getInLobby() && (msg.indexOf("joined the lobby!") !== -1 || msg.indexOf("rewards!") !== -1 || (previousMessage.trim().length === 0 && msg.trim().length === 0)) && msg.indexOf(":") === -1) {
    playerHandler.clearPlayers();
    if (dataStore.get("hideIngame") === true) {
      ipcRenderer.send("windowEvent", "show");
    }
    playerHandler.setInLobby(true);
  } else if ((msg.indexOf("Party Leader:") === 0 || msg.indexOf("Party Members:") === 0 || msg.indexOf("Party Moderators:") === 0) && playerHandler.getInLobby()) {
    const pmsg = msg.substring(msg.indexOf(":") + 2);
    const who = pmsg.split(" ");
    for (var i = 0; i < who.length; i++) {
      if (/^[a-zA-Z0-9_]+$/.test(who[i])) {
        playerHandler.addPlayer(updateStringCondition(who[i]), { force: true, party: true });
      }
    }
    playerHandler.addPlayer(dataStore.get("player"), { force: true, party: true });
  } else if (msg.indexOf("joined the party") !== -1 && msg.indexOf(":") === -1 && playerHandler.getInLobby()) {
    playerHandler.addPlayer(updateStringCondition(msg), { force: true, party: true });
    playerHandler.addPlayer(dataStore.get("player"), { force: true, party: true });
  } else if (msg.indexOf("left the party") !== -1 && msg.indexOf(":") === -1 && playerHandler.getInLobby()) {
    playerHandler.removePlayer(updateStringCondition(msg));
  } else if (msg.indexOf("You left the party") !== -1 && msg.indexOf(":") === -1 && playerHandler.getInLobby()) {
    playerHandler.clearPlayers();
  } else if ((msg.indexOf("The party was disbanded") !== -1 || msg.indexOf("has disbanded the party!") !== -1) && msg.indexOf(":") === -1 && playerHandler.getInLobby()) {
    playerHandler.clearPlayers();
  } else if (msg.toLowerCase().indexOf(dataStore.get("player").toLowerCase()) !== -1 && msg.indexOf("[NPC]") === -1 && msg.indexOf("Party") === -1 && msg.indexOf(":") > -1 && playerHandler.getInLobby()) {
    var player = null;
    if (msg.indexOf("Guild") !== -1 || msg.indexOf("Officer") !== -1) {
      var parsedMessage = msg.slice(0, msg.indexOf(":")).split(" ");
      if (parsedMessage.length === 5) {
        player = parsedMessage[3];
      } else {
        player = parsedMessage[4];
      }
    } else {
      player = msg.slice(0, msg.indexOf(":")).split(" ").slice(-1)[0];
    }
    if (player.toLowerCase() !== dataStore.get("player").toLowerCase()) playerHandler.addPlayer(player, { force: true, mention: true });
  } else if ((msg.indexOf("FINAL KILL") !== -1 || msg.indexOf("disconnected") !== -1) && msg.indexOf(":") === -1) {
    playerHandler.setInLobby(false);
    playerHandler.removePlayer(msg.split(" ")[0]);
  } else if (msg.indexOf("reconnected") !== -1 && msg.indexOf(":") === -1) {
    playerHandler.setInLobby(false);
    playerHandler.addPlayer(msg.split(" ")[0]);
  } else if ((msg.indexOf("The game starts in 1 second!") !== -1 || msg.indexOf("The game is starting in 1 seconds!") !== -1 || msg.indexOf("The game is starting in 0 seconds!") !== -1) && msg.indexOf(":") === -1) {
    if (dataStore.get("hideIngame") === true) {
      ipcRenderer.send("window", "hide");
    }
    if (dataStore.get("gameStartNotification") === true) {
      ipcRenderer.send("notification", "The game has started!");
    }
  }
  previousMessage = msg;
};

/**
 * Check if "[" is present in string
 * If yes, update inputString with the second part of msg string separated by spaces
 * Useful when the user has no rank or no prefix is present in the returned string
 */
const updateStringCondition = (str: string) => {
  var inputString = str.split(" ")[0];
  if (inputString.indexOf("[") !== -1) {
    inputString = str.split(" ")[1];
  }
  return inputString;
};

export default {
  previousMessage,
  submitMessage,
};
