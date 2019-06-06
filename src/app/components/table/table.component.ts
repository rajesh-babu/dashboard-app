
import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { IfStmt, debugOutputAstAsTypeScript } from '@angular/compiler';
import { ChartsService } from '../../services/charts.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns = ['parent_acc_no', 'child_acc_no', 'percentage', 'stage', 'association', 'state'];
  dataSource: MatTableDataSource<DashboardData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() private mainChartData: any;

  constructor(private chartService: ChartsService) {
  }
  ngOnInit(){
    const dashboardDataArr: DashboardData[] = [];
    if(this.mainChartData) {
      for(let i=0;i<this.mainChartData['root'].length;i++){
        for(let j=0;j<this.mainChartData['root'][i].children.length;j++){
          //const parent_acc_obj = { parent_acc_no: this.mainChartData['root'][i].children[j]['accno']};
          //const child_acc_obj = { child_acc_no: this.mainChartData['root'][i].children[j]['accno']};
          //const rel_obj = { rel_name: this.mainChartData['root'][i]['name'] };
          //dashboardDataArr.push(createRow({...this.mainChartData['root'][i].children[j], ...parent_acc_obj, ...child_acc_obj, ...rel_obj}));
          for(let k=0;k<this.mainChartData['root'][i].children[j].children.length;k++){
            const parent_acc_obj = { parent_acc_no: this.mainChartData['root'][i].children[j]['accno']};
            const child_acc_obj = { child_acc_no: this.mainChartData['root'][i].children[j].children[k]['accno']};
            const rel_obj = { rel_name: this.mainChartData['root'][i]['name'] };
            dashboardDataArr.push(createRow({...this.mainChartData['root'][i].children[j].children[k], ...parent_acc_obj, ...child_acc_obj, ...rel_obj}));
          }
        }
      }
      this.dataSource = new MatTableDataSource(dashboardDataArr);
    }
    this.chartService.change.subscribe((filterText: any) => {
      this.applyFilter(filterText);
    })
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

/** Builds and returns a new User. */
function createRow(data: any): DashboardData {
  return {
    rel_name: data.rel_name,
    parent_acc_no: data.parent_acc_no,
    child_acc_no: data.child_acc_no,
    percentage: data.ownership_percentage,
    stage: data.stage,
    association: data.association,
    state: data.state
  };
}

export interface DashboardData {
  rel_name: string;
  parent_acc_no: string;
  child_acc_no: string;
  percentage: number,
  stage: string;
  association: string;
  state: string;
}
