export function componentDidMount() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else {
    Notification.requestPermission();
  }
}

export function showNotification() {
  new Notification("Hey");
}
