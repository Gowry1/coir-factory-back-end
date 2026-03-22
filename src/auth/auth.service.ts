import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { JwtPayloadType } from './types/jwt-payload.type';
import { RefreshTokenMetadata } from '../auth/types/refresh-token-metadata.type';

@Injectable()
export class AuthService {
  private readonly refreshExpiresIn = '7d';
  private readonly refreshTtlSeconds = 7 * 24 * 60 * 60;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    return this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const accessPayload: JwtPayloadType = {
      sub: user.id,
      username: user.username,
    };

    const tokenId = randomUUID();

    const refreshPayload: JwtPayloadType = {
      sub: user.id,
      username: user.username,
      tokenId,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      expiresIn: this.refreshExpiresIn,
    });

    const redisKey = this.getRefreshTokenKey(String(user.id), tokenId);

    const metadata: RefreshTokenMetadata = {
      userId: String(user.id),
      tokenId,
    };

    await this.redisService.set(
      redisKey,
      JSON.stringify(metadata),
      this.refreshTtlSeconds,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async verifyAndRefresh(refreshToken: string) {
    let payload: JwtPayloadType;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayloadType>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!payload.tokenId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const redisKey = this.getRefreshTokenKey(
      String(payload.sub),
      payload.tokenId,
    );

    const storedMetadata = await this.redisService.get(redisKey);

    if (!storedMetadata) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    const parsed = JSON.parse(storedMetadata) as RefreshTokenMetadata;

    if (
      parsed.userId !== String(payload.sub) ||
      parsed.tokenId !== payload.tokenId
    ) {
      throw new UnauthorizedException('Invalid refresh token metadata');
    }

    await this.redisService.del(redisKey);

    const user = await this.userService.findById(payload.sub);

    return this.generateTokens(user);
  }

  async logout(userId: number, refreshToken: string) {
    let payload: JwtPayloadType;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayloadType>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.sub !== userId || !payload.tokenId) {
      throw new UnauthorizedException('Invalid logout request');
    }

    const redisKey = this.getRefreshTokenKey(
      String(payload.sub),
      payload.tokenId,
    );

    await this.redisService.del(redisKey);

    return {
      message: 'Logout successful',
    };
  }

  private getRefreshTokenKey(userId: string, tokenId: string): string {
    return `refresh_token:${userId}:${tokenId}`;
  }
}
