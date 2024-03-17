// @@ Nest & Typeorm
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// @@ Todos
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

// @@ Entities
import { Todo } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}
