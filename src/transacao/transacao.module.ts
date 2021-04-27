import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';

import { Transacao } from './transacao.entity';
import { TransacaoController } from './transacao.controller';
import { TransacaoService } from './transacao.service';
import { OperacaoService } from './../operacao/transacao.service';

@Module({
    imports: [SequelizeModule.forFeature([Transacao])],
    controllers: [TransacaoController],
    providers: [
        TransacaoService, OperacaoService
    ]
})
export class TransacaoModule { }