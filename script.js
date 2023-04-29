"use strict";

class Calculator {
  constructor() {
    this.preview = document.querySelector('[data-preview]');
    this.input = document.querySelector('[data-input]');
    this.number = document.querySelectorAll('[data-number]');
    this.operator = document.querySelectorAll('[data-operator]');
    this.clear = document.querySelector('[data-clear]');
    this.delete = document.querySelector('[data-delete]');
    this.changeSign = document.querySelector('[data-changesign]');
    this.hasDot = document.querySelector('#dot');
    this.alertAddNumber = document.querySelector('#addNumber');
    this.alertNoChangeSign = document.querySelector('#noChangeSign');
    this.result = document.querySelector('[data-equals]');
    this.resultDisplayed = false;
    this.hasDot = false;

    // Add a number
    for (let i = 0; i < this.number.length; i++) {
      this.number[i].addEventListener("click", (e) => {
        let currentString = this.input.innerHTML;
        let lastChar = currentString[currentString.length - 1];
        
        // If the user is trying to add a second dot or if there is already a dot in the current number, do nothing
        if (e.target.innerHTML === "." && (lastChar === "." || this.hasDot)) {
          return;
        }

        if (this.resultDisplayed === false) {
          this.input.innerHTML += e.target.innerHTML;
          if (e.target.innerHTML === ".") {
            this.hasDot = true;
          } calculate.call(this);
        } else if (this.resultDisplayed === true && lastChar === "+" || lastChar === "-" ||
          lastChar === "x" || lastChar === "÷") { // If there's already a number and an operator, add a number
          this.resultDisplayed = false;
          this.input.innerHTML += e.target.innerHTML;
          if (e.target.innerHTML === ".") {
            this.hasDot = true;
          }
          calculate.call(this);
        } else { // If the result is shown, clears the result and adds the number
          this.resultDisplayed = false;
          this.input.innerHTML = "";
          this.input.innerHTML += e.target.innerHTML;
          if (e.target.innerHTML === ".") {
            this.hasDot = true;
          }
        }
      });
    }

    // Add an operator
    for (let i = 0; i < this.operator.length; i++) {
      this.operator[i].addEventListener("click", (e) => {
        let currentString = this.input.innerHTML;
        let lastChar = currentString[currentString.length - 1];
        
        // If there's already an operator, substitute
        if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
          let newString = currentString.substring(0, currentString.length - 1) +
            e.target.innerHTML;
          this.input.innerHTML = newString;
        } else if (currentString.length === 0 || lastChar === ".") { // If there's no number, notify the user to add one
          this.alertAddNumber.style.display = 'block';
            setTimeout(() => {
              this.alertAddNumber.style.display = "none";
            }, 4000);
        } else {
          this.input.innerHTML += e.target.innerHTML;
        }
      });
    }

    // Changes sign only if there's no operator and if there's a number
    this.changeSign.addEventListener("click", () => {
      let currentString = this.input.innerHTML;
      let lastChar = currentString[currentString.length - 1];
      let verifyOperator = currentString.match(/[+\-x÷]/);
    
      if (verifyOperator || lastChar === "+" || lastChar === "-" ||
        lastChar === "x" || lastChar === "÷") {
        this.alertNoChangeSign.style.display = 'block';
            setTimeout(() => {
              this.alertNoChangeSign.style.display = "none";
            }, 6000);
        return;
      } else if (currentString === "" || currentString === ".") {
        this.alertAddNumber.style.display = 'block';
        setTimeout(() => {
          this.alertAddNumber.style.display = "none";
        }, 4000);
        return;
      } else {
        this.input.innerHTML *= -1;
      }
      calculate.call(this);
    });

    // Calculate following the order of operations with: "÷", then "x", then "-" and then "+".
    function calculate() {
      let inputString = this.input.innerHTML;
      let numbers = inputString.split(/\+|\-|\x|\÷/g);
      let operators = inputString.replace(/[0-9]|\./g, "").split("");
  
      let divide = operators.indexOf("÷");
      while (divide != -1) {
        numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
        operators.splice(divide, 1);
        divide = operators.indexOf("÷");
      }
  
      let multiply = operators.indexOf("x");
      while (multiply != -1) {
        numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
        operators.splice(multiply, 1);
        multiply = operators.indexOf("x");
      }
  
      let subtract = operators.indexOf("-");
      while (subtract != -1) {
        numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
        operators.splice(subtract, 1);
        subtract = operators.indexOf("-");
      }
  
      let add = operators.indexOf("+");
      while (add != -1) {
        numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
        operators.splice(add, 1);
        add = operators.indexOf("+");
      }
  
      this.preview.innerHTML = numbers[0];
    };
    
    // Deletes the last character 
    this.delete.addEventListener("click", () => {
      this.input.innerHTML = this.input.innerHTML.substring(0, this.input.innerHTML.length - 1);
      calculate.call(this);
    })

    // Clear the input and the preview
    this.clear.addEventListener("click", () => {
      this.input.innerHTML = "";
      this.preview.innerHTML = "";
      this.hasDot = false;
    });

    // Shows the result of the equation by swapping the input with the preview
    this.result.addEventListener("click", () => {
      this.resultDisplayed = true;
      this.input.innerHTML = this.preview.innerHTML;
      this.preview.innerHTML = "";
    });
  }
}

const calculator = new Calculator();