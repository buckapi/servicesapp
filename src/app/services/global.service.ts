import { Injectable } from '@angular/core';

interface Car{

  id:string,
  idUser:string;
  patente:string;
  modelo:string;
  phone:string;
  marca:string;
  mileage:number;
  fuelType:string;
  transmissionType:string;
}

interface ClienteDetail{
  id:string;
  email:string;
  cars:Car[];
  name:string;
  rut:string;
  telefono:string;
  patente:string;
  modelo:string;
  phone:string;
  marca:string;
  mileage:number;
  fuelType:string;
  transmissionType:string;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService  {
  mileage=0;
  totalClientes=0;
  flag='';
  totalCars=0;
  activeRoute = 'home';
  theme: string = 'light';
  showDetail = false;
  showHistorial = false;
  showWinzard = false;
  patente = '';
  clienteDetail:ClienteDetail={
    cars:[],
    email:'',
    id:'',
    rut:'',
    name:'',
    phone:'',
    telefono:'',
    patente:'',
    modelo:'',
    marca:'',
    mileage:0,
    fuelType:'',
    transmissionType:''
  }
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }
  toggleThemeP(P  :any) {
    this.theme = P  ;
  }

routeName=""
entityName = '';
entityCaption = '';

  constructor() { 
    // this.applyTheme();


  }

  setRoute(route: string) {
    this.routeName = route;
    this.entityName = ''; 
    this.activeRoute = route;
  }

  showHistorialComponent(patente:string){
    this.showHistorial = !this.showHistorial;
    this.patente = patente;
  }
  hideHistorialComponent(){
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
