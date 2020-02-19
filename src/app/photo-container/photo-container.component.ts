import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import * as EXIF from "exif-js";
import { forkJoin, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface EXIFStatic {
  getData(url: any, callback: any): any;
  getTag(img: any, tag: any): any;
  getAllTags(img: any): any;
  pretty(img: any): string;
  readFromBinaryFile(file: any): any;
}

export const orientationTransform = {
  1: "",
  2: "rotateY(180deg)",
  3: "rotate(180deg)",
  4: "rotate(180deg) rotateY(180deg)",
  5: "rotate(270deg) rotateY(180deg)",
  6: "rotate(90deg)",
  7: "rotate(90deg) rotateY(180deg)",
  8: "rotate(270deg)"
};

export interface PhotoInfo {
  name?: string;
  thumbnailUrl?: string;
  photoUrl?: string;
  orientation?: number;
}

export const realizationConfirmationPhotos: PhotoInfo[] = [
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  },
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  },
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  },
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/orientation/landscape_8.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  },
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  },
  {
    name: "name",
    thumbnailUrl:
      "https://raw.githubusercontent.com/ianare/exif-samples/master/jpg/Canon_40D_photoshop_import.jpg",
    photoUrl: "https://i.picsum.photos/id/541/800/1200.jpg"
  }
];

@Component({
  selector: "app-photo-container",
  templateUrl: "./photo-container.component.html",
  styleUrls: ["./photo-container.component.scss"]
})
export class PhotoContainerComponent implements OnInit, AfterViewInit {
  realizationConfirmationPhotos = realizationConfirmationPhotos;
  exif: EXIFStatic = EXIF;

  obsArray: Observable<Blob>[];
  @ViewChild("one", { static: false }) d1: ElementRef;

  constructor(private httpClient: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    this.obsArray = new Array(this.realizationConfirmationPhotos.length)
      .fill(0)
      .map((x, idx) => {
        return this.getObservable(
          this.realizationConfirmationPhotos[idx].thumbnailUrl
        );
      });
  }
  ngAfterViewInit() {
    const _this = this;
    forkJoin(this.obsArray).subscribe(blobs => {
      blobs.forEach((blob, index) =>
        this.exif.getData(blob, function(this: any) {
          const orientation = EXIF.getTag(this, "Orientation");
          _this.realizationConfirmationPhotos[index].orientation = orientation;
          const child = _this.renderer.createElement("div") as ElementRef;
          _this.renderer.addClass(child, "image-container");
          _this.renderer.addClass(child, "m-1");
          _this.renderer.addClass(child, "cursor-pointer");
          _this.renderer.addClass(child, "image-container");
          _this.renderer.setStyle(
            child,
            "background",
            `url(${_this.realizationConfirmationPhotos[index].thumbnailUrl}) no-repeat center`
          );
          _this.renderer.setStyle(child, "backgroundSize", `cover`);
          _this.renderer.setStyle(
            child,
            "transform", orientationTransform[_this.realizationConfirmationPhotos[index].orientation]);
          _this.renderer.appendChild(_this.d1.nativeElement, child);
        })
      );
    });
  }

  private getObservable(url: string): Observable<Blob> {
    return this.httpClient.get(url, { responseType: "blob" });
  }
}
