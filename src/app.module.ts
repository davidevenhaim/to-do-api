// @@ Nestjs & Typeorm
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// @@ Modules
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

// @@ Entites
import entities from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Add database configuration here DB
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'atm-dev',
      password: '1234',
      database: 'atm-dev',
      entities: entities,
      synchronize: true,
    }),
    UsersModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
