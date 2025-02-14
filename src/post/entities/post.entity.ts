import Comments from 'src/comment/entities/comment.entity';
import Users from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('posts')
export default class Posts {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column({ nullable: true })
  userUuid: string;

  @ManyToOne(() => Users, (user) => user.posts, { onDelete: 'CASCADE' })
  user: Users;

  @Exclude()
  @Column({ nullable: false })
  @RelationId((posts: Posts) => posts.user)
  userId: string;

  @Column({ nullable: false })
  title: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  date: Date;

  @Column({ nullable: false })
  text: string;

  @Column({ type: 'boolean', default: true })
  verify: boolean;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comments[];
}
