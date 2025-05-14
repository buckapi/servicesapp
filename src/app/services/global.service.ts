import { Injectable } from '@angular/core';

interface Inspection {
  id: string;
  date: Date;
  level: string;
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
  tractionType: string;
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
  tractionType: string = '';
  fuelType: string = '';
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
  activeRoute = 'login';
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
  isFirstInspection(){
    return localStorage.getItem('firstTime') === 'true';
  }
getLevel() {
  return localStorage.getItem('level') ;
}
getCarId() {
  return localStorage.getItem('carId') ;
}
getPrevItems() {
  const itemsPrev = localStorage.getItem('itemsPre');
  // console.log('itemsPrev retorno'+(itemsPrev));
  return itemsPrev ? JSON.parse(itemsPrev) : []; // Devuelve un arreglo vacío si no hay datos
}
  getCarMileage() { 
    return localStorage.getItem('mileage') ;
  }

getOrderId() {
  const inspection = localStorage.getItem('inspeccionId');

  return inspection ;
}


gettractionType() {
  return localStorage.getItem('tractionType') ;
}

getFuelType() {
  return localStorage.getItem('fuelType') ;
}
getFirstTime() {
if (localStorage.getItem('firstTime')){
  localStorage.setItem('mileage', '0');
}
  return localStorage.getItem('firstTime') ;

}

  routeName = ""
  entityName = '';
  entityCaption = '';

  constructor() { }
getInspectionsFromLocal() {
  const items = localStorage.getItem('items');

  return JSON.parse(items || '{}');
}




goToDetail(inspection: Inspection,view:string) {

localStorage.setItem('inspeccionId', inspection.id);
  this.mileage = inspection.mileage;
  localStorage.setItem('mileage', inspection.mileage.toString());
  localStorage.setItem('level', inspection.level);
  // Suponiendo que estás obteniendo o actualizando global.items en algún lugar de tu componente
localStorage.setItem('items', JSON.stringify(inspection.items));
  this.setRoute('inspection-detail');
  this.items = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items') || '{}') : [];
  this.items.sort((a, b) => a.name.localeCompare(b.name));

  this.showDetail = true;
}
goToPrint(inspection: Inspection) {


  this.mileage = inspection.mileage;
  localStorage.setItem('mileage', inspection.mileage.toString());
  localStorage.setItem('level', inspection.level);
  // Suponiendo que estás obteniendo o actualizando global.items en algún lugar de tu componente
localStorage.setItem('items', JSON.stringify(inspection.items));
  // this.setRoute('print');
  this.items = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items') || '{}') : [];
  this.items.sort((a, b) => a.name.localeCompare(b.name));

  this.showDetail = true;
}
  setRoute(route: string) {
    this.routeName = route;
    this.entityName = '';
    this.activeRoute = route;
  }

  setFirstTime(firstTime: string) {
    localStorage.setItem('firstTime', firstTime);
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
