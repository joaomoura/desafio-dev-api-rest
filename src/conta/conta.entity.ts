import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

import { Pessoa } from '../pessoa/pessoa.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Table
export class Conta extends Model<Conta> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    idConta: number;

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @ForeignKey(() => Pessoa)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    idPessoa: number;

    @BelongsTo(() => Pessoa)
    pessoa: Pessoa

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    saldo: number;

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    limiteSaqueDiario: number;

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    flagAtivo: boolean;

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    tipoConta: number;

    @CreatedAt
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    dataCriacao: Date;

    // @HasMany(() => Transacao)
    // transacoes: Transacao[];
}