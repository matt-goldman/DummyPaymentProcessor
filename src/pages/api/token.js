import { TokenService } from '../../lib/tokenService';
import { randomUUID } from 'crypto';

export default function handler(req, res) {
  const token = randomUUID(); // Generate GUID
  TokenService.addToken(token);  // Store token in memory
  res.status(200).json({ token });
}
