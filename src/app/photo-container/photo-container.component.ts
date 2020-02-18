import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as EXIF from 'exif-js';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface EXIFStatic {
  getData(url: any, callback: any): any;
  getTag(img: any, tag: any): any;
  getAllTags(img: any): any;
  pretty(img: any): string;
  readFromBinaryFile(file: any): any;
}

export interface PhotoInfo {
  name?: string;
  thumbnailUrl?: string;
  photoUrl?: string;
  blob?: Blob;
}

export const realizationConfirmationPhotos: PhotoInfo[] = [
  {
    name: 'name',
    thumbnailUrl:
      'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  },
  {
    name: 'name',
    thumbnailUrl: 'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  },
  {
    name: 'name',
    thumbnailUrl: 'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  },
  {
    name: 'name',
    thumbnailUrl: 'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/orientation/landscape_8.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  },
  {
    name: 'name',
    thumbnailUrl: 'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  },
  {
    name: 'name',
    thumbnailUrl: 'https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg',
    photoUrl: 'https://i.picsum.photos/id/541/800/1200.jpg'
  }
];

@Component({
  selector: 'app-photo-container',
  templateUrl: './photo-container.component.html',
  styleUrls: ['./photo-container.component.scss']
})
export class PhotoContainerComponent implements OnInit, AfterViewInit {
  realizationConfirmationPhotos = realizationConfirmationPhotos;
  blob: Blob;
  fileReader = new FileReader();
  exif: EXIFStatic = EXIF;
  @ViewChild('one', { static: false }) d1: ElementRef;

  constructor(private httpClient: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    const _this = this;
    const obsArray: Observable<Blob>[] = new Array(realizationConfirmationPhotos.length)
      .fill(0)
      .map((x, idx) => {
        return this.getObservable(realizationConfirmationPhotos[idx].thumbnailUrl);
      });

    forkJoin(obsArray)
        .subscribe((blobs) => {
            blobs.forEach((blob, index) => this.exif.getData(blob, function(this: any) {

                    _this.realizationConfirmationPhotos[index].blob = blob;
              //       URL.createObjectURL(result);

              //       alert(EXIF.pretty(this));
              //     });
            }));
        });
  }
  ngAfterViewInit() {
    console.log(this.realizationConfirmationPhotos);
    const d2 = this.renderer.createElement('div');
    const text = this.renderer.createText('two');
    this.renderer.appendChild(d2, text);
    this.renderer.addClass(d2, 'image-container');
    this.realizationConfirmationPhotos.forEach((photoInfo) => {
      const contentType = 'text/csv';
      const csvFile = new Blob([photoInfo.thumbnailUrl]);
      const blobTemp = window.URL.createObjectURL(csvFile);
      // d2.style.background = 'black';
      d2.style.background = `url(${photoInfo.thumbnailUrl}) no-repeat center`;
      d2.style.backgroundSize = `cover`;
      // d2.style.backgroundColor = `black`;
      this.renderer.appendChild(this.d1.nativeElement, d2.cloneNode(true));

    }
    );
  }

  private getObservable(url: string): Observable<Blob> {
    return this.httpClient.get(
      url,
      { responseType: 'blob' }
    );
  }
}
