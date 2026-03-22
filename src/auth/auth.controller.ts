import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BaseResponse } from 'src/common/response/base-response';
import { ContentResponse } from 'src/common/response/content-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { AuthRoutes } from 'src/routes/auth.routes';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    username: string;
  };
};

@Controller({
  path: AuthRoutes.BASE,
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthRoutes.LOGIN)
  async login(@Body() body: LoginDto): Promise<
    ContentResponse<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        username: string;
      };
    }>
  > {
    const data = await this.authService.login(body.username, body.password);

    return new ContentResponse(
      'auth',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.AUTH.LOGIN_SUCCESS,
    );
  }

  @Post(AuthRoutes.REFRESH)
  async refresh(@Body() body: RefreshTokenDto): Promise<
    ContentResponse<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        username: string;
      };
    }>
  > {
    const data = await this.authService.verifyAndRefresh(body.refreshToken);

    return new ContentResponse(
      'auth',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.AUTH.TOKEN_REFRESHED,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(AuthRoutes.LOGOUT)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ): Promise<BaseResponse> {
    await this.authService.logout(req.user.userId, body.refreshToken);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.AUTH.LOGOUT_SUCCESS,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.PROFILE)
  profile(@Req() req: AuthenticatedRequest) {
    return new ContentResponse(
      'user',
      req.user,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.AUTH.PROFILE_FETCHED,
    );
  }
}
