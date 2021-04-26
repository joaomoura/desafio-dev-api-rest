import { CustomValidationPipe } from './validation.pipe';
import { ItemDTO } from './usuario.dto';
import { NestResponseBuilder } from './../core/http/nestResponseBuilder';
import { NestResponse } from './../core/http/nestResponse';
import { Controller, Post, Body, Get, Param, HttpStatus, NotFoundException, UsePipes, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { ConditionalValidationPipe } from './conditional.validation.pipe';
import { validate } from 'class-validator';

@Controller('users')
export class UsuarioController {

    constructor(private usuarioService: UsuarioService) {}

    @Get(':nomeDeUsuario')
    public buscaPorNomeDeUsuario(@Param('nomeDeUsuario') nomeDeUsuario: string): Usuario {
        const usuarioEncontrado = this.usuarioService.buscaPorNomeDeUsuario(nomeDeUsuario);

        if (!usuarioEncontrado) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Usuário não encontrado.'
            });
        }
        return usuarioEncontrado;
    }

    @Post()
    public cria(@Body() usuario: Usuario): NestResponse {
        
        const usuarioCriado = this.usuarioService.cria(usuario);
        return new NestResponseBuilder()
                .comStatus(HttpStatus.CREATED)
                .comHeaders({
                    'Location': `/users/${usuarioCriado.nomeDeUsuario}`
                })
                .comBody(usuarioCriado)
                .build();
    }

    @Put(':id')
    public createItem(@Param() params) {
        return params;
    }
}