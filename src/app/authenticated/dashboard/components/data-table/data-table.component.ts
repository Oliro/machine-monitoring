import { Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {

  public items: any[] = [];
  
}
