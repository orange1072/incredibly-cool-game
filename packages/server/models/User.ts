import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'

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
    unique: true,
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

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare created_at: Date
}
