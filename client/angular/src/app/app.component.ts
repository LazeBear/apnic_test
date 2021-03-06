import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data = []; // data for graph

  selectedCountry: string;
  displayCountry: string;
  selectedYear: number;
  displayYear: number;
  padding: number; // padding between each bar in graph
  screenWidth: number; // used for adjust padding
  yScaleMax: number; // y-axis max value
  yearList: Array<string>;
  countryList: Array<string>;

  constructor(private service: AppService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.selectedCountry = 'ALL';
    this.selectedYear = 2016;
    this.displayYear = 0;
    this.displayCountry = 'Country';
    this.padding = 8; // default value
    this.screenWidth = window.screen.width;
    this.yScaleMax = 100;
    this.fetchData();
    this.fetchYearList();
    this.fetchCountryList();
  }

  fetchData() {
    this.service.getData(this.selectedCountry, this.selectedYear).subscribe(res => {
      this.displayYear = this.selectedYear;
      if (this.selectedCountry === 'ALL') {
        this.padding = 8;
        this.yScaleMax = 0;
        this.displayCountry = 'All Countries';
        this.data = (<Array<object>>res).map(i => {
          return {name: i['Economy'], value: i['Total']};
        });
      } else {
        this.padding = this.screenWidth;
        this.yScaleMax = 100;
        const name = res['Economy'];
        this.displayCountry = name;
        this.data = [{name, value: res['Total']}];
      }
    }, err => {
      this.showError(err);
    });
  }

  onCountryChange(newCountry) {
    this.selectedCountry = newCountry;
    this.fetchData();
  }

  onYearChange(newYear) {
    this.selectedYear = newYear;
    this.fetchData();
  }

  fetchCountryList(): any {
    this.service.getCountryList().subscribe(res => {
      this.countryList = res.map(i => {
        return Object.keys(i).map((key) => i[key])[0];
      });
    });
  }

  fetchYearList(): any {
    this.service.getYearList().subscribe(res => {
      this.yearList = res.map(i => {
        return Object.keys(i).map((key) => i[key])[0];
      });
    });
  }

  showError(error) {
    this.toastr.error(error.error, error.status);
  }
}
