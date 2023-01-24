class RouterDash {
  constructor(interval) {
    this._stats = {};
    this._4gStats = {};
    this._5gStats = {};
    this._deviceDetails = {};
    this._authorized = false;
    this._settings = JSON.parse(localStorage.getItem("tmrouter")) || {};
    this.login();
    this.refreshStats();
    this._updateInterval = setInterval(this.refreshStats.bind(this), interval);
  }
  logout() {
    this._settings = {};
    localStorage.removeItem("tmrouter");
    location.reload();
  }
  login() {
    try {
      if (this._settings.password && this._settings.keepLoggedIn)
        this.authorize();
    } catch {
    }
    const loginEl = document.querySelector('input[name="password"]');
    const keepLoggedInEl = document.querySelector('input[name="save"]');
    const loginKeyEvent = loginEl.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this._settings.password = e.target.value;
        if (keepLoggedInEl.value == "on") {
          this._settings.keepLoggedIn = true;
          localStorage.setItem("tmrouter", JSON.stringify(this._settings));
        }
        this.authorize();
      }
    });
    const loginButton = document.querySelector('div[class="login-dlg"] button');
    const loginEvent = loginButton.addEventListener("click", () => {
      this._settings.password = loginEl.value;
      if (keepLoggedInEl.value == "on") {
        this._settings.keepLoggedIn = true;
        localStorage.setItem("tmrouter", JSON.stringify(this._settings));
      }
      this.authorize();
    });
    const logoutButton = document.getElementById("logout-button");
    const logoutEvent = logoutButton.addEventListener("click", () => this.logout());
  }
  async authorize() {
    const loginDlg = document.querySelector('div[class="login-dlg"]');
    await fetch("http://localhost:3000/authorize", {
      method: "POST",
      body: JSON.stringify({
        username: "admin",
        password: this._settings.password
      }),
      headers: {
        "accept": "application/json"
      }
    }).then((res) => res.json()).then((user) => {
      console.log(user);
      if (!user.auth.token)
        return;
      this._settings.user = user.auth;
      loginDlg.style.display = "none";
    });
  }
  async request(options) {
    if (options.auth && Date.now().valueOf() > this._settings.user.expiration)
      this.authorize();
  }
  render() {
    const strength_4g_el = document.getElementById("4g-strength");
    const strength_5g_el = document.getElementById("5g-strength");
    strength_4g_el.style.width = this._stats.signal["4g"].bars / 5 * 100 + "%";
    strength_5g_el.style.width = this._stats.signal["5g"].bars / 5 * 100 + "%";
    this.update4g();
    this.update5g();
    this.updateDeviceDetails();
  }
  updateDeviceDetails() {
    if (this._deviceDetails == this._stats.device)
      return;
    const deviceDetailsEl = document.getElementById("device-details");
    deviceDetailsEl.innerHTML = "";
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
      deviceDetailsEl.appendChild(item);
    }
    this._deviceDetails = this._stats.device;
  }
  update4g() {
    if (this._4gStats == this._stats.signal["4g"])
      return;
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
    this._4gStats = this._stats.signal["4g"];
  }
  update5g() {
    if (this._5gStats == this._stats.signal["5g"])
      return;
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
    this._5gStats = this._stats.signal["5g"];
  }
  async refreshStats() {
    this._stats = await fetch("http://localhost:3000/stats").then((res) => res.json());
    this.render();
  }
}
const dash = new RouterDash(500);
