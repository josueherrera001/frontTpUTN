import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-calendardate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendardate.component.html',
  styleUrl: './calendardate.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendardateComponent),
      multi: true
    }
  ]
})
export class CalendardateComponent  implements ControlValueAccessor {

  @Input() label = 'Seleccionar fecha';
  @Input() placeholder = 'DD/MM/AAAA';
  @Input() required = false;
  @Input() disabled = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() showClearButton = true;

  @Output() dateChange = new EventEmitter<Date | null>();

  isOpen = false;
  selectedDate: Date | null = null;
  displayValue = '';

  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Calendario
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  weeks: Date[][] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    this.selectedDate = value;
    this.updateDisplayValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Abrir/cerrar calendario
  toggleCalendar() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.generateCalendar();
      }
    }
  }

  // Seleccionar fecha
  selectDate(date: Date) {
    if (this.isDateSelectable(date)) {
      this.selectedDate = new Date(date);
      this.updateDisplayValue();
      this.isOpen = false;

      this.onChange(this.selectedDate);
      this.onTouched();
      this.dateChange.emit(this.selectedDate);
    }
  }

  // Limpiar fecha
  clearDate(event: Event) {
    event.stopPropagation();
    this.selectedDate = null;
    this.displayValue = '';
    this.onChange(null);
    this.onTouched();
    this.dateChange.emit(null);
  }

  // Actualizar valor display
  private updateDisplayValue() {
    if (this.selectedDate) {
      this.displayValue = this.formatDate(this.selectedDate);
    } else {
      this.displayValue = '';
    }
  }

  // Formatear fecha
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Generar calendario
  generateCalendar() {
    this.weeks = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Ajustar primer día de la semana (0 = Domingo, 1 = Lunes)
    let startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()) + 1);

    const current = new Date(startDate);
    let week: Date[] = [];

    while (current <= endDate) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);

      if (week.length === 7) {
        this.weeks.push([...week]);
        week = [];
      }
    }
  }

  // Navegación del calendario
  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  // Verificaciones de fecha
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth;
  }

  isDateSelectable(date: Date): boolean {
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    return true;
  }

  // Obtener nombres
  getMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('es-ES', { month: 'long' });
  }

  getWeekDays(): string[] {
    return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  }

  // Cerrar calendario al hacer click fuera
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-container')) {
      this.isOpen = false;
    }
  }
  // Agregar estos métodos a la clase DatePickerComponent

getDayButtonClass(date: Date): string {
  const baseClasses = 'flex items-center justify-center font-medium transition-all duration-200';

  if (!this.isCurrentMonth(date)) {
    return `${baseClasses} text-gray-400 bg-transparent border-transparent hover:bg-gray-100 cursor-not-allowed`;
  }

  if (this.isSelected(date)) {
    return `${baseClasses} text-white bg-blue-500 border-blue-500 hover:bg-blue-600 font-semibold`;
  }

  if (this.isToday(date)) {
    return `${baseClasses} text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 font-semibold`;
  }

  if (!this.isDateSelectable(date)) {
    return `${baseClasses} text-gray-400 bg-gray-100 border-transparent cursor-not-allowed`;
  }

  return `${baseClasses} text-gray-700 bg-transparent border-transparent hover:bg-gray-100 hover:text-gray-900`;
}

}
