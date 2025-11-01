import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";

export class PuntajeDto {
  @IsEmail()
  @IsNotEmpty()
  usuarioEmail: string;

  @IsString()
  @IsNotEmpty()
  nombrePaciente: string;

  @IsString()
  @IsNotEmpty()
  nombreDoctor: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  puntaje: number;

  @IsNumber()
  @IsPositive()
  sesion: number

  @IsNumber()
  @Min(0)
  @Max(100)
  umbralMinimo: number;
}