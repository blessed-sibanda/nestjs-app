import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @BeforeInsert()
  async encyptPassword() {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }

  @BeforeInsert()
  downcaseEmail() {
    this.email = this.email.toLowerCase();
  }

  async isValidPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  static schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });
}
