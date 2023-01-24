
class RouterDash {
  _settings: any;
  _updateInterval;
  _configuration: any = {};
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

  logout() {
    this._settings = {};
    localStorage.removeItem('tmrouter');
    location.reload();
  }

  login() {
    try {
      if (this._settings.password && this._settings.keepLoggedIn) this.authorize();
    } catch { } // eslint-disable-line

    const loginEl: HTMLInputElement = document.querySelector('input[name="password"]'); // eslint-disable-line
    const keepLoggedInEl: HTMLInputElement = document.querySelector('input[name="save"]'); // eslint-disable-line

    const loginKeyEvent = loginEl.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        this._settings.password = (e.target as HTMLInputElement).value;
        if (keepLoggedInEl.value == 'on') {
          this._settings.keepLoggedIn = true;
          localStorage.setItem('tmrouter', JSON.stringify(this._settings));
        }
        this.authorize();
      }
    });

    const loginButton: HTMLButtonElement = document.querySelector('div[class="login-dlg"] button');
    const loginEvent = loginButton.addEventListener('click', () => {
      this._settings.password = loginEl.value;
      if (keepLoggedInEl.value == 'on') {
        this._settings.keepLoggedIn = true;
        localStorage.setItem('tmrouter', JSON.stringify(this._settings));
      }
      this.authorize();
    });

    const logoutButton: HTMLButtonElement = document.getElementById('logout-button');
    const logoutEvent = logoutButton.addEventListener('click', () => this.logout());
  }

  async authorize() {
    const loginDlg: HTMLElement = document.querySelector('div[class="login-dlg"]'); // eslint-disable-line

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
      .then(user => {
        console.log(user);
        if (!user.auth.token) return;
        this._settings.user = user.auth;
        loginDlg.style.display = 'none';
        this.getConfiguration();
      });
  }

  async request(options: any) {
    if (options.auth && Date.now().valueOf() > this._settings.user.expiration) this.authorize();
  }

  render() {
    const strength_4g_el = document.getElementById('4g-strength');
    const strength_5g_el = document.getElementById('5g-strength');
    strength_4g_el!.style.width = this._stats.signal['4g'].bars / 5 * 100 + '%'; // eslint-disable-line
    strength_5g_el!.style.width = this._stats.signal['5g'].bars / 5 * 100 + '%'; // eslint-disable-line

    this.updateSignals();
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

  updateSignals() {
    for (const signal in this._stats.signal) {
      if (this['_' + signal + 'Stats'] == this._stats.signal[signal]) return;
      const el = document.getElementById(signal + '-stats');
      for (const key in this._stats.signal[signal]) {
        const item = document.createElement('div');
        const label = document.createElement('span');
        label.classList.add('stat-label');
        label.innerText = key;
        const stat = document.createElement('span');
        stat.innerText = this._stats.signal[signal][key];
        item.appendChild(label);
        item.append(': ');
        item.appendChild(stat);
        el!.appendChild(item); // eslint-disable-line
      }
      this['_' + signal + 'Stats'] = this._stats.signal['4g'];
    }
  }

  async getConfiguration() {
    this._configuration = await fetch('http://localhost:3000/configuration', {
      headers: {
        'Authorization': 'Bearer ' + this._settings.user.token
      }
    }).then(res => res.json());
    console.log(this._configuration);
  }

  async refreshStats() {
    this._stats = await fetch('http://localhost:3000/stats').then(res => res.json());
    console.log(this._stats);
    this.render();
  }
}

const dash = new RouterDash(500);

interface Device {
  friendlyName: "5G Gateway",
  hardwareVersion: "R01", // may make more generic; future router models?
  isEnabled: boolean,
  isMeshSupported: boolean,
  macId: string,
  manufacturer: "Arcadyan",
  manufacturerOUI: string,
  model: string,
  name: "5G Gateway",
  role: "gateway",
  serial: string,
  softwareVersion: string,
  type: string,
  updateState: string
}

interface Generic {
  apn: "FBB.HOME", // 'FBB.HOME' for tmobile home internet, 'FBB.BUSINESS' for biz?
  hasIPv6: boolean,
  registration: "registered",
  roaming: boolean
}

interface Signal {
  bands: string[], // enum or union
  bars: number,
  cid: number,
  eNBID: number,
  rsrp: number,
  rsrq: number,
  rssi: number,
  sinr: number
}

interface Gateway {
  device: any,
  signal: {
    '4g': Signal,
    '5g': Signal
  }
}

interface Channel {
  airtimeFairness: boolean,
  channel: "Auto", // union or enum type
  channelBandwidth: "80Mhz" | "Auto", // current known values
  isMUMIMOEnabled: boolean,
  isRadioEnabled: boolean,
  isWMMEnabled: boolean,
  maxClients: number,
  mode: "auto", // other modes?
  ssid: {
    encryptionMode: "AES", // current known values
    encryptionVersion: "WPA2/WPA3", // current known values
    isBroadcastEnabled: boolean,
    ssidName: string,
    steered: boolean,
    wpaKey: string
  },
  transmissionPower: "100%" // current known value
}

interface NetworkConfiguration {
  "2.4ghz": Channel,
  "5.0ghz": Channel
}

