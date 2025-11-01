import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class PuntajeDto {
  @IsEmail()
  @IsNotEmpty()
  usuarioEmail: string;

  @IsString()
  @IsNotEmpty()
  usuarioNombre: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  puntaje: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  umbralMinimo: number;
}