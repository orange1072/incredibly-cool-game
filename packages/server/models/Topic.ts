// src/models/Topic.ts
import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Sequelize,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { Post } from './Post'

@Table({
  tableName: 'topics',
  underscored: true,
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
    allowNull: true,
  })
  declare tags: string

  @Column(DataType.STRING)
  declare login: string

  @HasMany(() => Post)
  declare posts: Post[]

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  declare created_at: Date

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  declare updated_at: Date
}
