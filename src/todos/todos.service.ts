// @@ Nestjs
import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// @@ Entites
import { Todo } from 'src/entities/todos/todo/todo';
import { ServerCode, iServerResponse } from 'src/dto/response.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async createOne(todo: Todo): Promise<iServerResponse> {
    try {
      console.log('todo to be created: ', todo);
      const newTodo = await this.todosRepository.save({
        task: todo.task,
        userId: todo.user.id,
        isCompleted: false,
      });
      newTodo.userId = todo.user.id;
      console.log('The new todo is:', newTodo);
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        data: {
          ...newTodo,
        },
      };
    } catch (err) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'failedCreatingTodo',
      };
    }
  }

  async updateOne(todoId: number, todo: Todo): Promise<iServerResponse> {
    try {
      const updatedTodo = await this.todosRepository.update(todoId, todo);
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        msg: updatedTodo.affected > 0 ? 'updated' : 'failed',
        data: {
          ...updatedTodo,
        },
      };
    } catch (err) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'failedUpdatingTodo',
      };
    }
  }

  async findOne(todoId: number, userId: number): Promise<iServerResponse> {
    try {
      const todo = await this.todosRepository.findOne({
        where: { id: todoId },
      });
      if (todo.user.id !== userId) {
        return {
          code: ServerCode.Err,
          status: HttpStatus.UNAUTHORIZED,
          msg: 'unauthorizedToGetTodo',
        };
      }
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        data: {
          ...todo,
        },
      };
    } catch (err) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'failedUpdatingTodo' + ' ' + err?.msg,
      };
    }
  }

  async findTodosByUser(userId: number): Promise<iServerResponse> {
    try {
      console.log('userId=', userId);
      const todosArr = await this.todosRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });

      console.log('todosArr=', todosArr);
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        data: {
          todos: todosArr || [],
        },
      };
    } catch (err) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'failedFetchingTodos' + ' ' + err?.msg,
      };
    }
  }

  async deleteOne(todoId: number, userId: number): Promise<iServerResponse> {
    try {
      const deleteResult = await this.todosRepository.delete(todoId);
      return {
        code: ServerCode.Ok,
        status: HttpStatus.OK,
        msg: deleteResult?.affected > 0 ? 'deleted' : 'noTodosDeleted',
      };
    } catch (err) {
      return {
        code: ServerCode.Err,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'failedFetchingTodos' + ' ' + err?.msg,
      };
    }
  }
}
