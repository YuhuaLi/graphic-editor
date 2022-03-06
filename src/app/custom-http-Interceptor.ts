import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((event: HttpEvent<any>) => {
        if (event instanceof HttpResponseBase) {
          return of(
            new HttpResponse({
              status: 200,
              body: [
                ['product', '2015', '2016', '2017'],
                [
                  'Matcha Latte',
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
                [
                  'Milk Tea',
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
                [
                  'Cheese Cocoa',
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
                [
                  'Walnut Brownie',
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              ],
            })
          );
        }
        return of(event);
      })
    );
  }
}
