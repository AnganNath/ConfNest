import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true
});

export async function sendMail({to, subject, text}) {
  const info = await mailer.sendMail({ from:'no-reply@confnest.test', to, subject, text });
  console.log('📧 EMAIL (simulated):\n', info.message.toString());
}
