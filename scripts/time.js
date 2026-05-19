document.addEventListener("DOMContentLoaded", function getCurrentTime() {
  let currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
    timeZoneName: "short",
  });
  document.getElementById("time").innerHTML = currentTime;
  setTimeout(getCurrentTime, 1000);
});
