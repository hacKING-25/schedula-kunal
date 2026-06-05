import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private jwtService: JwtService) {}

  async signup(signupDto: SignupDto) {
    const userExists = this.users.find(u => u.email === signupDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupDto.passwordHash, salt);

    const newUser: User = {
      id: Math.random().toString(36).substring(2),
      email: signupDto.email,
      passwordHash: hashedPassword,
      role: signupDto.role,
      name: signupDto.name,
    };

    this.users.push(newUser);
    const { passwordHash, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = this.users.find(u => u.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}