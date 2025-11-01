import { IsDate, IsNumber, IsPositive } from "class-validator"

export class SesionPuntajeDto{

    @IsDate()
    fechaInicio: Date

    @IsNumber()
    @IsPositive()
    sessionRecall: number

    @IsNumber()
    @IsPositive()
    sessionComision: number

    @IsNumber()
    @IsPositive()
    sessionOmision: number

    @IsNumber()
    @IsPositive()    
    sessionCoherencia: number

    @IsNumber()
    @IsPositive()
    sessionFluidez: number

    @IsNumber()
    @IsPositive()
    sessionTotal: number
}