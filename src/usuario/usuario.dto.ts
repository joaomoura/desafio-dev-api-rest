import { IsNotEmpty, Length } from 'class-validator';

export class ItemDTO {
    // constructor(){
    //     console.log("Chegou");
    // }

    @IsNotEmpty({ groups: ['registration'] })
    name: string;

    @IsNotEmpty({ groups: ['registration'] })
    description: string;

    @IsNotEmpty({ groups: ['registration'] })
    unitPrice: number;

    @Length(2, 20, { groups: ['registration'] })
    quantity: number;
}