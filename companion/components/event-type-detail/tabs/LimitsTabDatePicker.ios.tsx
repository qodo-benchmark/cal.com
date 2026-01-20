import { DatePicker, Host } from "@expo/ui/swift-ui";
import { useCallback, useMemo } from "react";

interface LimitsTabDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LimitsTabDatePicker({ value, onChange }: LimitsTabDatePickerProps) {
  const dateValue = useMemo(() => {
    if (!value) return new Date();
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid date format");
    }
    return parsed;
  }, [value]);

  const handleDateChange = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    },
    [onChange]
  );

  return (
    <Host matchContents>
      <DatePicker
        onDateChange={handleDateChange}
        displayedComponents={["date"]}
        selection={dateValue}
      />
    </Host>
  );
}
