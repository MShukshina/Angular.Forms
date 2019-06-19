import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {delay} from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [`
        input.ng-invalid {border:solid red 2px;}
        input.ng-valid {border:solid green 2px;}
    `],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-forms';

  nameControl: FormControl;
  fullNameControl: FormGroup;
  userListControl: FormGroup;

  subject$ = new Subject();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.nameControl = new FormControl('John', /*[Validators.minLength(3)]*//*, [myAsycValidator]*/);
    this.nameControl.valueChanges
      .pipe(takeUntil(this.subject$))
      .subscribe((value) => console.log(value));

    // this.nameControl.value;
    // this.nameControl.valid;
    // this.nameControl.errors;

    this.nameControl.statusChanges
      .pipe(takeUntil(this.subject$))
      .subscribe((status) => {
        console.log(this.nameControl.errors);
        console.log(status);
      });

    this.fullNameControl = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl()
    });

    this.fullNameControl.valueChanges
      .pipe(takeUntil(this.subject$))
      .subscribe((value) => {
        console.log(this.nameControl.errors);
        console.log(value);
      });

    // this.userListControl = new FormGroup({
    //   users: new FormArray([
    //       new FormControl('Alice'),
    //       new FormControl('Bob'),
    //       new FormControl('John')
    //     ])
    // });

    this.userListControl = this.formBuilder.group({
      users: this.formBuilder.array([
        ['Alice', [Validators.minLength(2), Validators.maxLength(5)], myAsycValidator],
        ['Bob', [Validators.minLength(2), Validators.maxLength(5)]],
        ['John', [Validators.minLength(2), Validators.maxLength(5)]]
      ])
    });

    this.userListControl.valueChanges
      .pipe(takeUntil(this.subject$))
      .subscribe((value) => {
        console.log(this.nameControl.errors);
        console.log(value);
      });

    this.userListControl.statusChanges
      .pipe(takeUntil(this.subject$))
      .subscribe((status) => {
        console.log(this.nameControl.errors);
        console.log(status);
      });
  }

  ngOnDestroy(): void {
    this.subject$.complete();
  }

  removeUserControl(index: number) {
    (this.userListControl.controls.users as FormArray).removeAt(index);
    // (this.userListControl.controls['users'] as FormArray).removeAt(index);
  }

  addUserControl() {
    (this.userListControl.controls.users as FormArray).push(new FormControl(''));
  }
}

function myAsycValidator(formControl: FormControl): Observable<ValidationErrors> {
  return new Observable<ValidationErrors | null >(observer => {
    setTimeout(() => {
      if (formControl.value.length > 7) {
        observer.next({
          nameError: 'Name must be at least 7 characters long.'
        });
        observer.complete();
      }
      observer.next(null);
      observer.complete();
    }, 1000);
  });
}


