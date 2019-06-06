import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public stageChartData: any;
  public assoChartData: any;
  public stateChartData: any;
  public mainChartData: any;
  public stageChartColors: Array<any> = ['yellow', 'green'];
  public assoChartColors: Array<any> = ['orange', 'blue'];
  public stateChartColors: Array<any> = ['red', 'blue'];
  constructor(private http: HttpClient) {
    this.http.get("../../../assets/data.json").subscribe(data => {
      let stagesArr = [];
      let assoArr = [];
      let stateArr = [];
      this.mainChartData = data;
        for(let i=0;i<data['root'].length;i++){
          for(let j=0;j<data['root'][i].children.length;j++){
              //stagesArr.push(data['root'][i].children[j]['stage']);
              //assoArr.push(data['root'][i].children[j]['association']);
              //stateArr.push(data['root'][i].children[j]['state']);
            for(let k=0;k<data['root'][i].children[j].children.length;k++){
              stagesArr.push(data['root'][i].children[j].children[k]['stage']);
              assoArr.push(data['root'][i].children[j].children[k]['association']);
              stateArr.push(data['root'][i].children[j].children[k]['state']);
            }
          }
        }
        this.stageChartData = this.processArray(stagesArr, 'stage');
        this.assoChartData = this.processArray(assoArr, 'association');
        this.stateChartData = this.processArray(stateArr, 'state');
    });
  }

  processArray(arr, chartFieldMap){
    var resultArr = [];
    var occurrences = arr.reduce(function(obj, item) {
      obj[item] = (obj[item] || 0) + 1;
      return obj;
    }, {});
    let maxValue = 0;
    for( const key in occurrences) {
      let value = occurrences[key];
      resultArr.push([key, value])
      if(maxValue < value) {
        maxValue = value;
      }
    }
    return {
      dataArr: resultArr,
      maxValue: maxValue,
      chartFieldMap: chartFieldMap
    }
  }

  ngOnInit(): void {
    //this.generateData();
    // generate random values for mainChart
  }
}
