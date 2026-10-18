import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

//Espera 2,5 segundos antes de devolver true, simulando una petición y recepción de respuesta de nuestro backend
async function sleep(){
 return new Promise( resolve =>{
  setTimeout(()=>{
    resolve(true);
  }, 2500);
 });
}


export class FormUtils {

  //Expresiones Regulares
  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors){

      for (const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'Este campo es obligatorio'

        case 'minlength':
          return `Este campo debe contener al menos ${ errors['minlength'].requiredLength } caracteres`

        case 'min':
          return `El valor mínimo es de ${ errors['min'].min }`

        case 'email':
          return 'El valor introducido no es un correo electrónico válido'

        case 'pattern':

        if(errors['pattern'].requiredPattern === FormUtils.emailPattern){
            return 'El valor introducido no es un correo electrónico válido'
        }

        if(errors['pattern'].requiredPattern === FormUtils.namePattern){
            return 'Debe tener formato Nombre Apellido'
        }
        if(errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern){
            return 'El nombre de usuario no puede contener espacios'
        }

        return 'Error de validación de expresión regular'

        case 'emailTaken':
          return 'Este correo electrónico ya está siendo usado'

        case 'restrictedName':
          return 'Este nombre de usuario está restringido'

        default:
          return `Error no controlado ${key}`
      }
    }

    return null;

  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !! form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {

  if (!form.controls[fieldName]) return null;

  const errors = form.controls[fieldName].errors ?? {} ;

  return FormUtils.getTextError(errors);

  }


  //Arrays
   static isValidFieldInArray( formArray: FormArray, index: number){

    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );

  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {

  if (formArray.controls.length === 0) return null;

  const errors = formArray.controls[index].errors ?? {} ;

  return FormUtils.getTextError(errors);

  }

  //Validación Personalizada
  static isFieldOneEqualToFieldTwo(field1: string, field2: string){
    return ( formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { fieldsNotEqual: true }
    };
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null>{

    await sleep(); // 2,5 segundos

    const formValue = control.value;

    if(formValue === 'hola@mundo.com'){
      return {
        emailTaken: true,
      }
    }

    return null;

  }

  static restrictedUserName(control: AbstractControl): ValidationErrors | null{

    const userName = control.value;

    if(userName === 'strider'){
      return {
        restrictedName: true,
      }
    }

    return null;

  }


}
