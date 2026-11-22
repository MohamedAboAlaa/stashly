import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { BusinessErrorService } from './core/services/business-error.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stashly';
  protected readonly businessError = inject(BusinessErrorService);
}
