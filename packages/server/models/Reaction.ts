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
  tableName: 'reactions',
  underscored: true,
  indexes: [
    {
      fields: ['topic_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['emoji'],
    },
    {
      fields: ['topic_id', 'emoji'],
    },
    {
      unique: true,
      fields: ['topic_id', 'user_id', 'emoji'],
    },
  ],
})
export class Reaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'topic_id',
  })
  declare topicId: number

  @BelongsTo(() => Topic)
  declare topic: Topic

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'post_id',
  })
  declare post_id: number

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare emoji: string

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
