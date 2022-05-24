import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DownloadsComponent} from "./components/downloads/downloads.component";

const routes: Routes = [
  {
    path: '',
    component: DownloadsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
