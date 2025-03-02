import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { RealtimeItemInspectionsService } from '@app/services/realtime-iteminspections.service';

@Component({
  selector: 'app-winzard',
  imports: [CommonModule  ],
  templateUrl: './winzard.component.html',
  styleUrl: './winzard.component.css'
})
export class WinzardComponent {
  inspections: any[] = [];
constructor(public global: GlobalService,
  public realtimeItemInspectionsService: RealtimeItemInspectionsService
) {
  this.realtimeItemInspectionsService.itemInspections$.subscribe(items => {
    this.inspections = items;
  });
}

}
