import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from './usuario.entity';
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { IsNomeDeUsuarioUnicoConstraint } from "./is-nome-de-usuario-unico.validator";
// import { IsValorMaiorQueLimitDiarioConstraint } from 'src/contas/is-maior-limite-diario.validator';

@Module({
    imports: [],
    controllers: [UsuarioController],
    providers: [
        UsuarioService,
        IsNomeDeUsuarioUnicoConstraint
    ]
})
export class UsuarioModule {}