import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import os from 'os';
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const accesToken = await oauth2Client.getAccessToken();
// Configure email transport avec Mailtrap
const transporter = nodemailer.createTransport(
 {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: "mohameddellai6@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: accesToken,
  }
 }
);

export async function sendVerificationEmail(to, encryptedEmail) {
  const verificationUrl = `https://finflowtn.vercel.app/api/verify-email?code=${encodeURIComponent(encryptedEmail)}`;
  
  const sender = {
    address: "finflowsupport@gmail.com",
    name: "Finflow",
  };
  
  const mailOptions = {
    from: sender,
    to: [to],
    subject: 'Vérifiez votre adresse e-mail',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4F46E5;">Vérification de votre adresse e-mail</h2>
        <p>Merci de vous être inscrit à notre service de gestion de chèques. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vérifier mon adresse e-mail</a>
        </div>
        <p>Si vous n'avez pas créé de compte sur notre plateforme, veuillez ignorer cet e-mail.</p>
        <p>Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      </div>
    `,
    category: "Vérification de compte",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de vérification envoyé:', info);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
} 