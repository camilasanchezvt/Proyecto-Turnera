// Importa Component para crear un componente de Angular
import { Component } from '@angular/core';

// Importa la clase Turno. Nota: La ruta de importación se corrige, asumiendo que 'model' está en el mismo nivel.
// Si tu archivo 'turno.ts' está en 'src/app/model/turno.ts', la importación debe ser relativa al archivo de origen.
// Asumo que esta importación es incorrecta para el AppComponent, pero la mantengo si 'model' existe aquí.
import { Turno } from './model/turno';

// Decorador @Component: define el componente principal
@Component({
  selector: 'app-root',                  // Selector para usar este componente en HTML (<app-root></app-root>)
  templateUrl: './app.component.html',   // Archivo HTML asociado
  styleUrls: ['./app.component.css']     // Archivo CSS asociado
})
export class AppComponent {
  // Título de la aplicación
  title = 'Flower Nail Beauty';

  // Colores usados en la interfaz (para estilos dinámicos)
  colors = {
    primary: '#E8ADA0',
    primaryDark: '#D9928A',
    secondary: '#D9B036',
    secondaryDark: '#B8922C',
    accent: '#A8C5A3',
    light: '#F2D9D0',
    lighter: '#FFF8F5',
    text: '#4A3831',
  };

  // Lista de servicios disponibles
  services = [
    { name: 'Manicura Semi-permanente', price: '$22.000' },
    { name: 'Uñas Esculpidas', price: '$32.200' },
    { name: 'Pedicura Spa' , price: '$40.000' },
    { name: 'Kapping', price: '$24.000' },
  ];

  // Array donde se almacenan los turnos del usuario
  turnos: Turno[] = [];

  // Método para agregar un turno (vacío por ahora)
  addTurno(serviceName: string) {
    // Aquí se implementará la lógica para crear un turno nuevo
  }

  // Método para eliminar un turno por ID
  // 🛑 CORRECCIÓN: El ID ahora es de tipo 'string' para MongoDB
  deleteTurno(id?: string) {
    if (!id) return;
    this.turnos = this.turnos.filter(t => t.id !== id);
}

  // Métodos para cambiar el color de fondo del botón al pasar el mouse (hover)
  hoverEnter(event: Event) {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondaryDark;
  }

  hoverLeave(event: Event) {
    (event.target as HTMLElement).style.backgroundColor = this.colors.secondary;
  }
}