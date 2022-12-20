import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { SlidesService } from '../../services/slides.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  onCreatePage = false
  onViewPage = false

  constructor(private router: Router, private slidesService: SlidesService) {
    router.events.subscribe(v => {
      if (v instanceof NavigationEnd) {
        this.onCreatePage = v.url.includes('create')
        this.onViewPage = v.url.includes('view')
      }
    })
  }

  onBack() {
    this.slidesService.resetSlides()
  }
}
