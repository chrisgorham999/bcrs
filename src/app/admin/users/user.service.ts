import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { UserViewModel } from './user-view-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('/api/users')
  }

  getUser(email: string) {
    return this.http.get('/api/users/' + email)
  }

  createUser(user: User) {
    return this.http.post('/api/users/', {
      user
    })
  }

  updateUser(email: string, user: UserViewModel) {
    return this.http.put('/api/users/' + email, {
      user
    })
  }

  deleteUser(email: string) {
    return this.http.delete('/api/users/' + email)
  }
}
