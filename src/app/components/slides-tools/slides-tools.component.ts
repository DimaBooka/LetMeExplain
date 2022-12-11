import { Component } from '@angular/core';
import { SlidesService } from '../../services/slides.service'

@Component({
  selector: 'app-slides-tools',
  templateUrl: './slides-tools.component.html',
  styleUrls: ['./slides-tools.component.scss']
})
export class SlidesToolsComponent {
  constructor(public slidesService: SlidesService) {}
}
