import { Directive, ElementRef, HostListener, Renderer2  } from '@angular/core';

@Directive({
  selector: '[appBtnHome]'
})
export class BtnHomeDirective {
  constructor(private elementRef : ElementRef, private re : Renderer2) 
  {
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.re.setStyle(this.elementRef.nativeElement,' background-color',' #ffffff'); 
    
    this.re.setStyle(this.elementRef.nativeElement,'-webkit-box-shadow','0px 8px 20px 0px rgba(0, 0, 0, 0.486)');
  }

  @HostListener('mouseleave') onMouseExit() {
    this.re.setStyle(this.elementRef.nativeElement,'background-color','#0f5bce');   
    this.re.setStyle(this.elementRef.nativeElement,'color','#fff');      
  }

}
