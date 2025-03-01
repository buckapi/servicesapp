import { Component, Inject } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';  
import { CommonModule } from '@angular/common';
import { RealtimeEntriesService } from 'src/app/services/realtime-entries.service';
import { RealtimeCategoriesService } from '@app/services/realtime-categories.service';

@Component({
  selector: 'app-entity-01',
  imports: [
      CommonModule
  ],
  templateUrl: './entity-01.component.html',
  styleUrls: ['./entity-01.component.css']  // Fix styleUrl to styleUrls
})
export class Entity01Component {
  entityName: string = '';
  entityCaption: string = '';
  routeData: any; // Add a variable to store the route data

  constructor(
    @Inject(RealtimeEntriesService) 
    public realtimeEntriesService: RealtimeEntriesService,
    public globalService: GlobalService,
    @Inject(RealtimeCategoriesService) 
    public realtimeCategoriesService: RealtimeCategoriesService
  ) {
    this.globalService.getRouteData().then((data) => {
      this.routeData = data;
      console.log('Route Data:', this.routeData);
      // Optionally set entityName and entityCaption from routeData if needed
      if (this.routeData.default && this.routeData.default.length > 0) {
          this.entityName = this.routeData.default[0].entityName;
          this.entityCaption = this.routeData.default[0].entityCaption;
      }
    });
  }
}