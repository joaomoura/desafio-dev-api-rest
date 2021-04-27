import { ContaService } from './../conta/conta.service';
import { Conta } from './../conta/conta.entity';
import { Pessoa } from './../pessoa/pessoa.entity';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';

import { Transacao } from './transacao.entity';
import { TransacaoController } from './transacao.controller';
import { TransacaoService } from './transacao.service';
import { OperacaoService } from '../operacao/operacao.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Transacao]),
        SequelizeModule.forFeature([Pessoa]),
        SequelizeModule.forFeature([Conta])
    ],
    controllers: [TransacaoController],
    providers: [
        TransacaoService, OperacaoService, PessoaService, ContaService
    ]
})
export class TransacaoModule { }