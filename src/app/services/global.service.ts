import { Injectable } from '@angular/core';

interface Car{
  idUser:string;
  patente:string;
  modelo:string;
  phone:string;
  marca:string;
  kilometraje:string;
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
  kilometraje:string;
  fuelType:string;
  transmissionType:string;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService  {
  activeRoute = 'login';
  theme: string = 'light';

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
    kilometraje:'',
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

  getRoute() {
    return this.activeRoute;
  }

  async getRouteData() {
    const route = this.activeRoute;
    const routeData = await import(`./../components/${route}/${route}.json`);
    return routeData;
}
  
}
