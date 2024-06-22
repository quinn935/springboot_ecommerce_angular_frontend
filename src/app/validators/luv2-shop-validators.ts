import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

  // whitespace validation
  // if check fails, return ValidationErrors; if check passes, returns null
  static notOnlyWhitespace(control: FormControl): ValidationErrors{

    if((control.value != null) && (control.value.trim().length === 0)){

      // invalid, return error object
      return {'notOnlyWhitespace': true};
    }else{
      // valid, return null
      return null;
    }

  }
}
