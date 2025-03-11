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
  limit: number;
  name: string;
  description: string;
  nextInspection: number;
  inspectionType: string;
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
items: Item[] = [];
  
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
getInspectionsFromLocal() {
  const items = localStorage.getItem('items');

  return JSON.parse(items || '{}');
}
goToDetail(inspection: Inspection) {
  this.mileage = inspection.mileage;
  localStorage.setItem('mileage', inspection.mileage.toString());
localStorage.setItem('items', JSON.stringify(inspection.items));
  this.setRoute('inspection-detail');
  this.items = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items') || '{}') : [];
  this.showDetail = true;
}
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
