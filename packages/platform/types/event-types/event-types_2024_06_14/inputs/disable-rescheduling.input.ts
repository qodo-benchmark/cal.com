import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class DisableRescheduling_2024_06_14 {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "If true, rescheduling is always disabled for this event type.",
    example: true,
  })
  disabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description:
      "Rescheduling will be unavailable within the specified time window before your meeting starts. If set, `disabled` should be false or undefined.",
    example: 60,
  })
  minutesBefore?: number;
}

