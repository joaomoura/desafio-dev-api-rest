import { registerDecorator, ValidationOptions, ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ContaService } from 'src/conta/conta.service';

@Injectable()
@ValidatorConstraint()
export class IsValorMaiorQueLimitDiarioConstraint implements ValidatorConstraintInterface {

    constructor(private contaService: ContaService) { }

    validate(valor: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return !!!this.contaService.isValorMaiorQueLimiteDiario(valor);
    }
}

export function IsMaiorQueLimiteDiario(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValorMaiorQueLimitDiarioConstraint,
        });
    };
}