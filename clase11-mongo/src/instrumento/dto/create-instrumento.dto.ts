import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNumber, IsObject, IsPositive, IsString, ValidateNested } from "class-validator";

export class Sonido {
    @IsString()
    nombre: string;

    @IsNumber()
    frecuencia: number;
}

export class CreateInstrumentoDto {
    @IsString()
    @IsDefined()
    marca: string;

    @IsString()
    @IsDefined()
    tipo: string;

    @IsNumber()
    @IsPositive()
    @IsDefined()
    precio: number;

    @IsArray()
    @IsString({ each: true })
    partituras: string[];

    @IsObject({ message: 'Los sonidos deben ser un objeto con nombre y frecuencia' })
    @Type(() => Sonido)
    @ValidateNested()
    @IsDefined()
    sonidos: Sonido;
}
