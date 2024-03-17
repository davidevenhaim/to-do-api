// @@ Nest
import { IsString } from '@nestjs/class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// @@ Entities
import { Todo } from 'src/entities/todos/todo/todo';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  username: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  // the user's todo's list - default value empty array.
  todos: Todo[];
}
