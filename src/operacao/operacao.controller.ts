import { TransacaoService } from './../transacao/transacao.service';
import { ContaService } from 'src/conta/conta.service';
import { Controller, Post, Body, Get, Param, HttpStatus, NotFoundException, Put, Delete, Res } from '@nestjs/common';
import { Transacao } from 'src/transacao/transacao.entity';

@Controller('operacoes')
export class OperacaoController {

    constructor(
        private readonly contaService: ContaService,
        private readonly transacaoService: TransacaoService
    ) { }

    @Put('deposito/conta/:idConta')
    async depositarNaConta(@Param() params, @Body() body, @Res() res) {
        await this.contaService.depositar(params.idConta, body.valor);
        const transferencia = await this.transacaoService.depositar(params.idConta, body.valor);

        res.status(HttpStatus.OK)
            .json((await transferencia));
    }

    @Put('saque/conta/:idConta')
    async sacarDaConta(@Param() params, @Body() body, @Res() res) {
        try {
            const totalDeSaquesDiario: number = await this.transacaoService.totalSaqueNoDia(params.idConta);
            // const saldoNodia: number = await this.transacaoService.consultarSaldo(params.idConta);
            const saldoNodia: number = await this.contaService.consultarSaldo(params.idConta);
            if (await this.contaService.isDisponivelNovoSaque(params.idConta, body.valor, saldoNodia, totalDeSaquesDiario)) {
                await this.contaService.sacar(params.idConta, body.valor);
                var transferencia = await this.transacaoService.sacar(params.idConta, body.valor);
            }
        } catch (error) {
            throw new Error(error);
        }
        res.status(HttpStatus.OK)
            .json(transferencia);
    }

    @Put('ativacao/conta/:idConta')
    async ativarConta(@Param() params, @Res() res) {
        const conta = await this.contaService.ativar(params.idConta);
        res.status(HttpStatus.OK)
            .json(conta);
    }

    @Put('bloqueio/conta/:idConta')
    async bloquearConta(@Param() params, @Res() res) {
        const conta = await this.contaService.bloquear(params.idConta);
        res.status(HttpStatus.OK)
            .json(conta);
    }

    @Get('saldo/conta/:idConta')
    async consultarSaldoDaConta(@Param() params, @Res() res) {
        // const saldo = await this.transacaoService.consultarSaldo(params.idConta);
        const saldo: number = await this.contaService.consultarSaldo(params.idConta);
        res.status(HttpStatus.OK)
            .json({ 'saldo': Number(saldo) });
    }

    @Get('extrato/conta/:idConta')
    async extratoDaConta(@Param() params, @Res() res) {
        const extrato = await this.transacaoService.extrato(params.idConta);
        const saldo: number = await this.contaService.consultarSaldo(params.idConta);
        res.status(HttpStatus.OK)
            .json({ extrato, saldo });
    }

    @Get('extrato/conta/:idConta/inicio/:dataInicial/final/:dataFinal')
    async extratoDaContaPorPeriodo(@Param() params, @Res() res) {
        const extrato = await this.transacaoService.extratoPorPeriodo(params.idConta, params.dataInicial, params.dataFinal);
        const saldo: number = await this.contaService.consultarSaldo(params.idConta);
        res.status(HttpStatus.OK)
            .json({ extrato, saldo });
    }
}