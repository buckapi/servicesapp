import { Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from './components/ui/header/header.component';
import { SearchbarComponent } from './components/ui/searchbar/searchbar.component';
import { LeftpanelComponent } from './components/ui/leftpanel/leftpanel.component';
import { Entity01Component } from './components/entity-01/entity-01.component';
import { GlobalService } from './services/global.service';
import { CommonModule } from '@angular/common';
import { AddPictureComponent } from './components/add-picture/add-picture.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from './components/login/login.component';
import { NewRecordComponent } from "./components/new-record/new-record.component";
import { ClientsComponent } from './components/clients/clients.component';
import { AuthPocketbaseService } from './services/auth.service';
import { ConfigComponent } from './components/config/config.component';
import { VisitTrackerService } from './services/visit-tracker.service';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ConfigComponent,
    ClientsComponent,
    NewRecordComponent,
    CommonModule,
    HeaderComponent,
    LoginComponent,
    MatDialogModule,
    MatFormFieldModule,
    CarDetailComponent,
    MatInputModule,
    MatButtonModule, HomeComponent, NewRecordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'administrator-techwave';
  theme='light'
  constructor(
    private visitTrackerService: VisitTrackerService,
    public authService: AuthPocketbaseService,  public globalService: GlobalService, private renderer: Renderer2) {
   
      this.visitTrackerService.trackVisit();

      this.toggleTheme();
  }
goconfig(){
  this.globalService.flag='app';
  this.globalService.setRoute('config');
}
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.globalService.toggleTheme();
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', this.globalService.theme);
  }
}
