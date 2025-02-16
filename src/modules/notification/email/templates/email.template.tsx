import * as React from 'react';
import {
  Html,
  Body,
  Tailwind,
  Font,
  Head,
  Button,
  render,
} from '@react-email/components';

interface IEmailProps {
  firstName: string;
  lastName: string;
  link: string;
}

const Email: React.FC<IEmailProps> = ({ firstName, lastName, link }) => (
  <Html lang="ru">
    <Head>
      <Font
        fontFamily='"Open Sans", sans-serif'
        fallbackFontFamily={'Arial'}
        webFont={{
          url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
          format: 'truetype',
        }}
      />
    </Head>
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            sans: '"Open Sans", sans-serif',
          },
        },
      }}
    >
      <Body className="max-w-[786px] w-full h-[932px]">
        <main className="w-full flex flex-col justify-between">
          <div className="w-full h-[124px] bg-[#F2FBFF] flex items-center justify-center">
            <img src={`${process.env.API_URL}/static/logo.png`} alt="logo" />
          </div>
          <div className="bg-white px-10 py-11 flex-[1_0_auto]">
            <h1 className="text-black text-2xl text-left m-0 font-sans font-semibold mb-10">
              Добро пожаловать на нашу платформу TvStream!
            </h1>
            <div className="font-sans text-sm font-normal text-black">
              <p>
                {`Привет ${firstName} ${lastName},`}
                <br />
                <br />
                Спасибо что присоединились к нам! Мы рады видеть вас на нашей
                платформе! Сейчас для того чтобы начать пользоваться нашими
                возможностями, пожалуйста, нажмите на кнопку ниже.
              </p>
              <Button
                href={link}
                className="my-[65px] bg-[#329DFF] py-4 text-center text-white text-md font-semibold font-sans rounded-md px-10"
              >
                Подтвердите пожалуйста свой аккаунт
              </Button>
            </div>
          </div>
          <div className="bg-[#F2FBFF] w-full py-3.5 px-10 font-sans text-sm">
            <p>
              Если вы не создали аккаунт, пожалуйста, свяжитесь с нами по
              электронной почте,{' '}
              <a
                className="text-[#329DFF] font-semibold"
                href="mailto:Kx5wO@example.com"
              >
                Kx5wO@example.com
              </a>
            </p>
          </div>
        </main>
      </Body>
    </Tailwind>
  </Html>
);

export const emailTemplate = ({ firstName, lastName, link }: IEmailProps) =>
  render(<Email firstName={firstName} lastName={lastName} link={link} />);
