// @@ Nestjs
import { Controller, Post, Body } from '@nestjs/common';

// @@ Services
import { UsersService } from './users.service';

// @@ Entities
import { User } from 'src/entities/users/user/user';

// @@ Utils
import { iToken, iUserLoginDetails } from './utils';
import { iServerResponse } from 'src/dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: User): Promise<iServerResponse> {
    return this.usersService.registerUser(user);
  }

  @Post('login')
  async login(
    @Body() userDetails: iUserLoginDetails,
  ): Promise<iServerResponse> {
    const { username, password } = userDetails;
    return this.usersService.loginUser(username, password);
  }

  @Post('logout')
  async logout(@Body() jwt: iToken): Promise<iServerResponse> {
    const { token } = jwt;
    return this.usersService.logoutUser(token);
  }

  @Post('decodeToken')
  async decodeToken(@Body() jwt: iToken): Promise<iServerResponse> {
    const { token } = jwt;
    return this.usersService.decodeToken(token);
  }

  // @Get(':username')
  // async findOne(
  //   @Param('username') username: string,
  // ): Promise<User | undefined> {
  //   return this.usersService.findOne(username);
  // }
}
