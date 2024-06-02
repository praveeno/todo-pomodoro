import { Component, inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ShareDialog } from './share/share.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoListComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  name = (new URLSearchParams(location.search)).get('name');
  deferredPrompt: any;
  readonly #dialog = inject(MatDialog);

  constructor() {
    if (!this.name) {
      this.name = localStorage.getItem('name');
    } else {      
      localStorage.setItem('name', this.name);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevents the default mini-infobar or install dialog from appearing on mobile
      e.preventDefault();
      // Save the event because you'll need to trigger it later.
      this.deferredPrompt = e;
    });
  }

  registerInstallPWAEvent() {
    
  }

  async installApp() {
      // deferredPrompt is a global variable we've been using in the sample to capture the `beforeinstallevent`
      this.deferredPrompt.prompt();
      // Find out whether the user confirmed the installation or not
      const { outcome } = await this.deferredPrompt.userChoice;
      // The deferredPrompt can only be used once.
      this.deferredPrompt = null;
      // Act on the user's choice
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt.');
      } else if (outcome === 'dismissed') {
        console.log('User dismissed the install prompt');
      }
  }

  share() {
    this.#dialog.open(ShareDialog).afterClosed().subscribe(result => {
      if (navigator.share) {
        navigator.share({
          title: 'to-po',
          text: 'Check out Todo Pomodoro',
          url: 'https://chat-9102d.web.app/?name=' + this.name,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
      }
    });
  }
}
