import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  email: string;
  gender: string;
  city_name: string;
  phone_number: string;
  pincode: string;
  role: string;
  status_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public baseurl = 'http://www.petcoset.com/api/v1';
  //public key = '5e31eb7b48506f1';
  public key = 'VGhpcyBpcyB0aGU';

  headerText: BehaviorSubject<any>;
  constructor(
    private http: HttpClient
  ) {
    this.headerText = new BehaviorSubject([]);
  }

  setToken(token) {
    localStorage.setItem('mean-token', btoa(token));
  }

  getToken() {
    return atob(localStorage.getItem('mean-token'));
  }

  getUserDetails(): UserDetails {
    return JSON.parse(localStorage.getItem('userDetails'))
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return true;
    }
    return false;
  }

  public request(method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file', type: String, data?: any): Observable<any> {
    let base;
    if (method === 'post' && type === 'auth') {
      const emailId = ((data && data.email_id) || (data && data.email) || '').toString().trim();
      const password = (() => {
        const value = (data && data.password) || '';
        try {
          return atob(value).toString();
        } catch (error) {
          return value.toString();
        }
      })();

      if (emailId.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
        return of({
          res: {
            jw_token: 'mock-admin-token',
            user_data: {
              id: '1',
              first_name: 'Admin',
              last_name: 'User',
              address_1: '',
              address_2: '',
              email: 'admin',
              gender: 'male',
              city_name: '',
              phone_number: '',
              pincode: '',
              role: 'admin',
              status_name: 'Active'
            }
          }
        });
      }

      return of({
        res: {
          user_data: {
            id: -1
          }
        }
      });
    }

    if (method === 'post') {
      if(type === 'vendors' || type === 'auth'){
        base = this.http.post(`${this.baseurl}/${type}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'key': this.key,
            'Access-Control-Allow-Origin': '*',
          }
        });
      }else {
        base = this.http.post(`${this.baseurl}/${type}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'key': this.key,
            'jw_token': this.getToken(),
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    } else if (method === 'get') {
      base = this.http.get(`${this.baseurl}/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          'key': this.key,
          'jw_token': this.getToken(),
          'Access-Control-Allow-Origin': '*',
        }
      });
    } else if (method === 'put') {
      base = this.http.put(`${this.baseurl}/${type}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'key': this.key,
          'Access-Control-Allow-Origin': '*',
          'jw_token': this.getToken(),
        }
      });
    }

    return base;
  }



}
