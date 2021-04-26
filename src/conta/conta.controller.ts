import { Controller, Post, Body, Get, Param, HttpStatus, NotFoundException, Put, Delete, Res } from '@nestjs/common';
import { ContaService } from './conta.service';
import { Conta } from './conta.entity';
import { NestResponseBuilder } from './../core/http/nestResponseBuilder';
import { NestResponse } from './../core/http/nestResponse';

@Controller('contas')
export class ContaController {

    constructor(private contaService: ContaService) { }

    @Get()
    async index(): Promise<Conta[]> {
        return this.contaService.index();
    }

    @Get(':idConta')
    async show(@Param() params): Promise<Conta> {
        return await this.contaService.show(params.idConta);
    }

    @Post()
    async store(@Body() conta: Conta, @Res() res) {
        const newConta = await this.contaService.store(conta);

        res.status(HttpStatus.CREATED)
            .location(`/contas/${(await newConta).idConta}`)
            .json((await newConta));
    }

    @Put()
    async update(@Body() conta: Conta): Promise<[number, Conta[]]> {
        return this.contaService.update(conta);
    }

    @Put(':idConta')
    async updateById(@Param() params, @Body() conta: Conta): Promise<[number, Conta[]]> {
        return await this.contaService.updateById(params.idConta, conta);
    }

    @Delete(':idConta')
    async destroy(@Param() params) {
        this.contaService.destroy(params.idConta);
    }
}