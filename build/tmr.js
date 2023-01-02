function main() {
  setSignals();
}
async function setSignals() {
  const strength_4g_el = document.getElementById("4g-strength");
  const strength_5g_el = document.getElementById("5g-strength");
  const stats = fetch("http://192.168.12.1/TMI/v1/gateway?get=all").then((res) => res.json());
  console.log(stats);
}
main();
