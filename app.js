let form = document.querySelector('#operation');
let button = document.querySelector('#reset-btn');

form.addEventListener('keyup', function (e){
  e.preventDefault();
  if(FormValidation.formIsField()){
    FormValidation.checkForm();
  }
});

form.addEventListener('click', function (e){

  if(e.target.name === 'tip-selection'){
    UI.resetInputText('tip-custom');
  } else if (e.target.name === 'tip-custom'){
    UI.resetInputRadio();
  } 

  if(FormValidation.formIsField()){
    FormValidation.checkForm();
  }
});

document.addEventListener('keyup', function (e){
  e.preventDefault();
  if (e.keyCode === 13) {
    if(FormValidation.formIsField()){
      FormValidation.checkForm();
    }
  }
});

button.addEventListener('click', function (e){
  UI.desactivedButton();
  UI.resetUI();
});

class UI {

  static updateTip(tip){
    let tipLabel = document.getElementsByClassName('result-number');
    tipLabel[0].innerHTML = `$${tip}`;
  }
  static updateBill(bill){
    let billLabel = document.getElementsByClassName('result-number');
    billLabel[1].innerHTML = `$${bill}`;
  }
  static showError(error, className){
    let errorMessage = document.querySelector(`.${className} .label-wrapper`);
    let html = document.createElement("span");
    html.classList.add("error");
    html.innerHTML = `${error}`;
    errorMessage.appendChild(html);
  }
  static removeError(){
    let error = document.getElementsByClassName('error');
    let length = error.length;
    for(let i = 0; i < length; i++){
      error[0].remove();    
    }
  }
  static activedButton(){
    document.getElementById('reset-btn').removeAttribute('disabled');
  }
  static desactivedButton(){
    document.getElementById('reset-btn').setAttribute('disabled', 'disabled');
  }
  static resetInputText(idName){
    document.getElementById(idName).value = '';
  }
  static resetInputRadio(){    
    for(let i = 0; i < 5; i++){
      document.getElementById('tip-' + i).checked = false;
    }
  }
  static resetUI(){
    let inputText = document.querySelectorAll('input[type="number"]');
    let inputRadio = document.querySelectorAll('input[type="radio"]');
    let resultLabel = document.getElementsByClassName('result-number');
      for(let i = 0; i < inputText.length; i++){
        inputText[i].value ='';
      }
      for(let i = 0; i < inputRadio.length; i++){
        inputRadio[i].checked = false;
      }
      for(let i = 0; i < resultLabel.length; i++){
        resultLabel[i].innerHTML = '$0.00';
      }
  }
}

class Calculator {
  static calculateTip(bill, tip, numberPeople){
    return ((Number(bill)*(Number(tip)/100))/Number(numberPeople)).toFixed(2);
  }

  static calculateBill(bill, numberPeople){
    return (Number(bill)/Number(numberPeople)).toFixed(2);
  }
}

class FormValidation {

  static checkForm(){
    
    UI.removeError();

    let updateValue = true;
    let numberInput = document.querySelectorAll("input[type=number]");
    let tip = numberInput[1].value;; 

    for(let i = 0; i < 3; i++){

      if (numberInput[i].value){
        let className;
        switch (i){
          case 0:
            className = 'bill'
            break;
          case 1:
            className = 'tip'
            break;
          case 2:
            className = 'number-people'
            break;
          default :
            break;
        }
        
        if (!ValueIntegrity.valueIsNumber(numberInput[i].value)){
          UI.showError('Should be a number', className)
          updateValue = false;
        }else if (ValueIntegrity.numberIsNegative(numberInput[i].value)){
          UI.showError('Should not be negative', className)
          updateValue = false;
        }else if (ValueIntegrity.numberIsDecimal(numberInput[i].value) && i ===2){
          UI.showError('Should be a full person', className)
          updateValue = false;
        }
      }
    }

    if(!tip){
      let inputRadio = document.querySelectorAll('input[type="radio"]');
      for(let i = 0; i < inputRadio.length; i++){
        console.log(inputRadio[i].checked);
        if (inputRadio[i].checked){
          tip =inputRadio[i].value;
        }
      }
    }

    if( updateValue){
      UI.activedButton();
      UI.updateTip(Calculator.calculateTip(
          numberInput[0].value,
          tip,
          numberInput[2].value)
          );
      UI.updateBill(Calculator.calculateBill(
        numberInput[0].value,
        numberInput[2].value));
    }
  }
  static formIsField(){
    let numberInput = document.querySelectorAll("input[type=number]")
    let radioSelected =false;
    
    for(let i = 0; i < 5; i++){
      if (document.getElementById('tip-' + i).checked){
        radioSelected = true;
      }
    }
    
      for(let i = 0; i < 3; i++){
        if (i !== 1){
          if (!numberInput[i].value){
            return false;
          }
        } else{
          if (!numberInput[i].value && !radioSelected){
              return false;
          }
        }
      }
      return true;
  }
}

class ValueIntegrity {
  
  static valueIsNumber(inputValue){
    const regex = new RegExp('^\\+?-?\\d*\\.?\\d+$');
    return regex.test(inputValue);
  }
  static numberIsDecimal(inputValue){
    const regex = new RegExp('^\\d*\\.\\d+$');
    return regex.test(inputValue);
  }
  static numberIsNegative(inputValue){
      return (inputValue < 0);
  }
}

