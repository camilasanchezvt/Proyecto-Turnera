import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Turno } from '../../model/turno';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {
  activeTab: 'servicios' | 'misTurnos' = 'servicios';
  showModal: boolean = false;
  servicioSeleccionado: string = '';

  colors = {
    primary: '#E8ADA0', primaryDark: '#D9928A', secondary: '#D9B036',
    secondaryDark: '#B8922C', accent: '#A8C5A3', light: '#F2D9D0',
    lighter: '#FFF8F5', text: '#4A3831',
  };

  services = [
    { name: 'Esmaltado Semi Permanente', price: '$22.000', image: 'assets/imagenes/imagen1.jpg' },
    { name: 'Esmaltado Semi Permanente en Pies', price: '$22.000', image: 'assets/imagenes/imagen2.jpg' },
    { name: 'Kapping', price: '$24.000', image: 'assets/imagenes/imagen3.jpg' },
    { name: 'Esculpidas en Acrigel', price: '$34.000', image: 'assets/imagenes/imagen4.jpg' },
    { name: 'Soft Gel', price: '$28.000', image: 'assets/imagenes/imagen5.jpg' },
  ];

  turnos: Turno[] = [];
  private deferredPrompt: any = null;
  instalarDisponible: boolean = false;

  horas: string[] = Array.from({ length: 12 }, (_, i) => String(i + 9).padStart(2, '0'));
  minutos: string[] = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  fechaMinima: string = ''; // Para el input date
  errorFecha: string = '';   // Mensaje de error

  constructor() {}

  ngOnInit(): void {
    // Configurar la fecha mínima para el input
    const fechaHoy = new Date();
    const yyyy = fechaHoy.getFullYear();
    const mm = String(fechaHoy.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaHoy.getDate()).padStart(2, '0');
    this.fechaMinima = `${yyyy}-${mm}-${dd}`;

    // Cargar turnos guardados en localStorage
    const turnosGuardados = localStorage.getItem('turnos');
    if (turnosGuardados) {
      this.turnos = JSON.parse(turnosGuardados);
    }

    // PWA events
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.instalarDisponible = true;
      console.log('Evento de instalación detectado ✅');
    });

    window.addEventListener('appinstalled', () => {
      console.log('Aplicación instalada ✅');
      this.deferredPrompt = null;
      this.instalarDisponible = false;
    });
  }

  abrirModal(serviceName: string): void {
    this.servicioSeleccionado = serviceName;
    this.showModal = true;
    this.errorFecha = ''; // Limpiar error al abrir modal
  }

  closeModal(): void {
    this.showModal = false;
  }

  validarFecha(fecha: string): boolean {
    if (!fecha) {
      this.errorFecha = 'Debe seleccionar una fecha';
      return false;
    }

    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaIngresada < hoy) {
      this.errorFecha = 'No se puede reservar un turno para una fecha pasada';
      return false;
    }

    this.errorFecha = '';
    return true;
  }

  reservarTurno(form: NgForm): void {
    if (form.invalid) return;

    // Validar fecha antes de guardar
    if (!this.validarFecha(form.value.fecha)) return;

    const horaCompleta = `${form.value.hora}:${form.value.minutos}`;

    // Bloqueo de turnos superpuestos
    const turnoExistente = this.turnos.find(t =>
      t.fecha === form.value.fecha &&
      t.hora === horaCompleta &&
      t.conQuien === form.value.conQuien
    );

    if (turnoExistente) {
      alert('⚠️ Este turno ya está reservado. ⚠️');
      return;
    }

    const nuevoTurno: Turno = {
      id: Math.random().toString(36).substring(2, 9),
      servicio: this.servicioSeleccionado,
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      telefono: form.value.telefono,
      fecha: form.value.fecha,
      hora: horaCompleta,
      conQuien: form.value.conQuien,
      status: 'pending'
    };

    this.turnos.push(nuevoTurno);
    // Guardar en localStorage
    localStorage.setItem('turnos', JSON.stringify(this.turnos));

    this.closeModal();
    this.activeTab = 'misTurnos';
  }

  deleteTurno(id?: string): void {
    if (!id) return;
    this.turnos = this.turnos.filter(t => t.id !== id);
    localStorage.setItem('turnos', JSON.stringify(this.turnos));
  }

  hoverEnter(event: Event): void {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondaryDark;
  }

  hoverLeave(event: Event): void {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondary;
  }

  instalarApp(): void {
    if (!this.deferredPrompt) {
      alert('La instalación no está disponible en este momento.');
      return;
    }

    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la app');
      } else {
        console.log('El usuario canceló la instalación');
      }
      this.deferredPrompt = null;
      this.instalarDisponible = false;
    });
  }
}
