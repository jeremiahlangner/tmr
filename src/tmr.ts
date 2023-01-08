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
    this._updateInterval = setInterval(this.refreshStats.bind(this), interval);
  }

  render() {
    const strength_4g_el = document.getElementById('4g-strength');
    const strength_5g_el = document.getElementById('5g-strength');
    strength_4g_el!.style.width = this._stats.signal['4g'].bars / 5 * 100 + '%'; // eslint-disable-line
    strength_5g_el!.style.width = this._stats.signal['5g'].bars / 5 * 100 + '%'; // eslint-disable-line

    // Convention to start var with a number?
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

    const deviceDetails = document.getElementById('device-details');
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
      deviceDetails!.appendChild(item); // eslint-disable-line
    }
  }

  async refreshStats() {
    this._stats = await fetch('http://localhost:3000/stats').then(res => res.json());
    this.render();
  }

}

const dash = new RouterDash(500);
