import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type PrismaUserClient = {
  findUnique: (args: { where: { email: string } }) => Promise<User | null>;
  create: (args: {
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  }) => Promise<User>;
};

const bcryptModule = bcrypt as unknown as {
  hash: (data: string, salt: number) => Promise<string>;
  compare: (data: string, encrypted: string) => Promise<boolean>;
};

@Injectable()
export class AuthService {
  private prisma: { user: PrismaUserClient };

  constructor(
    prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
    this.prisma = prismaService as unknown as { user: PrismaUserClient };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, username } = signUpDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcryptModule.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptModule.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
