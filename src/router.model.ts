// Define router in terms of paths?
//
// config, gateway, etc
//
// ?get= ?set=
//
// payloads
// ...

interface Device {
  friendlyName: '5G Gateway',
  hardwareVersion: 'R01', // may make more generic; future router models?
  isEnabled: boolean,
  isMeshSupported: boolean,
  macId: string,
  manufacturer: 'Arcadyan',
  manufacturerOUI: string,
  model: string,
  name: '5G Gateway',
  role: 'gateway',
  serial: string,
  softwareVersion: string,
  type: string,
  updateState: string
}

interface Generic {
  apn: 'FBB.HOME', // 'FBB.HOME' for tmobile home internet, 'FBB.BUSINESS' for biz?
  hasIPv6: boolean,
  registration: 'registered',
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
  channel: 'Auto', // union or enum type
  channelBandwidth: '80Mhz' | 'Auto', // current known values
  isMUMIMOEnabled: boolean,
  isRadioEnabled: boolean,
  isWMMEnabled: boolean,
  maxClients: number,
  mode: 'auto', // other modes?
  ssid: {
    encryptionMode: 'AES', // current known values
    encryptionVersion: 'WPA2/WPA3', // current known values
    isBroadcastEnabled: boolean,
    ssidName: string,
    steered: boolean,
    wpaKey: string
  },
  transmissionPower: '100%' // current known value
}

interface NetworkConfiguration {
  '2.4ghz': Channel,
  '5.0ghz': Channel
}

export { Device, Signal, Gateway, Channel, NetworkConfiguration, Generic };
