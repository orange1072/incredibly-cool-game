// Пример модели Sequelize с TypeScript декораторами
// Переименуйте этот файл и используйте как шаблон для создания моделей

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: true, // Автоматически добавляет createdAt и updatedAt
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  override id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secondName!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email?: string

  @CreatedAt
  @Column(DataType.DATE)
  override createdAt!: Date

  @UpdatedAt
  @Column(DataType.DATE)
  override updatedAt!: Date
}
