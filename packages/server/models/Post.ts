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
  Sequelize,
  UpdatedAt,
} from 'sequelize-typescript'
import { Topic } from './Topic'

@Table({
  tableName: 'posts',
  underscored: true,
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

  @Column(DataType.STRING)
  declare login: string

  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  declare topic_id: number

  @Column(DataType.INTEGER)
  declare parent_id: number

  @BelongsTo(() => Topic)
  declare topic: Topic

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
