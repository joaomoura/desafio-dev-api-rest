import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';

import { Pessoa } from './pessoa.entity';
import { PessoasController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

@Module({
    imports: [SequelizeModule.forFeature([Pessoa])],
    controllers: [PessoasController],
    providers: [
        PessoaService,
    ]
})
export class PessoasModule { }