import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { User } from './User'
import { Topic } from './Topic'

@Table({
  tableName: 'Posts',
  timestamps: true,
})
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare authorId: number

  @BelongsTo(() => User)
  declare author: User

  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  declare topicId: number

  @BelongsTo(() => Topic)
  declare topic: Topic

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}
