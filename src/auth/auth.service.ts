import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>, //Property type Model for the DB

    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try {
      
      //1- Encrypt the password
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel( {
        password: bcryptjs.hashSync( password, 10 ),
        ...userData 
      } );
      
      //2- Save the user
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();
      
      //3- Generate the JWT, that is our access key

      return user;

    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${ createUserDto.email } already exists`)
      }
      throw new InternalServerErrorException('Something not good happen!!!');
    }

  }


  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;

    //We Verify if the user exist
    const user = await this.userModel.findOne( {  email  } ); // .findOne( {  email: email  } )
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    //We compare the password
    if ( !bcryptjs.compareSync( password, user.password )) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    //We have to create an access token 
    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest, // ...rest
      token: this.getJwtToken({ id: user.id }),
    };

  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //The information that I want to create in my JWT is that I consider enough to rebuild the user
  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
