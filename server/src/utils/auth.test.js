import { jest } from '@jest/globals';

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: jest.fn(),
  },
}));

const { generateToken, matchPassword } = await import('./auth.js');
const jwt = (await import('jsonwebtoken')).default;
const bcrypt = (await import('bcryptjs')).default;

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const id = 'user123';
      jwt.sign.mockReturnValue('mocktoken');
      // The secret defaults to 'fallback_secret' if process.env.JWT_SECRET is not set
      const secret = process.env.JWT_SECRET || 'fallback_secret';

      const token = generateToken(id);

      expect(token).toBe('mocktoken');
      expect(jwt.sign).toHaveBeenCalledWith({ id }, secret, {
        expiresIn: '30d',
      });
    });
  });

  describe('matchPassword', () => {
    it('should return true if passwords match', async () => {
      const enteredPassword = 'password123';
      const hashedPassword = 'hashedPassword';
      bcrypt.compare.mockResolvedValue(true);

      const isMatch = await matchPassword(enteredPassword, hashedPassword);

      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, hashedPassword);
    });
  });
});
