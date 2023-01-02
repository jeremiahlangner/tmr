function main(): void {
  setSignals();
}

async function setSignals(): Promise<void> {
  const strength_4g_el = document.getElementById('4g-strength');
  const strength_5g_el = document.getElementById('5g-strength');

  // const stats = fetch('http://192.168.12.1/TMI/v1/gateway?get=all').then(res => res.json());
  const statsEl = document.createElement("script");
  statsEl.setAttribute("src", "http://192.168.12.1/TMI/v1/gateway?get=all");
  //  statsEl.type = 'application/json';
  document.body.appendChild(statsEl);
  statsEl.addEventListener('load', e => console.log(e));
}

main();
