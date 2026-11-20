import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CotizacionPanelComponent } from './cotizacion-panel.component';
import { CotizacionService } from '../core/cotizacion.service';

describe('Panel de cotización (PRD 13)', () => {
  let fixture: ComponentFixture<CotizacionPanelComponent>;
  let cot: CotizacionService;

  beforeEach(async () => {
    localStorage.removeItem('lawal-cotizacion-v1');
    await TestBed.configureTestingModule({
      imports: [CotizacionPanelComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    cot = TestBed.inject(CotizacionService);
    cot.agregar({ id: 890, nombre: 'Polín impregnado', medida: '3-4 x 2,60 m', precio: 2800, imagen: null, slug: 'polin' }, 10);
    cot.agregar({ id: 814, nombre: 'Pellet Pellet Sur', medida: 'Saco 15 kg', precio: 5490, imagen: null, slug: 'pellet' }, 2);
    cot.agregar({ id: 654, nombre: 'Iniciador de fuego', medida: 'Caja de pastillas', precio: 2800, imagen: null, slug: 'ini' }, 1);
    cot.abierta.set(true);
    fixture = TestBed.createComponent(CotizacionPanelComponent);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('lawal-cotizacion-v1'));

  const boton = () => fixture.nativeElement.querySelector('[data-test="enviar"]') as HTMLButtonElement;

  it('sin despacho ni retiro el botón está deshabilitado y lo dice', () => {
    expect(cot.entrega()).toBeNull();
    expect(boton().disabled).toBeTrue();
    expect(boton().textContent).toContain('Elige despacho o retiro');
    expect(fixture.nativeElement.querySelector('[data-test="preview"]')).toBeNull();
  });

  it('al elegir despacho muestra el total, la vista previa exacta y abre wa.me', () => {
    cot.elegirEntrega('despacho');
    fixture.detectChanges();
    expect(boton().disabled).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('$41.780');
    const pre = fixture.nativeElement.querySelector('[data-test="preview"] pre') as HTMLElement;
    expect(pre.textContent).toBe(cot.mensaje());
    expect(cot.mensaje().split('\n')[4]).toBe('Total estimado: $41.780 · Despacho a domicilio');
    const abrir = spyOn(window, 'open');
    boton().click();
    expect(abrir).toHaveBeenCalled();
    expect(String(abrir.calls.mostRecent().args[0])).toMatch(/^https:\/\/wa\.me\/56967453739\?text=/);
  });

  it('ajustar cantidades y quitar productos', () => {
    cot.cambiarCantidad(814, 3);
    cot.quitar(654);
    expect(cot.items().length).toBe(2);
    expect(cot.total()).toBe(10 * 2800 + 3 * 5490);
  });
});
