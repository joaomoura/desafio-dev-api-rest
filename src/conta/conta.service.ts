import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecOptions } from 'node:child_process';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

import { Conta } from './conta.entity';

@Injectable()
export class ContaService {

    constructor(
        @InjectModel(Conta)
        private contaModel: typeof Conta
    ) { }

    async index(): Promise<Conta[]> {
        return await this.contaModel.findAll();
    }

    async show(idConta: number): Promise<Conta> {
        return await this.contaModel.findByPk(idConta);
    }

    async store(conta: Conta) {
        return await this.contaModel.create(conta);
    }

    async update(conta: Conta): Promise<[number, Conta[]]> {
        return await this.contaModel.update(conta, {
            where: { idConta: conta.idConta }
        });
    }

    async updateById(idConta: number, conta: Conta): Promise<[number, Conta[]]> {
        return await this.contaModel.update(conta, {
            where: { idConta: idConta }
        });
    }

    async destroy(idConta: number) {
        const conta: Conta = await this.show(idConta);
        conta.destroy();
    }

    public isValorMaiorQueLimiteDiario(valor: number): boolean {
        return !valor;
    }

    async depositar(idConta: number, valor: number) {
        const conta = this.show(idConta);
        const saldoAtual: number = Number((await conta).saldo)
        const newSaldo = saldoAtual+valor;
        await this.atualizarSaldo(idConta, newSaldo);
        return this.show(idConta);
    }

    async sacar(idConta: number, valor: number) {
        const conta = this.show(idConta);
        const saldoAtual: number = Number((await conta).saldo)
        const newSaldo = saldoAtual + (-valor);
        await this.atualizarSaldo(idConta, newSaldo);
        return this.show(idConta);
    }

    async bloquear(idConta: number) {
        await this.contaModel.update(
            { 'flagAtivo': false },
            { where: { idConta: idConta } });
        return this.show(idConta);
    }

    async ativar(idConta: number) {
        await this.contaModel.update(
            { 'flagAtivo': true },
            { where: { idConta: idConta } });
        return this.show(idConta);
    }

    async consultarSaldo(idConta: number) {
        const conta = await this.show(idConta);
        return conta.saldo;
    }

    async isDisponivelNovoSaque(idConta:number, valor: number, saldoNodia: number, totalDeSaquesDiario: number) {
        const conta = await this.show(idConta);
        if (Number(valor) > Number(saldoNodia)) {
            throw new Error("O valor do saque é maior que o saldo disponível.");
        }
        if (Number(-totalDeSaquesDiario) > Number(conta.limiteSaqueDiario)) {
            throw new Error("Total de saques diários atingido.");
        }
        return true;
    }

    async atualizarSaldo(idConta: number, newSaldo: number) {
        await this.contaModel.update(
            { 'saldo': newSaldo },
            { where: { idConta: idConta } });
    }
    
}