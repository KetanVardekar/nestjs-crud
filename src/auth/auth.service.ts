import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
// import{User,Bookmark} from "@prisma/client"
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName:dto.firstname,
          lastName:dto.lastname
        },
      });
      // delete user.hash;
      // return the saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      return error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
      include:{
        bookmarks:true
      }
    });
console.log(user);

    // if user does not exist throw exception

    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // compare password
    const pwmatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!pwmatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    // send back the user
    // delete user.hash;
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = await  this.config.get('JWT_SECRET')
    
     const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return{
      'access_token' : token
    }
  }
}
