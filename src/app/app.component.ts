import { Component, OnInit, OnDestroy } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Employee } from './employee'
import { DataService } from './data.service'
import { Subject, pipe, forkJoin, Observable, of } from 'rxjs';
import { takeUntil, distinct, tap, flatMap, filter, merge, map, concat, mergeMap, mergeAll, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  dsEmployees : Employee[] = [];
  dsEmployees2 : Employee[] = [];
  componentDestroyed$: Subject<boolean> = new Subject();//for unsubscribe observers

  constructor(private dataService: DataService) {}

  ngOnInit() {
    //this.dataService.getADUsers();
    /*this.dataService.getPost().pipe(
      takeUntil(this.componentDestroyed$))
      .subscribe( v => v )*/
/*    this.dataService.getADUsers("00")
      .subscribe(
        data => {this.dsEmployees = data}
      )*/
      //this.onStart();
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  onSearch(str: string) {
    this.dsEmployees = [];
    //this.dsEmployees = this.dataService.arr.filter(item => item.Name.includes(str))
    
    //find in one stream
    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        filter(w => w.Name.includes(str)),
        filter(w => w.MobilePhone !== null),
        filter(w => w.MobilePhone.includes(str)),
        //tap(x => this.dsEmployees.push(x))
      ).subscribe(x => this.dsEmployees.push(x))

      //find in few streams
      //this.onSearch2('');
  }

  onStart() {
    this.dsEmployees = [];
    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        take(10)
      ).subscribe(x => this.dsEmployees.push(x))
  }

  //find in few streams
  onSearch2(str: string) {
    /*let zero = this.dataService.getPost()
    .pipe(
      takeUntil(this.componentDestroyed$),
      //flatMap(data => data),
      //filter(w => w.Name.includes(str))
    ).subscribe(x => x)

    let zero1 = this.dataService.getPost()
    .pipe(
      takeUntil(this.componentDestroyed$),
      flatMap(data => data),
      filter(w => w.Name.includes(str))
    ).subscribe(x => x)*/
    
    let a
    let first:Observable<Employee[]> = of([{Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);
    let second:Observable<Employee> = of({Name:"www",valEmailAddressue:"2@3",Office:"Благо Украина",MobilePhone:"23"});
    let three:Observable<Employee[]> = of([{Name:"eee",valEmailAddressue:"3@3",Office:"Благо Украина",MobilePhone:"34"}]);
    let four:Observable<Employee[]> = of([{Name:"rrr",EmailAddress:"4@4",Office:"Благо Украина",MobilePhone:"45"},
                                          {Name:"tt",EmailAddress:"5@5",Office:"Благо Украина",MobilePhone:"56"},
                                          {Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);

    forkJoin(first, three, four).pipe(
      map(([a1, a2, a3]) => [...a1, ...a2, ...a3]),
      flatMap(a => a),
      distinct((e: Employee) => e.Name)
      //tap(res => console.log(res))
    ).subscribe(x => console.log(x))

    /*forkJoin(three,four).pipe(
      map(n=>n))
                .subscribe((res:Array<Employee[]>) =>  console.log(res));*/

    //{this.dsEmployees2.concat(...res, ...res);
    /*a.pipe(
      merge(first, second)
    ).subscribe(s => console.log(s))*/
    
    //first.merge(second).subscribe(res => this.mergeStream.push(res));
  }
  
  //find in few streams
  onSearch3(str: string) {
    this.dsEmployees = [];
    let name$: Observable<Employee[]>;
    let phone$: Observable<Employee[]>;
    let nn:Employee[]=[];
    let na:Employee[]=[];

    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        filter(w => w.Name != null),
        filter(w => w.Name.includes(str)),
        //tap(x => this.dsEmployees.push(x))
      ).subscribe(x => {this.dsEmployees.push(x);
                        nn.push((x));
                        //
                  })

    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        filter(w => w.MobilePhone != null),
        filter(w => w.MobilePhone.includes(str)),
        //tap(x => this.dsEmployees.push(x))
      ).subscribe(x => {//this.dsEmployees.push(x);
                        na.push(x) ;
                  })

    //console.log(nn, na)
    //nn = ([{Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);
    //na = ([{Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);
    console.log(nn, na)
    name$= of(nn);
    phone$= of(na);
    
    forkJoin(name$, phone$).pipe(
      takeUntil(this.componentDestroyed$),
      map(([a1, a2]) => [...a1, ...a2]),
      flatMap(a => a),
      distinct((e: Employee) => e.Name),
      //tap(res => console.log(res))
    ).subscribe(x => { console.log(x)})
  }

  onSearch4(str: string) {
    const subject = new Subject();
    const observable = subject.asObservable();

    this.dsEmployees = [];
    let name$: Observable<Employee[]>;
    let phone$: Observable<Employee[]>;
    let nn:Employee[]=[];
    let na:Employee[]=[];

    observable.subscribe( );

    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        filter(w => w.Name != null),
        filter(w => w.Name.includes(str)),
        //tap(x => this.dsEmployees.push(x))
      ).subscribe(x => {//this.dsEmployees.push(x);
                        nn.push((x));
                        subject.next(x);
                        //
                  })

    this.dataService.getPost()
      .pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(data => data),
        filter(w => w.MobilePhone != null),
        filter(w => w.MobilePhone.includes(str)),
        //tap(x => this.dsEmployees.push(x))
      ).subscribe(x => {//this.dsEmployees.push(x);
                        na.push(x);
                        subject.next(x);
                  })

    //console.log(nn, na)
    //nn = ([{Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);
    //na = ([{Name:"qqq",EmailAddress:"1@1",Office:"Благо Украина",MobilePhone:"12"}]);
    console.log(subject.pipe(tap(x => console.log(x))))
    
    /*console.log(nn, na)
    name$= of(nn);
    phone$= of(na);
    
    forkJoin(name$, phone$).pipe(
      takeUntil(this.componentDestroyed$),
      map(([a1, a2]) => [...a1, ...a2]),
      flatMap(a => a),
      distinct((e: Employee) => e.Name),
      //tap(res => console.log(res))
    ).subscribe(x => { console.log(x)})*/
  }

  get2(str: string) {
    this.dataService.get2(str);
    this.dataService.empl.subscribe(e => {
      let a = of(e);
      //console.log(e.length);
      this.dsEmployees = [];
      a.pipe(
        takeUntil(this.componentDestroyed$),
        flatMap(a => a),
        distinct(w=>w.Name)
      ).subscribe(x => {
        this.dsEmployees.push(x);
        //console.log(x);
        })
      })
  }
  
  get3(str: string) {
    this.dataService.get3(str);
    this.dataService.empl2.subscribe(e => {
       //console.log(e.length);
      this.dsEmployees = e;
      })
  }

  onExpandPanel(e: Employee) {
    //console.log(e);
  }

}  
