import { Component, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  active = 'Dashboard';

  private platformId = inject(PLATFORM_ID);

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  setActive(label: string) {
    this.active = label;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('activeSection', label);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedActive = localStorage.getItem('activeSection');
      if (savedActive) {
        this.active = savedActive;
      }
    }
  }
}
