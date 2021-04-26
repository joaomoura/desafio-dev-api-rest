import { Injectable, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transacao } from './transacao.entity';
import { ContaService } from './../conta/conta.service';
import { Conta } from './../conta/conta.entity';
import { OperacaoService } from './../operacao/transacao.service';

@Injectable()
export class TransacaoService {
    constructor(
        @InjectModel(Transacao) private transacaoModel: typeof Transacao,
        private operacaoService: OperacaoService
    ) { }

    async index(): Promise<Transacao[]> {
        return await this.transacaoModel.findAll();
    }

    async show(idTransacao: number): Promise<Transacao> {
        return await this.transacaoModel.findByPk(idTransacao);
    }

    async store(transacao) {
        return await this.transacaoModel.create(transacao);
    }

    async update(transacao: Transacao): Promise<[number, Transacao[]]> {
        return await this.transacaoModel.update(transacao, {
            where: { idTransacao: transacao.idTransacao }
        });
    }

    async updateById(idTransacao: number, transacao: Transacao): Promise<[number, Transacao[]]> {
        return await this.transacaoModel.update(transacao, {
            where: { idTransacao: idTransacao }
        });
    }

    async destroy(idTransacao: number) {
        const transacao: Transacao = await this.show(idTransacao);
        transacao.destroy();
    }

    async depositar(idConta: number, valor: number) {
        return await this.store({ idConta, valor });
    }

    async sacar(idConta: number, valor: number) {
        return await this.store({ idConta, valor: (-valor) });
    }

    async totalSaqueNoDia(idConta: number) {
        const DataDeHojeFormatada = this.operacaoService.getDataDeHojeFormatada();
        const transacoes = await this.transacaoModel.findAll({
            where: { idConta: idConta, dataTransacao: DataDeHojeFormatada }
        });
        return await transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async consultarSaldo(idConta: number) {
        const transacoes = await this.transacaoModel.findAll({
            where: { idConta: idConta }
        });
        return transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async extrato(idConta: number) {
        const { Op } = require("sequelize");

        const transacoesDeDepositos = await this.transacaoModel.findAll({
            where: { idConta: idConta, valor: { [Op.gt]: 0 } }
        });
        const depositos = transacoesDeDepositos.reduce((total, transacao) => total + Number(transacao.valor), 0);

        const transacoesDeSaques = await this.transacaoModel.findAll({
            where: { idConta: idConta, valor: { [Op.lt]: 0 } }
        });
        const saques = transacoesDeSaques.reduce((total, transacao) => total + Number(transacao.valor), 0);

        const transacoes = await this.transacaoModel.findAll({
            where: { idConta: idConta }
        });
        const total = transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
        return { depositos, saques, total}
    }

    async extratoPorPeriodo(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");

        const transacoesDeDepositos = await this.transacaoModel.findAll({
            where: { 
                idConta: idConta, 
                valor: { [Op.gt]: 0 },
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        const depositos = transacoesDeDepositos.reduce((total, transacao) => total + Number(transacao.valor), 0);

        const transacoesDeSaques = await this.transacaoModel.findAll({
            where: { 
                idConta: idConta, 
                valor: { [Op.lt]: 0 },
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        const saques = transacoesDeSaques.reduce((total, transacao) => total + Number(transacao.valor), 0);

        const transacoes = await this.transacaoModel.findAll({
            where: { 
                idConta: idConta,
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        const total = transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
        return { depositos, saques, total }
    }
}