/// <reference path="soho-input-validate.d.ts" />

import {
  AfterViewInit, Attribute, Directive, ElementRef,
  EventEmitter, HostBinding, Input, NgZone, Output
} from '@angular/core';

/**
 * Angular Wrapper for the SoHo Input Validate Directive.
 *
 * This component searches for an element with the attribute
 * 'data-validate' or 'data-validate-on="submit"'.
 */
@Directive({
  selector: 'form[soho-input-validate], input[soho-input-validate], input[data-validate], input[data-validate-on="submit"], textarea[data-validate], select[data-validate]' // tslint:disable-line
})
export class SohoInputValidateDirective implements AfterViewInit {

  /**
   * Local variables
   */
  private jQueryElement: JQuery;

  private validator: SohoInputValidateStatic;

  @HostBinding('attr.data-validate') @Input('data-validate') dataValidate: string;   // tslint:disable-line

  @Output() error = new EventEmitter<SohoInputValidateEvent>();
  @Output() alert = new EventEmitter<SohoInputValidateEvent>();
  @Output() confirm = new EventEmitter<SohoInputValidateEvent>();
  @Output() icon = new EventEmitter<SohoInputValidateEvent>();
  @Output() info = new EventEmitter<SohoInputValidateEvent>();
  @Output() valid = new EventEmitter<SohoInputValidateEvent>();

  constructor(
    private el: ElementRef,
    @Attribute('data-validate') dataValidateAttr, // tslint:disable-line
    private ngZone: NgZone,
  ) {
    this.dataValidate = dataValidateAttr;
  }

  /**
   * After the control has been initialised and the view is ready,
   * get the SoHoXi controls to activate any validations.
   */
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.jQueryElement = jQuery(this.el.nativeElement);

      this.jQueryElement.validate();

      // Initialise any event handlers.
      this.jQueryElement.on('error', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.error.emit(event);
      }));

      this.jQueryElement.on('alert', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.alert.emit(event);
      }));

      this.jQueryElement.on('confirm', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.confirm.emit(event);
      }));

      this.jQueryElement.on('icon', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.icon.emit(event);
      }));

      this.jQueryElement.on('info', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.info.emit(event);
      }));

      this.jQueryElement.on('valid', (event: SohoInputValidateEvent, validation) => this.ngZone.run(() => {
        event.validation = { field: validation.field[ 0 ], message: validation.message };
        this.valid.emit(event);
      }));

      this.validator = this.jQueryElement.data('validate');
    });
  }

  /**
   * Remove the message from the field if there is one and mark the field valid
   */
  public removeMessage(type) {
    this.ngZone.runOutsideAngular(() => {
      this.validator.removeMessage(this.jQueryElement, type);
    });
  }

  /**
   * Trigger validation of the field
   */
  public validate(event) {
    this.ngZone.runOutsideAngular(() => {
      this.validator.validate(this.jQueryElement, false, event);
    });
  }
}
