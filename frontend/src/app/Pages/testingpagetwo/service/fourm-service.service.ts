import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Form } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Forum} from '../models/forum-thread'


@Injectable({
  providedIn: 'root'
})
export class FourmServiceService {

baseURL = "http://localhost:3000/forums"; 
  constructor(
    private http : HttpClient
  ) { }
  
form = new FormGroup({
  id : new FormControl(null),
  onwer: new FormControl(''),
  title : new FormControl(''),
  body : new FormControl(''),
  forum_type:new FormControl('')

});

regForum(emp:Forum){
  return this.http.post(this.baseURL,emp);
}

getAll(){
  return this.http.get(this.baseURL)
}


}