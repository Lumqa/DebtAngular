import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';
//import { userInfo } from 'os';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.email,Validators.required]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(4)]],
                confirmPassword: ['', Validators.required]
              },{ validator: this.comparePasswords })
        });
    }

    comparePasswords(fb: FormGroup) {
        let confirmPswrdCtrl = fb.get('confirmPassword');
        //passwordMismatch
        //confirmPswrdCtrl.errors={passwordMismatch:true}
        if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
          if (fb.get('password').value != confirmPswrdCtrl.value)
            confirmPswrdCtrl.setErrors({ passwordMismatch: true });
          else
            confirmPswrdCtrl.setErrors(null);
        }
      }


    // convenience getter for easy access to form fields
    get formField() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.registerForm.value

        let user: User = new User();
        user.email = this.registerForm.value.email;
        user.password = this.registerForm.value.passwords.password;


        this.loading = true;
        this.userService.register(user)
            .pipe(first())
            .subscribe(
                data => {
                this.alertService.success('Registration successful', true);
                console.log(data);
                localStorage.setItem('currentUser', JSON.stringify(data));
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
