import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [RouterOutlet,MatDialogModule, MatButtonModule,
    MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,
    MatFormFieldModule, FormsModule, ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './add-todo.component.html'
})
export class TodoAddComponent {
    public data = inject(MAT_DIALOG_DATA);

    public formControl = new FormControl();

}
