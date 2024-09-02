import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IFactura } from '../Interfaces/factura';
import { Router, RouterLink } from '@angular/router';
import { FacturaService } from '../Services/factura.service';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'] // Asegúrate de que 'styleUrls' esté en plural
})
export class FacturasComponent implements OnInit {
  listafacturas: IFactura[] = [];
  facturaSeleccionada: IFactura | null = null; // Factura seleccionada para actualizar

  constructor(private facturaServicio: FacturaService) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.facturaServicio.todos().subscribe(
      (data: IFactura[]) => {
        this.listafacturas = data;
      },
      (error) => {
        console.error('Error al cargar las facturas:', error);
      }
    );
  }

  eliminar(idFactura: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      this.facturaServicio.eliminar(idFactura).subscribe(
        (response: number) => {
          console.log('Factura eliminada con éxito:', response);
          this.cargarFacturas(); // Recargar la lista de facturas después de eliminar
        },
        (error) => {
          console.error('Error al eliminar la factura:', error);
        }
      );
    }
  }

  seleccionarFactura(factura: IFactura): void {
    this.facturaSeleccionada = { ...factura }; // Hacer una copia de la factura seleccionada para editar
  }

  actualizarFactura(): void {
    if (this.facturaSeleccionada) {
      this.facturaServicio.actualizar(this.facturaSeleccionada).subscribe(
        (response: string) => {
          console.log('Factura actualizada con éxito:', response);
          this.facturaSeleccionada = null; // Limpiar la selección después de la actualización
          this.cargarFacturas(); // Recargar la lista de facturas después de actualizar
        },
        (error) => {
          console.error('Error al actualizar la factura:', error);
        }
      );
    }
  }
}
