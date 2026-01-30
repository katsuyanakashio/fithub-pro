import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export function generateTwoFactorSecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `FitHub Pro (${email})`,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url || '',
  };
}

export async function generateQRCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}