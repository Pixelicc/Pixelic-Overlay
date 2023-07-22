import { ref } from "vue";

var snackbarTimeout;
var snackbarColor;
var snackbarVariant;
var snackbarText;
var snackbarIcon;
const snackbarShown = ref(0);
snackbarShown.value = false;

const sendNotification = (options) => {
  snackbarTimeout = options?.timeout || 2000;
  snackbarColor = options.color;
  snackbarVariant = options?.variant || "outlined";
  snackbarText = options.text;
  snackbarIcon = options?.icon || null;
  snackbarShown.value = true;
};

export { snackbarTimeout, snackbarColor, snackbarVariant, snackbarText, snackbarIcon, snackbarShown, sendNotification };
