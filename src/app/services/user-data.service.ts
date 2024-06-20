import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';
import { SignalService } from './signal.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private users$ = new BehaviorSubject<ReadonlyMap<number, UserModel>>(
    new Map()
  )

  private ids$ = new BehaviorSubject<number[]>([]);

  constructor(private userService: UserService, private signalService: SignalService) {
    this.load()
    this.signalService.getSocket()?.on('user', () => this.load())
  }

  public getAll(): Observable<UserModel[]> {
    return combineLatest([this.ids$, this.users$]).pipe(
      map(([ids, users]: [number[], ReadonlyMap<number, UserModel>]): UserModel[] =>
        ids.map((id: number): UserModel | undefined => users.get(id))
          .filter((user?: UserModel): user is UserModel => !!user)
      )
    )
  }

  public getById(id: number): Observable<UserModel | null> {
    return this.users$.pipe(
      map((user: ReadonlyMap<number, UserModel>) => user.get(id) ?? null),
    )
  }

  private load() {
    this.userService
      .getAll()
      .subscribe((users: UserModel[]) => {
        const ids = [];
        const userMap = new Map<number, UserModel>();

        for (const user of users) {
          ids.push(user.ID);
          userMap.set(user.ID, user);
        }

        this.update(ids, userMap)
      })
  }

  private update(ids: number[], userMap: Map<number, UserModel>) {
    this.ids$.next(ids);
    this.users$.next(userMap)
  }
}
