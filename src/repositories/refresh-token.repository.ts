import { BaseRepository } from './base.repository';
import { RefreshToken } from '../entities/refresh-token.entity';
import { IsNull } from 'typeorm';

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async findValidToken(token: string): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: { 
        token,
        revokedAt: IsNull(), // ← Используем IsNull() вместо null
        expiresAt: new Date() // Исправляем на корректное условие
      },
      relations: ['user']
    });
  }

  async revokeToken(token: string): Promise<void> {
    await this.repository.update(
      { token },
      { revokedAt: new Date() }
    );
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() }, // ← Используем IsNull()
      { revokedAt: new Date() }
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .orWhere('revoked_at IS NOT NULL')
      .execute();
  }
}