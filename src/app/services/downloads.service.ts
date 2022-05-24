import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, scan} from "rxjs";

//3rd Party libraries
import { saveAs } from 'file-saver';

export interface Download {
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  progress: number
  content: Blob | null
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress
    || event.type === HttpEventType.UploadProgress
}

export function download(
  saver?: (b: Blob) => void
): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan((previous: Download, event: HttpEvent<Blob>): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : previous.progress,
              state: 'IN_PROGRESS',
              content: null
            }
          }
          if (isHttpResponse(event)) {
            if (saver && event.body) {
              saver(event.body)
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            }
          }
          return previous
        },
        {state: 'PENDING', progress: 0, content: null}
      )
    )
}

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  progress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  /**
   * fetch the blob file
   *
   * @param url
   */
  download(url: string): Observable<HttpEvent<Blob>> {
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    })
  }

  /**
   * trigger save file
   * @param url
   * @param fileName
   */
  async saveAs(url: string, fileName: string): Promise<void> {
    this.download(url)
      .pipe(download((blob) => saveAs(blob, fileName)))
      .subscribe((blob) => {
        this.progress.next(blob.progress);
      })
  }

}
