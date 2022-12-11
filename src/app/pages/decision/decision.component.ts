import { Component } from '@angular/core';
import { SlidesService } from '../../services/slides.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.scss']
})
export class DecisionComponent {

  constructor(private slidesService: SlidesService, private router: Router) {}

  onFileUpload(fileContent: string) {
    this.slidesService.uploadSlides(fileContent)
    this.router.navigate(['/view'])
  }
}
