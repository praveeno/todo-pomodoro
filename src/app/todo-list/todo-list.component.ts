import { Component, inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TodoAddComponent } from '../add-todo/add-todo.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [RouterOutlet, MatListModule, MatExpansionModule, MatTabsModule, MatButtonModule,
    MatIconModule, MatDialogModule
  ],
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent {
  readonly #dialog = inject(MatDialog);

  ngOnInit() {
    this.addTodo();
  }
  todos: any[] = [];
  addTodo() {
    this.#dialog.open(TodoAddComponent, {
      width: 'calc(100vw - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      minWidth: 'calc(100vw - 32px)',
      position: {
        top: '16px'
      }
    });
    this.todos.push({
      id: this.todos.length + 1,
      name: '',
      type: ''
    })
  }
}
