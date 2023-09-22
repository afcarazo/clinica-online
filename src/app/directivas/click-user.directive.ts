import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appClickUser]'
})
export class ClickUserDirective {

  @Input() appClickUser = '';
  constructor(private element: ElementRef) {

  }




  @HostListener('click') onClick() {

    this.activo()
    console.log('clickeo')

  }




  private activo() {
    switch (this.appClickUser) {
      case 'administrador':
        this.element.nativeElement.style.background = 'blue';
        break;
      case 'paciente':
        this.element.nativeElement.style.background = 'red';
        break;
      case 'especialista':
        this.element.nativeElement.style.background = 'green';
        break;
    }


  }


}
