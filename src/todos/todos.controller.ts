// @@ Nestjs
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

// @@ Services
import { TodosService } from './todos.service';

// @@ Entites
import { Todo } from 'src/entities/todos/todo/todo';
import { AuthGuard } from 'src/guards/auth.guard';
import { iServerResponse } from 'src/dto/response.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() todo: Todo, userId: number): Promise<iServerResponse> {
    console.log('IM HERE userId=', userId);
    return this.todoService.createOne(todo);
  }

  @Put('update/:id')
  async updateOne(
    @Body() todo: Todo,
    @Param('id') todoId: number,
  ): Promise<iServerResponse> {
    return this.todoService.updateOne(todoId, todo);
  }

  @Delete('delete/:id/:userId')
  async deleteOne(
    @Param('id') todoId: number,
    @Param('userId') userId: number,
  ): Promise<iServerResponse> {
    return this.todoService.deleteOne(todoId, userId);
  }

  @Get(':id/:userId')
  async findOne(
    @Param('id') todoId: number,
    @Param('userId') userId: number,
  ): Promise<iServerResponse> {
    return this.todoService.findOne(todoId, userId);
  }
}
