let tokens = [];

export const TokenService = {
  addToken(token) {
    tokens.push(token);
  },
  isValidToken(token) {
    return tokens.includes(token);
  },
  removeToken(token) {
    tokens = tokens.filter(t => t !== token); // Optional: Remove token after processing
  },
};
