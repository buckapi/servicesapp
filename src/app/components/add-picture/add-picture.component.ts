import { Component } from '@angular/core';    
import { GlobalService } from 'src/app/services/global.service';  

@Component({
  selector: 'app-add-picture',
  templateUrl: './add-picture.component.html',
  styleUrl: './add-picture.component.css'
})  
export class AddPictureComponent {

  constructor(public global: GlobalService) {}

}
