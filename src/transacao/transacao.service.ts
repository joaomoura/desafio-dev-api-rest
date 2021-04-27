import { Injectable, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transacao } from './transacao.entity';
import { OperacaoService } from '../operacao/operacao.service';

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
        const pessoa = await this.operacaoService.getPessoaByIdConta(idConta);
        const extrato = await this.getExtratoByIdConta(idConta);
        const depositos = await this.getTransacoesDeDepositosByIdConta(idConta);
        const saques = await this.getTransacoesDeSaquesByIdConta(idConta);
        const total = await this.getTransacoesByIdConta(idConta);

        return { pessoa: pessoa.nome, movimentos: extrato, depositos, saques, total }
    }

    async extratoPorPeriodo(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");
        const pessoa = await this.operacaoService.getPessoaByIdConta(idConta);
        const extrato = await this.getPorPeriodoByIdConta(idConta, dataInicial, dataFinal);
        const depositos = await this.getTransacoesDeDepositosPorPeriodoByIdConta(idConta, dataInicial, dataFinal);
        const saques = await this.getTransacoesDeSaquesPorPeriodoByIdConta(idConta, dataInicial, dataFinal);
        const total = await this.getTransacoesPorPeriodoByIdConta(idConta, dataInicial, dataFinal);

        return { pessoa: pessoa.nome, movimentos: extrato, depositos, saques, total }
    }

    async getExtratoByIdConta(idConta) {
        return await this.transacaoModel.findAll({
            where: { idConta: idConta }
        });
    }

    async getTransacoesDeDepositosByIdConta(idConta) {
        const { Op } = require("sequelize");
        const transacoesDeDepositos = await this.transacaoModel.findAll({
            where: { idConta: idConta, valor: { [Op.gt]: 0 } }
        });
        return await transacoesDeDepositos.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async getTransacoesDeSaquesByIdConta(idConta) {
        const { Op } = require("sequelize");
        const transacoesDeSaques = await this.transacaoModel.findAll({
            where: { idConta: idConta, valor: { [Op.lt]: 0 } }
        });
        return await transacoesDeSaques.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async getTransacoesByIdConta(idConta) {
        const { Op } = require("sequelize");
        const transacoes = await this.transacaoModel.findAll({
            where: { idConta: idConta }
        });
        return await transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async getPorPeriodoByIdConta(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");
        return await this.transacaoModel.findAll({
            where: {
                idConta: idConta,
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
    }

    async getTransacoesDeDepositosPorPeriodoByIdConta(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");
        const transacoesDeDepositos = await this.transacaoModel.findAll({
            where: {
                idConta: idConta,
                valor: { [Op.gt]: 0 },
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        return await transacoesDeDepositos.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async getTransacoesDeSaquesPorPeriodoByIdConta(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");
        const transacoesDeSaques = await this.transacaoModel.findAll({
            where: {
                idConta: idConta,
                valor: { [Op.lt]: 0 },
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        return await transacoesDeSaques.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }

    async getTransacoesPorPeriodoByIdConta(idConta: number, dataInicial, dataFinal) {
        const { Op } = require("sequelize");
        const transacoes = await this.transacaoModel.findAll({
            where: {
                idConta: idConta,
                dataTransacao: { [Op.between]: [dataInicial, dataFinal] }
            }
        });
        return await transacoes.reduce((total, transacao) => total + Number(transacao.valor), 0);
    }
}