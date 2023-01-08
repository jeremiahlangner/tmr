class RouterDash {
  constructor(interval) {
    this._stats = {};
    this._4gStats = {};
    this._5gStats = {};
    this._deviceDetails = {};
    this._updateInterval = setInterval(this.refreshStats.bind(this), interval);
  }
  render() {
    const strength_4g_el = document.getElementById("4g-strength");
    const strength_5g_el = document.getElementById("5g-strength");
    strength_4g_el.style.width = this._stats.signal["4g"].bars / 5 * 100 + "%";
    strength_5g_el.style.width = this._stats.signal["5g"].bars / 5 * 100 + "%";
    const _4gStatsEl = document.getElementById("4g-stats");
    _4gStatsEl.innerHTML = "";
    for (const key in this._stats.signal["4g"]) {
      const item = document.createElement("div");
      const label = document.createElement("span");
      label.classList.add("stat-label");
      label.innerText = key;
      const stat = document.createElement("span");
      stat.innerText = this._stats.signal["4g"][key];
      item.appendChild(label);
      item.append(": ");
      item.appendChild(stat);
      _4gStatsEl.appendChild(item);
    }
    const _5gStatsEl = document.getElementById("5g-stats");
    _5gStatsEl.innerHTML = "";
    for (const key in this._stats.signal["5g"]) {
      const item = document.createElement("div");
      const label = document.createElement("span");
      label.classList.add("stat-label");
      label.innerText = key;
      const stat = document.createElement("span");
      stat.innerText = this._stats.signal["5g"][key];
      item.appendChild(label);
      item.append(": ");
      item.appendChild(stat);
      _5gStatsEl.appendChild(item);
    }
    const deviceDetails = document.getElementById("device-details");
    for (const key in this._stats.device) {
      const item = document.createElement("div");
      const label = document.createElement("span");
      label.classList.add("stat-label");
      label.innerText = key;
      const stat = document.createElement("span");
      stat.innerText = this._stats.device[key];
      item.appendChild(label);
      item.append(": ");
      item.appendChild(stat);
      deviceDetails.appendChild(item);
    }
  }
  async refreshStats() {
    this._stats = await fetch("http://localhost:3000/stats").then((res) => res.json());
    this.render();
  }
}
const dash = new RouterDash(500);
