import Posts from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('comments')
export default class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Posts;

  @Column({ nullable: false })
  @RelationId((comments: Comments) => comments.post)
  postId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: true, type: 'timestamp', default: 'now()' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  verify: boolean;

  @Column({ nullable: true })
  answer: string;
}
