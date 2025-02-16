import { ISessionMetadata } from '@shared';

export interface ISendEmail {
  title: string;
  emailTo: string;
  emailFrom: string;
  subject: string;
  message: string;
  subtitle: string;
  link?: string;
  textLink?: string;
  metadata?: ISessionMetadata;
}
