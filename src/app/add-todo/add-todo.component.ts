import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ThemePalette} from '@angular/material/core';
import {MatChipListboxChange, MatChipsModule} from '@angular/material/chips';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    MatDialogModule, MatButtonModule,
    MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,
    MatFormFieldModule, FormsModule,
    MatInputModule, MatChipsModule
  ],
  templateUrl: './add-todo.component.html'
})
export class TodoAddComponent {
  public data = inject(MAT_DIALOG_DATA);

  get validate() {
    return this.data.title && this.data.time;
  }
  
  availableColors: any[] = [
    {name: '25 min', color: 'primary', value: 25},
    {name: '40 min', color: 'accent', value: 40},
    {name: '60 min', color: 'warn', value: 60},
    {name: 'Custom', color: undefined},
  ];

  updateTimeDuration({ "value": time }: MatChipListboxChange) {
    console.log(time);
    if (time !== 'Custom') {
      this.data.time = time;
    }
  }
}
