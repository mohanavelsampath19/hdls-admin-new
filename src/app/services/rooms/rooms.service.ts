import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private _http: HttpClient) { }
  addProduct(roomDetails: any) {
    console.log(roomDetails);
    let formData: any = new FormData();
    let tmpRoomDetails = { ...roomDetails };
    delete tmpRoomDetails.coverImage;
    delete tmpRoomDetails.featureImage;

    for (let i = 0; i < roomDetails.coverImage.length; i++) {
      formData.append(
        'coverImage[]',
        roomDetails.coverImage[i],
        roomDetails.coverImage[i]['name']
      );
    }
    for (let i = 0; i < roomDetails.featureImage.length; i++) {
      formData.append(
        'featureImage[]',
        roomDetails.featureImage[i],
        roomDetails.featureImage[i]['name']
      );
    }
    for (let i = 0; i < Object.keys(tmpRoomDetails).length; i++) {
      let tmpParam = Object.keys(tmpRoomDetails)[i];
      if (tmpParam === 'variantObj' || tmpParam === 'specObj') {
        formData.append(tmpParam, JSON.stringify(tmpRoomDetails[tmpParam]));
      } else {
        formData.append(tmpParam, tmpRoomDetails[tmpParam]);
      }
    }
    return this._http.post(
      `${environment.baseUrl}api/product/addProduct`,
      formData
    );
  }
  addRoomService(roomDetails:any) {
    console.log(roomDetails);
    let formData: any = new FormData();
    let tmpRoomDetails = { ...roomDetails };
    delete tmpRoomDetails.addImages;
    formData.append('coverImage', roomDetails.coverImage);
    for (let i = 0; i < roomDetails.addImages.length; i++) {
      let addImageItem = roomDetails.addImages[i];
      for(let j=0;j<addImageItem.fileUpload.length;j++){
        console.log(addImageItem.fileUpload[j],addImageItem.fileUpload[j]?.name);
        formData.append(
          addImageItem.type+'[]',
          addImageItem.fileUpload[j],
          addImageItem.fileUpload[j].name
        );
      }
    }

    for (let i = 0; i < Object.keys(tmpRoomDetails).length; i++) {
      let tmpParam = Object.keys(tmpRoomDetails)[i];
      formData.append(tmpParam, tmpRoomDetails[tmpParam]);
    }
     return this._http.post(environment.baseUrl + 'api/rooms/createrooms', formData);
  }

  updateRoomService(roomDetails:any, roomid:any) {
    console.log(roomDetails);
    let formData: any = new FormData();
    let tmpRoomDetails = { ...roomDetails };
    delete tmpRoomDetails.addImages;
    formData.append('coverImage', roomDetails.coverImage);
    for (let i = 0; i < roomDetails.addImages.length; i++) {
      let addImageItem = roomDetails.addImages[i];
      for(let j=0;j<addImageItem.fileUpload.length;j++){
        console.log(addImageItem.fileUpload[j],addImageItem.fileUpload[j]?.name);
        formData.append(
          addImageItem.type+'[]',
          addImageItem.fileUpload[j],
          addImageItem.fileUpload[j].name
        );
      }
    }

    for (let i = 0; i < Object.keys(tmpRoomDetails).length; i++) {
      let tmpParam = Object.keys(tmpRoomDetails)[i];
      formData.append(tmpParam, tmpRoomDetails[tmpParam]);
    }
    formData.append('roomid', roomid);
     return this._http.post(environment.baseUrl + 'api/rooms/updaterooms', formData);
  }
  getRoomList(hotel_id?:number, category?:number) {
    return this._http.post(environment.baseUrl + 'api/rooms/getroomslist', {hotel_id: hotel_id, category: category});
  }

  deleteRoom(room_id:number) {
    return this._http.post(environment.baseUrl + 'api/rooms/deleteroom', {roomid: room_id});
  }
}
