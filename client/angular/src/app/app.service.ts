import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  getData(cc, year) {
    return this.httpClient.get(environment.api + `/asn/${year}/${cc}`);
  }

  getYearList() {
    return this.httpClient.get<Array<object>>(environment.api + '/years');
  }

  getCountryList() {
    return this.httpClient.get<Array<object>>(environment.api + '/countries');
  }
}
