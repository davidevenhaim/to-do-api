// @@ Nest & Typeorm
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// @@ Utilites
import * as bcrypt from 'bcrypt';

// @@ Entities
import { User } from 'src/entities/users/user/user';

// @@ Services
import { TodosService } from 'src/todos/todos.service';

// @@ Constants
import { ServerCode, iServerResponse } from 'src/dto/response.dto';
import { SECRET_KEY } from './utils';

const HASH_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly todosService: TodosService,
  ) {}

  async registerUser(user: User): Promise<iServerResponse> {
    const hashedPassword = await bcrypt.hash(user.password, HASH_SALT_ROUNDS);
    const isUserExists = await this.findOne(user.username);
    if (isUserExists) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.BAD_REQUEST,
        msg: 'userExists',
      };
    }
    try {
      return this.create({ ...user, password: hashedPassword, todos: [] });
    } catch (err) {
      console.warn(err.msg);
    }
  }

  async loginUser(
    username: string,
    password: string,
  ): Promise<iServerResponse> {
    const user = await this.findOne(username);
    if (!user) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.NOT_FOUND,
        msg: 'userNotFound',
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.BAD_REQUEST,
        msg: 'incorrectDetails',
      };
    }

    delete user.password; // don't send password even if its decoded.

    const res = await this.todosService.findTodosByUser(user.id);
    const token = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
      name: user.name,
      todos: res.data?.todos || res.data,
    });

    return {
      code: ServerCode.Ok,
      status: HttpStatus.OK,
      data: {
        ...user,
        todos: res.data?.todos || res.data,
        token,
      },
    };
  }

  async decodeToken(token: string): Promise<iServerResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: SECRET_KEY,
      });

      const userId = payload.id;
      if (userId) {
        const res = await this.todosService.findTodosByUser(payload.id);
        payload.todos = res.data.todos;
      }
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        data: {
          ...payload,
        },
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async logoutUser(jwt: string): Promise<iServerResponse> {
    // invalidate the jwt

    return {
      code: ServerCode.Ok,
      status: HttpStatus.OK,
      msg: 'sessionRemoved',
    };
  }

  //   @@@ Some DB operations.
  async create(user: User): Promise<iServerResponse> {
    try {
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      const token = await this.jwtService.signAsync({
        id: user.id,
        username: user.username,
        name: user.name,
        todos: user.todos,
      });

      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        data: {
          ...savedUser,
          token,
        },
      };
    } catch (err) {
      console.warn('Error in creating user: ', err);
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
