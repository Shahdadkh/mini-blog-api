import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export default class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'timestamp', default: 'now()' })
  date: Date;

  @Column({ nullable: false })
  text: string;

  @Column({ type: 'boolean', default: true })
  verify: boolean;

  @Column({ nullable: true })
  comments: string;
}
