import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import { ChartsService } from '../../services/charts.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private chartColors: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private formatxAxis = d3.format('d');
  private maxValue: number;
  private chartFieldMap: any;

  constructor(private chartService: ChartsService) { }

  ngOnInit() {
    this.maxValue = this.data.maxValue;
    this.chartFieldMap = this.data.chartFieldMap;
    this.data = this.data.dataArr;
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    /*if (this.chart) {
      this.updateChart();
    }*/
  }

  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    let xDomain = this.data.map(d => d[0]);
    let yDomain = [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>this.chartColors);

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .style('font-size', 12)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale)
      .tickFormat(this.formatxAxis)
      .tickValues(d3.range(0, this.maxValue)))
  }

  updateChart() {
    const _that = this
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.data, d => d[1])]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale)
    .tickFormat(this.formatxAxis)
    .tickValues(d3.range(0, this.maxValue+1))
    );

    let update = this.chart.selectAll('.bar')
      .data(this.data)


    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('field-name', d => d[0])
      .attr('chart-field-map', this.chartFieldMap)
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .style('cursor', 'pointer')
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]))
    
      this.chart.selectAll('.bar')
        .on("click", function(d, i) {
          console.log("fieldName:" + this.getAttribute('field-name'))
          console.log("ChartfieldMap:" + this.getAttribute('chart-field-map'))
          _that.chartService.filterTable(this.getAttribute('field-name'));
      });      
  }
}
