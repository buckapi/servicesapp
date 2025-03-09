import { Injectable } from '@angular/core';

interface Inspection {
  id: string;
  date: Date;
  mileage: number;
  status: string;
  items: Item[];
}

interface Item {
  id: string;
  name: string;
  nextInspection: number;
  mechanicId  : string;
  interval: number;
}
interface Car {
  id: string,
  userId: string;
  patent: string;
  modelo: string;
  marca: string;
  mileage: number;
  fuelType: string;
  transmissionType: string;
}

interface ClienteDetail {
  id: string;
  email: string;
  cars: Car[];
  name: string;
  rut: string;
  phone: string;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  activeOrder: Inspection | undefined;
  carId: string = '';
  prevInspection = true;
  prevMileage = 0;
  prevInspectionValue: Inspection | undefined;
  lastItems: Item[] = [];
  mileage = 0;
  totalClientes = 0;
  flag = '';
  totalCars = 0;
  activeRoute = 'home';
  theme: string = 'light';
  showDetail = false;
  showHistorial = false;
  showWinzard = false;
  
  patent = '';
  clienteDetail: ClienteDetail = {
    cars: [],
    email: '',
    id: '',
    rut: '',
    name: '',
    phone: '',
  }
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }
  toggleThemeP(P: any) {
    this.theme = P;
  }
getOrderId() {
  const inspection = localStorage.getItem('inspeccionId');

  return inspection ;
}

  routeName = ""
  entityName = '';
  entityCaption = '';

  constructor() { }

  setRoute(route: string) {
    this.routeName = route;
    this.entityName = '';
    this.activeRoute = route;
  }

  showHistorialComponent(patent: string) {
    this.showHistorial = !this.showHistorial;
    this.patent = patent;
  }
  hideHistorialComponent() {
    this.showHistorial = false;
  }
  getRoute() {
    return this.activeRoute;
  }

  async getRouteData() {
    const route = this.activeRoute;
    const routeData = await import(`./../components/${route}/${route}.json`);
    return routeData;
  }

}
