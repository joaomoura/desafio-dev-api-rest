import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorConstraint } from 'class-validator';
import { Pessoa } from './pessoa.entity';

@Injectable()
@ValidatorConstraint()
export class PessoaValidationPipe implements PipeTransform {

    async transform(entity: any, metadata: ArgumentMetadata) {

        console.log(entity);

        // Dynamically determine the groups
        const groups = [];
        // if (entity.seusername == 'joaomoura') {
        //     groups.push('valid');
        // }

        groups.push('valid');

        // Transform to class with groups
        const entityClass = plainToClass(Pessoa, entity, { groups });

        // Validate with groups
        const errors = await validate(entityClass, { groups });
        if (errors.length > 0) {
            throw new HttpException(`Validation failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
        }

        // return entity;
        console.log(errors);
        return entity;
    }

    private isEmpty(value: any) {
        if (Object.keys(value).length < 1) {
            return true;
        }
        return false;
    }

    private formatErrors(errors: any[]) {
        return errors.map(error => {
            for (let key in error.constraints) {
                return error.constraints[key];
            }
        }).join(', ');
    }
}