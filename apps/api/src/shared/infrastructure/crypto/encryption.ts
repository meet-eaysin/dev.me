import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const tag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${encrypted}:${tag.toString('base64')}`;
}

export function decrypt(ciphertext: string, key: string): string {
  const [ivBase64, encryptedBase64, tagBase64] = ciphertext.split(':');

  if (!ivBase64 || !encryptedBase64 || !tagBase64) {
    throw new Error('Invalid ciphertext format');
  }

  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);

  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
