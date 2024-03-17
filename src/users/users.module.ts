// @@ Nest & Typeorm
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// @@ Users
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// @@ Entities
import { User } from 'src/typeorm';

// @@ Constants
import { SECRET_KEY, SECRET_KEY_EXPIRY } from './utils';
import { TodosModule } from 'src/todos/todos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: SECRET_KEY,
      signOptions: { expiresIn: SECRET_KEY_EXPIRY },
    }),
    TodosModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
