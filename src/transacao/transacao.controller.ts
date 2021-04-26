import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';

import { TransacaoService } from './transacao.service';
import { Transacao } from './transacao.entity';

@Controller('transacoes')
export class TransacaoController {
    constructor(private transacaoService: TransacaoService) { }

    @Get()
    async index(): Promise<Transacao[]> {
        return this.transacaoService.index();
    }

    @Get(':idTransacao')
    async show(@Param() params): Promise<Transacao> {
        return this.transacaoService.show(params.idTransacao);
    }

    @Post()
    async store(@Body() transacao: Transacao, @Res() res) {
        const newTransacao = await this.transacaoService.store(transacao);

        res.status(HttpStatus.CREATED)
            .location(`/transacoes/${(await newTransacao).idTransacao}`)
            .json((await newTransacao));
    }

    @Put()
    async update(@Body() transacao: Transacao): Promise<[number, Transacao[]]> {
        return this.transacaoService.update(transacao);
    }

    @Put(':idTransacao')
    async updateById(@Param() params, @Body() transacao: Transacao): Promise<[number, Transacao[]]> {
        return await this.transacaoService.updateById(params.idTransacao, transacao);
    }

    @Delete(':idTransacao')
    async destroy(@Param() params) {
        this.transacaoService.destroy(params.idTransacao);
    }
}