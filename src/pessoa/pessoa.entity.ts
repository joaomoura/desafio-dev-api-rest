import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Table, Model, Column, DataType, HasMany, CreatedAt } from 'sequelize-typescript';

const { CREATE, UPDATE } = CrudValidationGroups;

@Table
export class Pessoa extends Model<Pessoa> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    @IsOptional() readonly idPessoa: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    readonly nome: string;

    @Column({
        type: DataType.STRING(11),
        allowNull: false,
    })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Length(11, 11) readonly cpf: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    readonly dataNascimento: Date;

    @CreatedAt
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    dataCriacao: Date;

    // @HasMany(() => Conta)
    // contas: Conta[]
}