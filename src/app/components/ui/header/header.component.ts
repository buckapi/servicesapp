import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
theme='light'
  constructor(public global: GlobalService) {}

  ngOnInit() {
    this.toggleTheme();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.global.toggleTheme();
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', this.global.theme);
  }
}
