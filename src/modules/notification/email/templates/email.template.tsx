import * as React from 'react';
import {
  Html,
  Body,
  Tailwind,
  Font,
  Head,
  Text,
  Button,
  render,
  Heading,
} from '@react-email/components';
import { ISessionMetadata } from '@shared';

interface IEmailProps {
  title: string;
  subtitle: string;
  message: string;
  link?: string;
  textLink?: string;
  code?: string;
  metadata?: ISessionMetadata;
}

const Email: React.FC<IEmailProps> = ({
  title,
  link,
  message,
  subtitle,
  textLink,
  metadata,
  code,
}) => (
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
            <Heading className="text-black text-2xl text-left m-0 font-sans font-semibold mb-10">
              {title}
            </Heading>
            <div className="font-sans text-sm font-normal text-black">
              {!!metadata && (
                <div className="my-10">
                  <h1 className="text-black text-xl text-left m-0 font-sans font-semibold my-2">
                    Информация о запросе:{' '}
                  </h1>
                  <ul className="m-0 list-inside list-disc">
                    <li>🌍 Расположение: {metadata.location.country}</li>
                    <li>🤖 Операционная система: {metadata.device.os}</li>
                    <li>🧑‍💻 Браузер: {metadata.device.browser}</li>
                    <li>🪪 IP-адрес: {metadata.ip}</li>
                  </ul>
                </div>
              )}
              <Text>
                {subtitle}
                <br />
                <br />
                {message}
              </Text>
              {!!(link && textLink) && (
                <div className="flex items-center justify-center">
                  <Button
                    href={link}
                    className="my-[65px] bg-[#329DFF] py-4 text-center text-white text-md font-semibold font-sans rounded-md px-10"
                  >
                    {textLink}
                  </Button>
                </div>
              )}
              {!!code && (
                <div className="bg-[#F2FBFF] py-3.5 px-10 flex items-center justify-center">
                  <Text className="font-sans text-2xl">{code}</Text>
                </div>
              )}
              <Text className="font-bold">
                Если вы не делали запрос, пожалуйста, проигнорируйте это
                письмо!!!
              </Text>
            </div>
          </div>
          <div className="bg-[#F2FBFF] py-3.5 px-10 font-sans text-sm">
            <Text>
              Если у вас возникли трудности, вопросы вы можете обратиться в нашу
              техническую поддержку, пожалуйста, свяжитесь с нами по электронной
              почте,{' '}
              <a
                className="text-[#329DFF] font-semibold"
                href="mailto:Kx5wO@example.com"
              >
                Kx5wO@example.com
              </a>
            </Text>
          </div>
        </main>
      </Body>
    </Tailwind>
  </Html>
);

export const emailTemplate = ({
  title,
  subtitle,
  link,
  message,
  textLink,
  metadata,
  code,
}: IEmailProps) =>
  render(
    <Email
      title={title}
      link={link}
      message={message}
      subtitle={subtitle}
      textLink={textLink}
      metadata={metadata}
      code={code}
    />,
  );
