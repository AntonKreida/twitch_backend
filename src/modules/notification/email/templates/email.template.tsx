import * as React from 'react';
import { Html, render } from '@react-email/components';

interface IEmailProps {
  text: string;
}

const Email: React.FC<IEmailProps> = ({ text }) => <Html>{text}</Html>;

export const emailTemplate = ({ text }: IEmailProps) =>
  render(<Email text={text} />);
