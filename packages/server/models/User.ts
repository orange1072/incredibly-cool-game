import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'
import { Topic } from './Topic'
import { Post } from './Post'

@Table({
  tableName: 'Users',
  timestamps: true,
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
  declare name: string

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

  // Связи
  @HasMany(() => Topic)
  declare topics: Topic[]

  @HasMany(() => Post)
  declare posts: Post[]

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}
