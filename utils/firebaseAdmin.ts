import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Check if Firebase app is not already initialized
if (!admin.apps.length) {
  try {
    // Use environment variables for service account
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount)
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.stack);
    throw new Error('Failed to initialize Firebase Admin');
  }
}

export default admin;
