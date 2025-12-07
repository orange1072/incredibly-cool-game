// src/models/Topic.ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { User } from './User'
import { Post } from './Post'

@Table({
  tableName: 'topics',
  timestamps: true,
})
export class Topic extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare preview: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare tags: string

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: string

  @Column(DataType.INTEGER)
  declare topic_id: number

  @HasMany(() => Post)
  declare posts: Post[]

  @CreatedAt
  declare created_at: Date
}
