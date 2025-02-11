import Posts from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export default class Users {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: 'user' })
  role: string;

  @Column({ nullable: true })
  imgUrl: string;

  @Column({ nullable: true })
  aboutMe: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  instagram: string;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
