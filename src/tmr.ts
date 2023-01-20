interface Gateway {
  device: any,
  signal: any,
}

class RouterDash {
  _settings: any;
  _updateInterval;
  _stats: Partial<Gateway> = {};
  _4gStats = {};
  _5gStats = {};
  _deviceDetails = {};
  _authorized = false;

  constructor(interval: number) {
    this._settings = JSON.parse(localStorage.getItem('tmrouter') as string) || {};

    this.login();
    this.refreshStats();
    this._updateInterval = setInterval(this.refreshStats.bind(this), interval);
  }

  login() {
    try {
      if (this._settings.password && this._settings.keepLoggedIn) this.authorize();
    } catch { }

    const loginEl: HTMLInputElement = document.querySelector('input[name="password"]'); // eslint-disable-line
    const keepLoggedInEl: HTMLInputElement = document.querySelector('input[name="save"]'); // eslint-disable-line
    console.log(loginEl, keepLoggedInEl);

    const loginKeyEvent = loginEl.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        this._settings.password = e.target.value; // eslint-disable-line
        if (keepLoggedInEl.value == true) localStorage.setItem('tmrouter', JSON.stringify(this._settings));
        this.authorize();
      }
    });

    console.log(this._settings);
    const loginButton = document.querySelector('div[class="login-dlg"] button');
    const loginEvent = loginButton.addEventListener('click', () => {
      console.log(this._settings);
      this._settings.password = loginEl.value;
      if (keepLoggedInEl.value == true) localStorage.setItem('tmrouter', JSON.stringify(this._settings));
      this.authorize();
    });
  }

  async authorize() {
    const loginDlg = document.querySelector('div[class="login-dlg"]');

    await fetch('http://localhost:3000/authorize', {
      method: 'POST',
      body: JSON.stringify({
        username: "admin",
        password: this._settings.password
      }),
      headers: {
        'accept': 'application/json'
      }
    }).then(res => res.json())
      .then(user => this._settings.user = user);
  }

  async request(options: any) {
    if (options.auth && Date.now().valueOf() > this._settings.user.expiration) this.authorize();
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
