import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { ContaController } from "./conta.controller";
import { Conta } from './conta.entity';
import { ContaService } from './conta.service';
import { IsValorMaiorQueLimitDiarioConstraint } from './validators/isMaiorQueLimiteDiario.validator';

@Module({
    imports: [SequelizeModule.forFeature([Conta])],
    controllers: [ContaController],
    providers: [
        ContaService, IsValorMaiorQueLimitDiarioConstraint
    ]
})
export class ContaModule {}