import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './type';

// export interface IGraphicEditorService {
//   addPage(): Observable<Page>;
// }
@Injectable()
export class GraphicEditorService {
  DB_NAME = 'ExampleDB';
  PAGE_TABLE = 'page';

  constructor() {}

  addPage(): Observable<Page> {
    return new Observable((observer) => {
      this.openDB().then((db) => {
        const store = this.getObjectStore(db, this.PAGE_TABLE, 'readwrite');
        const request = store.add({
          style: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
          widgets: [],
        });
        request.onsuccess = (ev: any) => {
          const req = store.get(ev.target.result);
          req.onsuccess = (e: any) => {
            observer.next(req.result);
            observer.complete();
            db.close();
          };
          req.onerror = (e: any) => {
            observer.error(ev.target.result);
            observer.complete();
            db.close();
          };
        };
        request.onerror = (ev: any) => {
          observer.error(ev.target.result);
          observer.complete();
          db.close();
        };
      });
    });
    // return new Observable((observer) => {
    //   observer.next({
    //     style: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
    //   });
    //   observer.complete();
    // });
  }

  updatePage(pages: Page[]): Observable<void> {
    return new Observable((observer) => {
      this.openDB().then((db) => {
        const store = this.getObjectStore(db, this.PAGE_TABLE, 'readwrite');
        for (const page of pages) {
          store.put(page);
        }
        store.transaction.oncomplete = (event: any) => {
          observer.next();
          observer.complete();
        };
        store.transaction.onerror = (event: any) => {
          observer.error(event);
          observer.complete();
        };
      });
    });
  }

  deletePage(page: Page): Observable<void> {
    return new Observable((observer) => {
      this.openDB().then((db) => {
        const store = this.getObjectStore(db, this.PAGE_TABLE, 'readwrite');
        const request = store.delete(page.id);
        request.onsuccess = (ev: any) => {
          observer.next();
          observer.complete();
          db.close();
        };
        request.onerror = (ev: any) => {
          observer.error(ev.target.result);
          observer.complete();
          db.close();
        };
      });
    });
  }

  getAllPages(): Observable<Page[]> {
    return new Observable((observer) => {
      this.openDB().then((db) => {
        const store = this.getObjectStore(db, this.PAGE_TABLE, 'readonly');
        const request = store.getAll();
        request.onsuccess = (ev: any) => {
          observer.next(ev.target.result);
          observer.complete();
          db.close();
        };
        request.onerror = (ev: any) => {
          observer.error(ev.target.result);
          observer.complete();
          db.close();
        };
      });
    });
  }

  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME);
      request.onsuccess = (event: any) => {
        const db = event.currentTarget.result as IDBDatabase;
        resolve(db);
      };
      request.onerror = (event: any) => {
        reject(`open indexedDB error: ${event}`);
      };
      request.onupgradeneeded = (event: any) => {
        const db = event.currentTarget.result as IDBDatabase;
        db.createObjectStore(this.PAGE_TABLE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        const transaction = event.currentTarget.transaction;
        transaction.oncomplete = () => {
          resolve(db);
        };
      };
    });
  }

  getObjectStore(
    db: IDBDatabase,
    name: string,
    mode: IDBTransactionMode
  ): IDBObjectStore {
    return db.transaction(name, mode).objectStore(name);
  }
}
