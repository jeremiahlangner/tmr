let stats;
async function main() {
  setInterval(refreshStats, 500);
}
async function refreshStats() {
  stats = await fetch("http://localhost:3000/stats").then((res) => res.json());
  console.log(stats);
  render();
}
function render() {
  const strength_4g_el = document.getElementById("4g-strength");
  const strength_5g_el = document.getElementById("5g-strength");
  strength_4g_el.style.width = stats.signal["4g"].bars / 5 * 100 + "%";
  strength_5g_el.style.width = stats.signal["5g"].bars / 5 * 100 + "%";
  const _4gStats = document.getElementById("4g-stats");
  _4gStats.innerHTML = "";
  for (const key in stats.signal["4g"]) {
    const item = document.createElement("div");
    const label = document.createElement("span");
    label.classList.add("stat-label");
    label.innerText = key;
    const stat = document.createElement("span");
    stat.innerText = stats.signal["4g"][key];
    item.appendChild(label);
    item.appendChild(stat);
    _4gStats.appendChild(item);
  }
  const _5gStats = document.getElementById("5g-stats");
  _5gStats.innerHTML = "";
  for (const key in stats.signal["5g"]) {
    const item = document.createElement("div");
    const label = document.createElement("span");
    label.classList.add("stat-label");
    label.innerText = key;
    const stat = document.createElement("span");
    stat.innerText = stats.signal["5g"][key];
    item.appendChild(label);
    item.appendChild(stat);
    _5gStats.appendChild(item);
  }
}
main();
