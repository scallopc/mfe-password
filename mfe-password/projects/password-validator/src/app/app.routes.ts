import { Routes } from '@angular/router';
import { PasswordPageComponent } from './pages/password/password-page.component';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  {
    path: '',
    component: PasswordPageComponent,
    providers: [provideHttpClient()],
  },
];
