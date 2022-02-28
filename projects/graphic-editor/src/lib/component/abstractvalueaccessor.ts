import { ControlValueAccessor } from '@angular/forms';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  value$: any;

  onChange = (_: any) => {};
  onTouched = () => {};

  get value(): any {
    return this.value$;
  }
  set value(v: any) {
    if (v !== this.value$) {
      this.value$ = v;
      this.onChange(v);
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
