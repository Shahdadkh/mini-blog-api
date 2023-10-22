import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export default class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  postId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: true, type: 'timestamp', default: 'now()' })
  date: Date;

  @Column({ type: 'boolean', default: true })
  verify: boolean;

  @Column({ nullable: true })
  answer: string;
}
