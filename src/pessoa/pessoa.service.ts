import { Injectable, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pessoa } from './pessoa.entity';

@Injectable()
export class PessoaService {
    constructor(
        @InjectModel(Pessoa)
        private pessoaModel: typeof Pessoa
    ) { }

    async index(): Promise<Pessoa[]> {
        return await this.pessoaModel.findAll();
    }

    async show(idPessoa: number): Promise<Pessoa> {
        return await this.pessoaModel.findByPk(idPessoa);
    }

    async store(pessoa: Pessoa): Promise<Pessoa> {
        return await this.pessoaModel.create(pessoa);
    }

    async update(pessoa: Pessoa): Promise<[number, Pessoa[]]> {
        return await this.pessoaModel.update(pessoa, {
            where: { idPessoa: pessoa.idPessoa }
        });
    }

    async updateById(idPessoa: number, pessoa: Pessoa): Promise<[number, Pessoa[]]> {
        return await this.pessoaModel.update(pessoa, {
            where: { idPessoa: idPessoa }
        });
    }

    async destroy(idPessoa: number) {
        const pessoa: Pessoa = await this.show(idPessoa);
        pessoa.destroy();
    }
}