import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { createPdf } from '../../../pdfMakeConfig';
import { NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { fadeScaleAnimation } from '../../../animacion';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEchartsModule, AdminNavbarComponent],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
  animations: [fadeScaleAnimation],
})
export default class GraficosComponent implements OnInit {
  logs: any[] = [];
  Especialidades: any[] = [];
  EspecialidadesxTurno: any[] = [];
  chartOption1: EChartsOption = {};
  chartOption2: EChartsOption = {};
  chartOption3: EChartsOption = {};
  chartOption4: EChartsOption = {};
  chartOption5: EChartsOption = {};
  fechaInicio: string = '2024-01-01';
  fechaFin: string = '2024-12-31';
  fechaInicio2: string = '2024-01-01';
  fechaFin2: string = '2024-12-31';
  loading: boolean = false;
  charts: any = [];
  [key: string]: any;
  constructor(private authService: AuthService, private zone: NgZone) {}

  ngOnInit(): void {
    this.loading = true;
    this.cargar().then(() => {
      this.createChart();
      this.createChart2();
      this.createChart3();
      this.createChart4();
      this.createChart5();
      for (let i = 1; i <= 5; i++) {
        let titulo = '';
        switch (i) {
          case 1:
            titulo = 'Ingresos al sistema';
            break;
          case 2:
            titulo = 'Turnos por Especialidad';
            break;
          case 3:
            titulo = 'Turnos por Dia';
            break;
          case 4:
            titulo = 'Turnos solicitado por médico en un lapso de tiempo';
            break;
          case 5:
            titulo = 'Turnos finalizados por médico en un lapso de tiempo';
            break;
        }
        let chart = {
          chartOption: this['chartOption' + i],
          id: i.toString(),
          hasDateFilter: i > 3,
          fechaInicio: i > 3 ? this['fechaInicio' + (i - 3)] : undefined,
          fechaFin: i > 3 ? this['fechaFin' + (i - 3)] : undefined,
          createChart: this['createChart' + i],
          Titulo: titulo,
        };

        this.charts.push(chart);
      }
      console.log(this.charts);

      this.zone.run(() => {
        this.loading = false;
      });
    });
  }

  exportPDF(id: string, titulo: string) {
    let chartElement = document.getElementById(id); // Asegúrate de que este es el id correcto
    let myChart: echarts.ECharts | undefined;
    if (chartElement) {
      myChart = echarts.getInstanceByDom(chartElement);
      if (myChart) {
        let base64 = myChart.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff',
        });
        let a = 'Grafico: ' + titulo;
        if (base64) {
          let docDefinition = {
            content: [
              a,
              {
                image: base64,
                width: 750,
              },
            ],
            pageOrientation: 'landscape',
          };

          createPdf(docDefinition).download('grafico');
        }
      }
    }
  }

  base64ToBlob(base64: string, type: string): Blob {
    const binStr = atob(base64.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], { type: type });
  }

  async cargar() {
    this.logs = await this.authService.obtenerLogs();
    this.Especialidades = await this.authService.obtenerEspecialidades();
    this.EspecialidadesxTurno = await this.authService.obtenerTodosLosTurnos();

    let especialistas = await this.authService.obtenerEspecialistas();
    for (const historia of this.EspecialidadesxTurno) {
      historia.Especialista =
        especialistas.find((e) => e.uid === historia.idEspecialista)?.nombre ||
        'Desconocido';
    }
  }

  async createChart() {
    const sortedLogs = this.logs.slice().sort((a, b) => {
      const dateA: any = new Date(a.dia.split('/').reverse().join('-') + ' ' + a.hora);
      const dateB: any = new Date(b.dia.split('/').reverse().join('-') + ' ' + b.hora);
      return dateA - dateB;
    });

    const counts: any = {};
    sortedLogs.forEach((log: any) => {
      const key = log.dia;
      counts[key] = (counts[key] || 0) + 1;
    });

    const seriesData: echarts.SeriesOption = {
      name: 'Usuarios',
      type: 'line',
      data: Object.keys(counts).map((day) => counts[day]),
      itemStyle: { color: '#1f77b4' }, // Cambia esto al color que desees
      lineStyle: { width: 2 }, // Ancho de la línea
      emphasis: { focus: 'series' }, // Estilo cuando se pasa el mouse
    };

    const xAxisData: string[] = Object.keys(counts);

    this.chartOption1 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const day = params[0].name;
          const logsForDay = sortedLogs.filter((log: any) => log.dia === day);
          let tooltip = `${day}<br/>`;
          logsForDay.forEach((log: any) => {
            tooltip += `${log.usuario} ${log.hora}<br/>`;
          });
          return tooltip;
        },
      },
      legend: { data: ['Usuarios'] },
      xAxis: { type: 'category', data: xAxisData },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
      series: [seriesData],
      color: ['#1f77b4'], // Cambia esto al color que desees
    } as echarts.EChartsOption;
  }

  async createChart2() {
    let counts: { [key: string]: number } = {};
    this.Especialidades.forEach((esp: any) => {
      let key = esp.id;
      counts[key] = this.EspecialidadesxTurno.filter(
        (turno) => turno.idEspecialidad === esp.id
      ).length;
    });

    let xAxisData = this.Especialidades.map((esp: any) => esp.nombre);
    let seriesData: echarts.SeriesOption[] = [
      {
        name: 'Cantidad de turnos',
        type: 'pictorialBar',
        itemStyle: { color: '#f5dd42' }, // Cambia esto al color que desees
        data: this.Especialidades.map((esp: any) => counts[esp.id]),
      },
    ];

    this.chartOption2 = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Cantidad de turnos'] },
      xAxis: { type: 'category', data: xAxisData },
      yAxis: { type: 'value', interval: 1 },
      series: seriesData,
      color: ['#f5dd42'], // Cambia esto al color que desees
    };
  }

  async createChart3() {
    let counts: { [key: string]: number } = {};
    this.EspecialidadesxTurno.forEach((turno: any) => {
      let key = turno.fecha.split(',')[1]?.trim();
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    let orderedDates = Object.keys(counts).sort((a, b) => {
      let dateA = new Date(a.split('/').reverse().join('-'));
      let dateB = new Date(b.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    let xAxisData = orderedDates;
    let seriesData: echarts.SeriesOption[] = [
      {
        name: 'Cantidad de turnos',
        type: 'effectScatter',
        itemStyle: { color: '#f73619' }, // Cambia esto al color que desees
        data: orderedDates.map((date) => counts[date]),
      },
    ];

    this.chartOption3 = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Cantidad de turnos'] },
      xAxis: { type: 'category', data: xAxisData },
      yAxis: { type: 'value', interval: 1 },
      series: seriesData,
      color: ['#f73619'], // Cambia esto al color que desees
    };
  }

  async createChart4() {
    const parseDate = (fechaStr: string): Date => {
      if (!fechaStr) return new Date();
      const parts = fechaStr.split(',');
      if (parts.length < 2) return new Date();
      const dateStr = parts[1].trim();
      const [day, month, year] = dateStr.split('/').map(part => part.trim());
      const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      console.error('Fechas de inicio o fin inválidas');
      return;
    }

    const turnosFiltrados = this.EspecialidadesxTurno.filter((turno: any) => {
      if (!turno.fecha) return false;
      const fechaTurno = parseDate(turno.fecha);
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    const counts: { [key: string]: number } = {};
    const countsByDoctor: { [key: string]: { [key: string]: number } } = {};

    turnosFiltrados.forEach((turno: any) => {
      const fecha = turno.fecha || '';
      const key = parseDate(fecha).toISOString().split('T')[0];
      const doctorKey = turno.Especialista || 'Desconocido';

      counts[key] = (counts[key] || 0) + 1;

      if (!countsByDoctor[key]) {
        countsByDoctor[key] = {};
      }
      countsByDoctor[key][doctorKey] = (countsByDoctor[key][doctorKey] || 0) + 1;
    });

    const sortedKeys = Object.keys(counts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.chartOption4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const day = params[0].name;
          let tooltip = `${day}<br/>`;
          for (const doctor in countsByDoctor[day]) {
            tooltip += `${doctor}: ${countsByDoctor[day][doctor]}<br/>`;
          }
          return tooltip;
        },
      },
      xAxis: { type: 'category', data: sortedKeys },
      yAxis: { type: 'value', interval: 1 },
      series: [
        {
          data: sortedKeys.map(key => counts[key]),
          type: 'bar',
          itemStyle: { color: '#19f7a2' }, // Cambia esto al color que desees
        },
      ],
      color: ['#19f7a2'], // Cambia esto al color que desees
    };
  }

  async createChart5() {
    let turnosFiltrados = this.EspecialidadesxTurno.filter((turno: any) => {
      if (!turno.fecha || typeof turno.fecha !== 'string') return false;

      let fechaPartes = turno.fecha.split(',');
      if (fechaPartes.length < 2) return false;

      let fechaTurnoStr = fechaPartes[1].trim();
      let fechaTurno = new Date(fechaTurnoStr.split('/').reverse().join('-')).getTime();
      let fechaInicio = new Date(this.fechaInicio2).getTime();
      let fechaFin = new Date(this.fechaFin2).getTime();

      return (
        fechaTurno >= fechaInicio &&
        fechaTurno <= fechaFin
      );
    });

    let countsByDoctor = turnosFiltrados.reduce((acc: any, turno: any) => {
      let doctor = turno.Especialista || 'Desconocido';
      acc[doctor] = (acc[doctor] || 0) + 1;
      return acc;
    }, {});

    let xAxisData = Object.keys(countsByDoctor);
    let seriesData = Object.values(countsByDoctor);

    this.chartOption5 = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: xAxisData },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
      series: [
        {
          data: seriesData,
          type: 'bar',
          itemStyle: { color: '#0d6efd' }, // Cambia esto al color que desees
        },
      ],
      color: ['#0d6efd'], // Cambia esto al color que desees
    };
  }


}
