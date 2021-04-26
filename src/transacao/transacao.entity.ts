import { Table, Model, Column, DataType, CreatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Conta } from '../conta/conta.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsMaiorQueLimiteDiario } from './../conta/validators/isMaiorQueLimiteDiario.validator';
import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Table
export class Transacao extends Model<Transacao> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    idTransacao: number;
    
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @ForeignKey(() => Conta)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    idConta: number;

    @BelongsTo(() => Conta)
    readonly conta: Conta

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    @IsMaiorQueLimiteDiario({message: 'Valor maior'})
    valor: number;

    @CreatedAt
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    dataTransacao: Date;
}