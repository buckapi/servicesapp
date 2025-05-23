import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';  
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leftpanel',
  imports: [
    RouterModule        
  ],
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.css']
})
export class LeftpanelComponent {

  constructor(public globalService: GlobalService) {}
goHome() {
  this.globalService.setRoute('home');
}
  goConfig() {
    this.globalService.flag='app';

    this.globalService.setRoute('config');
  }
}