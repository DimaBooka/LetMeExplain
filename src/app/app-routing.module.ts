import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CreateExplanationComponent } from './pages/create-explanation/create-explanation.component'
import { ViewExplanationComponent } from './pages/view-explanation/view-explanation.component'
import { DecisionComponent } from './pages/decision/decision.component'

const routes: Routes = [
  { path: '', component: DecisionComponent },
  { path: 'create', component: CreateExplanationComponent },
  { path: 'view', component: ViewExplanationComponent },
  { path: '**', redirectTo: '/' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
