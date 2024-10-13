import crypto from 'crypto';

export default function handler(req, res) {
  const { token } = req.body;
  const privateKey = process.env.APPLE_PRIVATE_KEY;

  if (!privateKey) {
    return res.status(500).json({ error: "Private key not configured" });
  }

  const response = JSON.stringify({ token, status: "success" });
  const encryptedResponse = crypto.privateEncrypt(privateKey, Buffer.from(response));

  res.status(200).json({ encryptedData: encryptedResponse.toString('base64') });
}
