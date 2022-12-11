import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  onCreatePage = false
  onViewPage = false

  constructor(private router: Router) {
    router.events.subscribe(v => {
      if (v instanceof NavigationEnd) {
        this.onCreatePage = v.url.includes('create')
        this.onViewPage = v.url.includes('view')
      }
    })
  }
}
