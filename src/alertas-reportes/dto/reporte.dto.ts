import { ArrayMinSize, IsArray, IsNumber, IsPositive, ValidateNested } from "class-validator";
import { SesionPuntajeDto } from "./sesion.puntaje.dto";
import { Type } from "class-transformer";


export class ReporteDto{
    @IsNumber()
    @IsPositive()
    idPaciente: number

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => SesionPuntajeDto)
    sesionesPuntajes: SesionPuntajeDto[]
}