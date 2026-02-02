import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  step?: number;
  min?: number;
}

export default function InputField({ label, value, onChange, disabled, step = 1, min }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        step={step}
        min={min}
        className="w-full"
      />
    </div>
  );
}
