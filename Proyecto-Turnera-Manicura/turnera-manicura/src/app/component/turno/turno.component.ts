// Importa Component, OnInit y NgForm
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 

import { Turno } from '../../model/turno';

@Component({
  selector: 'app-turno',                 // ✅ CORREGIDO: Selector correcto
  templateUrl: './turno.component.html',  // ✅ CORREGIDO: Template correcto
  styleUrls: ['./turno.component.css']   
})
export class TurnoComponent implements OnInit { // ✅ NOMBRE DE CLASE CORREGIDO

  // === VARIABLES DE ESTADO AGREGADAS (Resuelve errores TS2339) ===
  activeTab: 'servicios' | 'misTurnos' = 'servicios'; // Controla la pestaña
  showModal: boolean = false; // Visibilidad del modal
  servicioSeleccionado: string = ''; // Servicio seleccionado
  
  // Título, Colores, Servicios (contenido existente)
  title = 'Flower Nail Beauty';
  colors = {
    primary: '#E8ADA0', primaryDark: '#D9928A', secondary: '#D9B036',
    secondaryDark: '#B8922C', accent: '#A8C5A3', light: '#F2D9D0',
    lighter: '#FFF8F5', text: '#4A3831',
  };

  services = [
    { name: 'Manicura Semi-permanente', duration: '60 min', price: '$22.000' },
    { name: 'Uñas Esculpidas', duration: '90 min', price: '$32.200' },
    { name: 'Pedicura Spa', duration: '60 min', price: '$40.000' },
    { name: 'Kapping', duration: '60 min', price: '$24.000' },
  ];

  turnos: Turno[] = [];

  constructor() { }
  ngOnInit(): void { }

  // === MÉTODOS AGREGADOS (Resuelve errores de función y lógica) ===

  abrirModal(serviceName: string): void {
    this.servicioSeleccionado = serviceName;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
// ... (código anterior)

reservarTurno(form: NgForm): void {
    if (form.invalid) {
      console.error('Formulario no válido.');
      return;
    }
    
    // ✅ Mapeo final que coincide con el modelo corregido
    const nuevoTurno: Turno = {
      id: Math.random().toString(36).substring(2, 9), 
      servicio: this.servicioSeleccionado,
      nombre: form.value.name,
      telefono: form.value.phone, // ✅ Ahora existe en el modelo
      
      // Campos que se inician o provienen del formulario:
      apellido: '',                  
      fecha: form.value.date,        
      hora: form.value.time,         
      conQuien: '',                  
      status: 'pending'              // ✅ Ahora existe en el modelo
    };

    this.turnos.push(nuevoTurno);
    this.closeModal(); 
    this.activeTab = 'misTurnos'; 
  }
  // Métodos existentes (actualizados si fue necesario)
  addTurno(serviceName: string) { }
  
  deleteTurno(id?: string) {
    if (!id) return;
    this.turnos = this.turnos.filter(t => t.id !== id);
  }

  hoverEnter(event: Event) {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondaryDark;
  }

  hoverLeave(event: Event) {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondary;
  }
}