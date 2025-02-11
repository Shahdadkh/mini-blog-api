import Posts from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('comments')
export default class Comments {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  uuid: string;

  @Column({ nullable: false })
  postUuid: string;

  @ManyToOne(() => Posts, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Posts;

  @Exclude()
  @Column({ nullable: false })
  @RelationId((comments: Comments) => comments.post)
  postId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  text: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({ type: 'boolean', default: false })
  verify: boolean;

  @Column({ nullable: true })
  answer: string;
}
