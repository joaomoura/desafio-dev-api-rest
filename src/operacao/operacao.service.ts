import { Pessoa } from './../pessoa/pessoa.entity';
import { ContaService } from './../conta/conta.service';
import { PessoaService } from './../pessoa/pessoa.service';
import { Injectable } from '@nestjs/common';
import { TransacaoService } from './../transacao/transacao.service';

@Injectable()
export class OperacaoService {

    constructor(
        private readonly pessoaService: PessoaService,
        private readonly contaService: ContaService,
        private readonly transacaoService: TransacaoService
    ) { }

    public getDataDeHojeFormatada() {
        var dataAtual = new Date();
        var dia = dataAtual.getDate();
        var mes = (dataAtual.getMonth() + 1);
        var ano = dataAtual.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }

    async getPessoaByIdConta(idConta: number): Promise<Pessoa> {
        const conta = await this.contaService.show(idConta);
        const pessoa = await this.pessoaService.show(conta.idPessoa);
        return pessoa;
    }
}