import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { Post } from './Post'

@Table({
  tableName: 'users',
  timestamps: true,
  updatedAt: false,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare login: string

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string

  // ❗ В реальном проекте — хешируйте пароль!
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string

  @HasMany(() => Post)
  declare posts: Post[]

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare created_at: Date
}
