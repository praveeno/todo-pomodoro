import { Component, inject, signal, effect } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TodoAddComponent } from '../add-todo/add-todo.component';
import { switchMap, tap } from 'rxjs';

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
  todoTimeHash: Record<string, any> = {};

  constructor() {
    effect(() => {
      this.saveLocalStorage()   
    });
  }

  saveLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }
  
  ngOnInit() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos.set(JSON.parse(storedTodos));
      this.todos().forEach(todo => {
        todo.start && this.runTimer(todo);
      });
    }

    if (this.todos().length === 0) {
      this.addTodo();
    }
  }
  todos = signal<any[]>([]);
  addTodo() {
    const ref = this.#dialog.open(TodoAddComponent, {
      width: 'calc(100vw - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      minWidth: 'calc(100vw - 32px)',
      position: {
        top: '16px'
      },
      data: {}
    });
    this.handleBackground(ref);
    ref.afterOpened
    ref.afterClosed().subscribe(result => {
      if (result) {
        if (typeof result.time === 'string') {
          const time = result.time.split(':').map(Number);
          result.time = (time[0] / 60) +  time[1];
        }
        const now = +new Date();
        const todoSignal = {
          id: Math.random().toString(36).slice(5),
          timestamp: now,
          timeTill: now + (result.time * 60 * 1000),
          start: false,
          ...result
        }; 
        this.runTimer(todoSignal, true);
        this.todos.update(todos => {
          const _todos = [...todos, todoSignal]
          // localStorage.setItem('todos', JSON.stringify(_todos));
          return _todos;
        });
      }
    });
  }

  toggleTimer(todo: any) {
    todo.start = !todo.start;
    if (todo.start) this.runTimer(todo);
    else clearTimeout(this.todoTimeHash[todo.id]);

    this.saveLocalStorage();
  }

  deleteTodo(id: string) {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds = +((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  // write a function to run timer based on timestamp and time of todo
  runTimer(todo: any, init = false) {

    const now = +new Date();
    const timeLeft = todo.timeTill - now;
    // const diffDate = Math.ceil(timeLeft / 1000);

    todo.timeLeft = this.millisToMinutesAndSeconds(timeLeft);

    if (timeLeft > 0) {
      this.todoTimeHash[todo.id] = !init && setTimeout(() => {
        this.runTimer(todo);
      }, 1000);
    } else {
      todo.start = false;
      // Add code to handle timer completion here
    }
  }

  handleBackground(ref: any) {
    const containerBackdrop = document.querySelector('.cdk-overlay-container .cdk-overlay-backdrop');
    if (containerBackdrop) {
      containerBackdrop.innerHTML = `
      <div class='ripple-background'>
        <div class='circle xxlarge shade1'></div>
        <div class='circle xlarge shade2'></div>
        <div class='circle large shade3'></div>
        <div class='circle mediun shade4'></div>
        <div class='circle small shade5'></div>
      </div>
      `
    }

    let background = ''
    ref.afterOpened().pipe(
      tap(() => {
        if (containerBackdrop) containerBackdrop.classList.add('filterBlur');
        background = document.body.style.background;
        document.body.style.background = '#3399ff';
      }),
      switchMap(() => ref.afterClosed()),
      tap(() => {
        document.body.style.filter = 'none';
        document.body.style.background = background;
      })
    ).subscribe();
  }

  saveNote(todo: any, content: string) {
    todo.note = content;
    this.saveLocalStorage();
  }
}
