function main() {
  setSignals();
}
async function setSignals() {
  const strength_4g_el = document.getElementById("4g-strength");
  const strength_5g_el = document.getElementById("5g-strength");
  const statsEl = document.createElement("script");
  statsEl.setAttribute("src", "http://192.168.12.1/TMI/v1/gateway?get=all");
  statsEl.id = "stats";
  statsEl.type = "application/json";
  document.body.appendChild(statsEl);
}
main();
