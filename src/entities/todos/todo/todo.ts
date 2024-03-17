// @@ Nest
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// @@ Entities
import { User } from 'src/entities/users/user/user';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  task: string;

  @Column({ default: false })
  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;

  @Column()
  @IsNumber()
  userId: number;

  @ManyToOne(() => User, (user) => user.todos)
  @IsNotEmpty()
  user: User;
}
