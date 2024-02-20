import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {

  public items: any[] = [];

  constructor( public facade: FacadeService){}

  ngOnInit(): void {
    this.facade.load();
  }

}
