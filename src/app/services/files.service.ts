import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(public http: HttpClient) { }

  saveFile(file){
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(environment.serverUrl+"fileUpload", formData)
    /*.subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );*/
  }

  deleteFile(fileName:string):any{
    return this.http.delete(environment.serverUrl+"deleteFile/"+fileName)
  }

}
