import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository';

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  async validateUser(phoneNumber: string, password: string) {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (user && await user.checkPassword(password)) {
      return user;
    }
    
    return null;
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.updateLastLogin(userId);
  }

  generateTokens(user: any) {
    const payload = {
      userId: user.id,
      role: user.role,
      phoneNumber: user.phoneNumber,
      ldapUid: user.ldapUid
    };


    const jwtSecret = process.env.JWT_SECRET as jwt.Secret;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as jwt.Secret;
    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as any
    };

    const accessToken = jwt.sign(payload, jwtSecret, signOptions);
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      ...signOptions,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      userId,
      token: refreshToken,
      expiresAt
    } as any);
  }

  async validateRefreshToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findValidToken(refreshToken);
    
    if (!token) {
      return null;
    }

    return this.userRepository.findById(token.userId);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.revokeToken(token);
  }
}