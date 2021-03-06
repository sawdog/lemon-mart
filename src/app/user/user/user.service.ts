import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { AuthService } from '../../auth/auth.service'
import { CacheService } from '../../auth/cache.service'
import { transformError } from '../../common/common'
import { IUser, User } from './user'

export interface IUsers {
  data: IUser[]
  total: number
}

export interface IUserService {
  getUser(id: string): Observable<IUser>
  updateUser(id: string, user: IUser): Observable<IUser>
  getUsers(pageSize: number, searchText: string, pagesToSkip: number): Observable<IUsers>
}

@Injectable()
export class UserService extends CacheService implements IUserService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super()
  }

  getUser(id: string): Observable<IUser> {
    return this.httpClient.get<IUser>(`${environment.baseUrl}/v2/user/${id}`)
  }

  updateUser(id: string, user: IUser): Observable<IUser> {
    this.setItem('draft-user', user) // cache user data in case of errors
    const updateResponse = this.httpClient
      .put<IUser>(`${environment.baseUrl}/v2/user/${id}`, user)
      .pipe(map(User.Build), catchError(transformError))

    updateResponse.pipe(
      tap(
        res => {
          this.authService.currentUser$.next(res)
          this.removeItem('draft-user')
        },
        err => throwError(err)
      )
    )

    return updateResponse
  }

  getUsers(
    pageSize: number,
    searchText = '',
    pagesToSkip = 0,
    sortColumn = '',
    sortDirection: '' | 'asc' | 'desc' = 'asc'
  ): Observable<IUsers> {
    const recordsToSkip = pageSize * pagesToSkip
    if (sortColumn) {
      sortColumn = sortDirection === 'desc' ? `-${sortColumn}` : sortColumn
    }
    return this.httpClient.get<IUsers>(`${environment.baseUrl}/v2/users`, {
      params: {
        filter: searchText,
        skip: recordsToSkip.toString(),
        limit: pageSize.toString(),
        sortKey: sortColumn,
      },
    })
  }
}
