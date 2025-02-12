import * as React from 'react';
import { render } from '@react-email/render';

interface IEmailProps {
  text: string;
}

const Email: React.FC<IEmailProps> = ({ text }) => <div>{text}</div>;

export const templateEmail = (text: string) => render(<Email text={text} />);
