import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = 'HS256';

export async function generateToken(account) {
  if (!account || !account.user || !account.user.id || !account.id) {
    throw new TypeError('Invalid account object');
  }
  console.log(account)
  return new SignJWT({ id: account.user.id, accountId: account.id })
    .setProtectedHeader({ alg })
    .setExpirationTime('100h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}