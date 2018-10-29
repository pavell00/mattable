import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Employee } from './employee';

import {Observable} from 'rxjs';
import { pipe} from 'rxjs';
import { BehaviorSubject, Subject, range, of, forkJoin, zip } from "rxjs";
import { take, takeLast, filter, map, tap, find, flatMap, distinct  } from 'rxjs/operators';
import { dispatchEvent } from '@angular/core/src/view/util';

//import "rxjs/add/operator/combineLatest";

@Injectable()
export class DataService {

  dataUrl = '../assets/all_AD_users_old.json';
  arrEmpl: BehaviorSubject<Employee[]> = new Employee()[0];
  empl: Subject<Employee[]> = new Subject<Employee[]>();
  arr: Employee[]=[];
  arr2: any[]=[];
  
  constructor(private http: HttpClient) { }

  getADUsers() {
    //return this.http.get<Employee[]>(this.dataUrl);
    const a = this.http.get<Employee[]>(this.dataUrl);
    //this.arrEmpl.next(a)
    //a.subscribe(res => this.arrEmpl.next(a.))
    /*
    return a
      .pipe(
        map(data  => data.map( item => item)
            ),
        filter(item => this.arrEmpl = <Employee>(item)),
        
        //takeLast(10)
      )*/
  }

  getPostsPerUser() {
    return this.http.get<Employee[]>(this.dataUrl).pipe(
      map(res => res),
      flatMap((result : Array<Employee>) => {
        return forkJoin(
          result.map((user : Employee) => (user)));
      }))
  }

  getPost() :Observable<Employee[]> {
    return this.http.get<Employee[]>(this.dataUrl).pipe(
      //tap(res => console.log(res)),
      map(res => this.arr = (res)) 

    )
  }

  /*
  getAuthorWithBooks(id: number): Observable<any> {
    return Observable.forkJoin([
      this.http.get('/api/authors/' + id).map(res => res.json()),
      this.http.get('/api/authors/' + id + '/books').map(res => res.json())
    ])
    .map((data: any[]) => {
      let author: any = data[0];
      let books: any[] = data[1];
      return author.books = books;
    });
  }*/

  findEmployees(str: string) {
    return this.arrEmpl
    .pipe(
      map(r => <Employee>r),
      find(r => r.Name  === str) )
  }

  get2(str: string){
    let one = of(this.http.get<Employee[]>(this.dataUrl));
    let two = of(this.http.get<Employee[]>(this.dataUrl));
    let three = of(this.http.get<Employee[]>(this.dataUrl));

    this.arr = [];
    this.empl.next(this.arr);
    forkJoin(
      one.pipe(
        //tap(r=>console.log(r)),
        flatMap(r=> r),
        tap(w => {w.forEach(element => {
              if (element.Name.toLowerCase().includes(str)) {
                this.arr.push(element);
              }
            });
          })
      ),
      one.pipe(
        flatMap(r=> r),
        //filter(w => w.MobilePhone !== null),
        //filter(q=> q.MobilePhone.includes('+'))
        tap(w => {w.forEach(element => {
          if (element.MobilePhone != null && element.MobilePhone.includes(str)) {
            this.arr.push(element);
            //console.log(this.arr);
          }
        });
      })
      ),
      one.pipe(
        flatMap(r=> r),
        tap(w => {w.forEach(element => {
          if (element.EmailAddress != null && element.EmailAddress.includes(str)) {
            this.arr.push(element);
          }
        });
      })
      )
      ).subscribe(a=> {
      //console.log(JSON.stringify(a));
      this.empl.next(this.arr);
      //console.log(this.arr);
    })
    
  }

}