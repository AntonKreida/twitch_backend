import { type Request } from 'express';
import * as geoip from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import * as DeviceDetector from 'device-detector-js';

import { ISessionMetadata } from '../interfaces';
import { isDevEnv } from './is-dev.util';

const getIp = (req: Request): string => {
  const ip = isDevEnv
    ? '173.166.164.121' // ip for dev
    : Array.isArray(req.headers['cf-connecting-ip'])
    ? req.headers['cf-connecting-ip'][0]
    : req.headers['cf-connecting-ip'] ||
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]
        : req.ip);

  return ip.replace('::ffff:', '');
};

export const getMetadata = (
  req: Request,
  userAgent: string,
): ISessionMetadata => {
  const deviceDetector = new DeviceDetector();
  const ipAddress = getIp(req);

  const geoData = geoip.lookup(getIp(req));

  const country = countries.getName(geoData?.country || 'RU', 'en', {
    select: 'official',
  });

  const { client, os, device } = deviceDetector.parse(userAgent);

  return {
    ip: ipAddress,
    location: {
      city: geoData?.city ?? 'Unknown',
      country: country ?? 'Unknown',
      latitude: geoData?.ll[0] ?? 0,
      longitude: geoData?.ll[1] ?? 0,
    },
    device: {
      browser: client?.name ?? 'Unknown',
      os: os?.name ?? 'Unknown',
      type: device?.type ?? 'Unknown',
    },
  };
};
