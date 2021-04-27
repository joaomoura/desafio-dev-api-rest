import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UsePipes } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.entity';

@Controller('pessoas')
export class PessoaController {
    constructor(private pessoaService: PessoaService) { } 

    @Get()
    async index(): Promise<Pessoa[]> {
        return await this.pessoaService.index();
    }

    @Get(':idPessoa')
    async show(@Param() params): Promise<Pessoa> {
        const pessoa = await this.pessoaService.show(params.idPessoa);
        if (!pessoa) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Pessoa não encontrada.'
            });
        }
        return pessoa;
    }

    @Post()
    async store(@Body() pessoa: Pessoa, @Res() res) {
        const newPessoa = await this.pessoaService.store(pessoa);

        res.status(HttpStatus.CREATED)
            .location(`/pessoas/${newPessoa.idPessoa}`)
            .json(newPessoa);
    }

    @Put()
    async update(@Body() pessoa: Pessoa): Promise<[number, Pessoa[]]> {
        return await this.pessoaService.update(pessoa);
    }

    @Put(':idPessoa')
    async updateById(@Param() params, @Body() pessoa: Pessoa): Promise<[number, Pessoa[]]> {
        return await this.pessoaService.updateById(params.idPessoa, pessoa);
    }

    @Delete('/:idPessoa')
    async destroy(@Param('idPessoa') idPessoa: number) {
        return this.pessoaService.destroy(idPessoa);
    }
}