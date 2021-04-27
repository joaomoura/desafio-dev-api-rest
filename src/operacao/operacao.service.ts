import { Injectable, Delete } from '@nestjs/common';

@Injectable()
export class OperacaoService {
    public getDataDeHojeFormatada() {
        var dataAtual = new Date();
        var dia = dataAtual.getDate();
        var mes = (dataAtual.getMonth() + 1);
        var ano = dataAtual.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }
}