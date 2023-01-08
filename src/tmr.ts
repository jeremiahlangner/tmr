interface Gateway {
  device: any,
  signal: any,
}

class RouterDash {
  _updateInterval;
  _stats: Partial<Gateway> = {};
  _4gStats = {};
  _5gStats = {};
  _deviceDetails = {};

  constructor(interval: number) {
    this.render();
    this._updateInterval = setInterval(this.refreshStats.bind(this), interval);
  }

  render() {
    const strength_4g_el = document.getElementById('4g-strength');
    const strength_5g_el = document.getElementById('5g-strength');
    strength_4g_el!.style.width = this._stats.signal['4g'].bars / 5 * 100 + '%'; // eslint-disable-line
    strength_5g_el!.style.width = this._stats.signal['5g'].bars / 5 * 100 + '%'; // eslint-disable-line

    this.update4g();
    this.update5g();
    this.updateDeviceDetails();
  }

  updateDeviceDetails() {
    if (this._deviceDetails == this._stats.device) return;
    const deviceDetailsEl = document.getElementById('device-details');
    deviceDetailsEl!.innerHTML = ''; // eslint-disable-line
    for (const key in this._stats.device) {
      const item = document.createElement('div');
      const label = document.createElement('span');
      label.classList.add('stat-label');
      label.innerText = key;
      const stat = document.createElement('span');
      stat.innerText = this._stats.device[key];
      item.appendChild(label);
      item.append(': ');
      item.appendChild(stat);
      deviceDetailsEl!.appendChild(item); // eslint-disable-line
    }
    this._deviceDetails = this._stats.device;
  }

  update4g() {
    // Convention to start var with a number?
    if (this._4gStats == this._stats.signal['4g']) return;
    const _4gStatsEl = document.getElementById('4g-stats');
    _4gStatsEl!.innerHTML = ''; // eslint-disable-line
    for (const key in this._stats.signal['4g']) {
      const item = document.createElement('div');
      const label = document.createElement('span');
      label.classList.add('stat-label');
      label.innerText = key;
      const stat = document.createElement('span');
      stat.innerText = this._stats.signal['4g'][key];
      item.appendChild(label);
      item.append(': ');
      item.appendChild(stat);
      _4gStatsEl!.appendChild(item); // eslint-disable-line
    }
    this._4gStats = this._stats.signal['4g'];
  }

  update5g() {
    if (this._5gStats == this._stats.signal['5g']) return;
    // Convention to start var with a number?
    const _5gStatsEl = document.getElementById('5g-stats');
    _5gStatsEl!.innerHTML = ''; // eslint-disable-line
    for (const key in this._stats.signal['5g']) {
      const item = document.createElement('div');
      const label = document.createElement('span');
      label.classList.add('stat-label');
      label.innerText = key;
      const stat = document.createElement('span');
      stat.innerText = this._stats.signal['5g'][key];
      item.appendChild(label);
      item.append(': ');
      item.appendChild(stat);
      _5gStatsEl!.appendChild(item); // eslint-disable-line
    }
    this._5gStats = this._stats.signal['5g'];

  }

  async refreshStats() {
    this._stats = await fetch('http://localhost:3000/stats').then(res => res.json());
    this.render();
  }

}

const dash = new RouterDash(500);
