import { Component, EventEmitter, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-data',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  templateUrl: './filter-data.component.html',
  styleUrl: './filter-data.component.scss'
})
export class FilterDataComponent {

  public filter: any = [];

  public startDate!: Date;
  public endDate!: Date;


  @Output() public filterDateSelected = new EventEmitter<any>();

  emitDateFilter() {
    this.filterDateSelected.emit(this.filter)
  }

  resetFilter() {
    this.filter = [];
  }

}
