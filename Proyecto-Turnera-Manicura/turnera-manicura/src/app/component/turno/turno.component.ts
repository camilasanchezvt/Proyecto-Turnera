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

  // Horas y minutos para el select
  horas: string[] = Array.from({ length: 12 }, (_, i) => String(i + 9).padStart(2, '0'));
  minutos: string[] = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  constructor() {}

  ngOnInit(): void {
    // Escucha el evento para permitir instalación PWA
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.instalarDisponible = true; // ahora se puede mostrar el botón
      console.log('✅ Evento de instalación detectado');
    });

    // Escucha si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('✅ Aplicación instalada');
      this.deferredPrompt = null;
      this.instalarDisponible = false;
    });
  }

  abrirModal(serviceName: string): void {
    this.servicioSeleccionado = serviceName;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  reservarTurno(form: NgForm): void {
    if (form.invalid) return;

    const horaCompleta = `${form.value.hora}:${form.value.minutos}`;

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

    const turnoExistente = this.turnos.find(t =>
      t.fecha === nuevoTurno.fecha &&
      t.hora === nuevoTurno.hora &&
      t.conQuien === nuevoTurno.conQuien
    );

    if (turnoExistente) {
      alert('⚠️ Este turno ya está reservado.');
      return;
    }

    this.turnos.push(nuevoTurno);
    this.closeModal();
    this.activeTab = 'misTurnos';
  }

  deleteTurno(id?: string): void {
    if (!id) return;
    this.turnos = this.turnos.filter(t => t.id !== id);
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

    // Muestra el prompt de instalación
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
