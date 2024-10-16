import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as sha256 from 'crypto-js/sha256';
import { JwtService } from '@nestjs/jwt';

import { UserRepository, UserEntity } from '@ct-pod/dal';

import { AuthDto, CreateUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.userRepository.findByPhone(
      createUserDto.phone,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.userRepository.insertOne({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.updateRefreshToken(newUser._id, newUser.name);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.userRepository.findByPhone(data.phone);
    if (!user) throw new BadRequestException('User does not exist');
    const tokens = await this.updateRefreshToken(user._id, user.name);
    return tokens;
  }

  async logout(userId: string) {
    return this.userRepository.unsetOneById(userId, ['refreshToken']);
  }

  hashData(data: string) {
    return sha256(data).toString();
  }

  async updateRefreshToken(userId: string, userName: string) {
    const tokens = await this.getTokens(userId, userName);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.userRepository.updateOneById(userId, {
      refreshToken: hashedRefreshToken,
    });
    return tokens;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user: UserEntity = await this.userRepository.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    if (user.refreshToken === refreshToken)
      throw new ForbiddenException('Access Denied');
    const tokens = await this.updateRefreshToken(user._id, user.name);
    return tokens;
  }
}
