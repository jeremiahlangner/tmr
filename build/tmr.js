let stats;
async function main() {
  setInterval(refreshStats, 1e3);
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
}
main();
