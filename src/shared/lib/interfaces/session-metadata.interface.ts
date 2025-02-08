export interface ILocationInfo {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface IDeviceInfo {
  browser: string;
  os: string;
  type: string;
}

export interface ISessionMetadata {
  ip: string;
  location: ILocationInfo;
  device: IDeviceInfo;
}
