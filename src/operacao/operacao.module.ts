import { Conta } from './../conta/conta.entity';
import { Transacao } from './../transacao/transacao.entity';
import { ContaService } from './../conta/conta.service';
import { TransacaoService } from './../transacao/transacao.service';
import { OperacaoController } from './operacao.controller';
import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { OperacaoService } from './operacao.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Conta]),
        SequelizeModule.forFeature([Transacao])
    ],
    controllers: [OperacaoController],
    providers: [
        ContaService, TransacaoService, OperacaoService
    ]
})
export class OperacaoModule {}