import { TokenService } from '../../lib/tokenService';

export default function handler(req, res) {
  const { token, amount } = req.body;

  if (!TokenService.isValidToken(token)) {
    return res.status(400).json({ status: "failure", reason: "Invalid token" });
  }

  const maxAmount = process.env.MAX_AMOUNT || 1000;
  if (amount > maxAmount) {
    return res.status(400).json({ status: "failure", reason: "Amount exceeds limit" });
  }

  res.status(200).json({ status: "success" });
}
