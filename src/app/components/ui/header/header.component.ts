import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth.service';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
theme='light'
  constructor(public global: GlobalService,
    public auth:AuthPocketbaseService 
  ) {}
gotohome() {
  this.global.flag='app';
  this.global.activeRoute='home';
  this.global.showDetail=false;
  // this.globalService.setRoute('home');
}
  ngOnInit() {
    this.toggleTheme();
  }
goConfig() {
  this.global.flag='ui';

  this.global.setRoute('config');
}

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.global.toggleTheme();
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', this.global.theme);
  }
}
