import Comments from 'src/comment/entities/comment.entity';
import Users from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('posts')
export default class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @ManyToOne(() => Users, (user) => user.posts, { onDelete: 'CASCADE' })
  user: Users;

  @Column({ nullable: false })
  @RelationId((posts: Posts) => posts.user)
  userId: string;

  @Column({ nullable: false })
  title: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({ nullable: false })
  text: string;

  @Column({ type: 'boolean', default: true })
  verify: boolean;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comments[];
}
