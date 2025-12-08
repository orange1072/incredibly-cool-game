import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { User } from './User'
import { Topic } from './Topic'

@Table({
  tableName: 'posts',
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
  declare user_id: number

  @BelongsTo(() => User)
  declare user: User

  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  declare topic_id: number

  @Column(DataType.INTEGER)
  declare parent_id: number

  @BelongsTo(() => Topic)
  declare topic: Topic

  @CreatedAt
  declare created_at: Date
}
