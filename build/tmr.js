function main() {
  setSignals();
}
async function setSignals() {
  const strength_4g_el = document.getElementById("4g-strength");
  const strength_5g_el = document.getElementById("5g-strength");
  const statsEl = document.createElement("script");
  statsEl.setAttribute("src", "http://192.168.12.1/TMI/v1/gateway?get=all");
  statsEl.setAttribute("crossorigin", "true");
  document.body.appendChild(statsEl);
  statsEl.addEventListener("load", (e) => console.log(e));
  const stats = {
    "4g": {
      bars: 0
    },
    "5g": {
      bars: 0
    }
  };
  stats["5g"].bars = 4;
  stats["4g"].bars = 3;
  strength_4g_el.style.width = stats["4g"].bars / 5 * 100 + "%";
  strength_5g_el.style.width = stats["5g"].bars / 5 * 100 + "%";
}
main();
