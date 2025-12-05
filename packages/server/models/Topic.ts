// src/models/Topic.ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { User } from './User'
import { Post } from './Post'

@Table({
  tableName: 'Topics',
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
  declare description: string

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare authorId: number

  @BelongsTo(() => User)
  declare author: User

  @HasMany(() => Post)
  declare posts: Post[]

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}
