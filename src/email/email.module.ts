// email.module.ts
import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";

@Module({
  providers: [EmailService],
  exports: [EmailService], // Exportar el servicio para usarlo en otros módulos
})
export class EmailModule {}
