import { AbstractControl } from "@angular/forms";


export class CustomValidators {
        
    static forcaSenha(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value
        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const has8Digits = value.length >= 8 

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && has8Digits;

        return !passwordValid ? {forcaSenha:true}: null;
    }

    static cpf(control: AbstractControl): { [key: string]: boolean } | null {
        if (!control.value) {
            return null;
        }

        const valor: string = control.value;

        let cpf = valor;
        cpf = cpf.replace(/[^\d]+/g, '');
        // Elimina CPFs invalidos conhecidos    
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
            return { cpf: true };
        // Valida 1o digito 
        let add = 0;
        for (let i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return { cpf: true };
        // Valida 2o digito 
        add = 0;
        for (let i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return { cpf: true };
        return null;
        }
}

