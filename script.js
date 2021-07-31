const DateTime = luxon.DateTime;
const buttonElement = document.getElementById('correct-button');
let inputHasValue = false;
let textareaHasValue = false;
let splitCorrecter = document.getElementById('correcter');
let timecodes = document.getElementById('timecodes');


document.getElementById("correcter")
  .addEventListener("input", (event) => {
    inputHasValue = !!event.currentTarget.value.length;
    watchButtonDisable();
  });


document.getElementById("timecodes")
  .addEventListener("input", (event) => {
    textareaHasValue = !!event.currentTarget.value.length;
    watchButtonDisable();
  });


const watchButtonDisable = () => {
  if (inputHasValue && textareaHasValue) {
    buttonElement.removeAttribute("disabled");
  } else {
    buttonElement.setAttribute('disabled', '');
  }
}


const correct = () => {
  if (!buttonElement.hasAttribute('disabled') && inputHasValue && textareaHasValue) {
    const r = /\d+/g;
    splitCorrecter = splitCorrecter.value.split(':');
    timecodes = timecodes.value.split('\n');

    const correctedCodes = timecodes.map(code => {
      if (code.includes('00:00:00')) {
        return code + '\n';
      }
      if (code && code.length) {
        const splitCode = code.match(r);
        const joinedCode = splitCode.join(':');
        let codeToChange;
        let correctedCode = '';

        if (splitCode.length === 2) {
          codeToChange = DateTime.local(2007, 5, 15, 0, +splitCode[0], +splitCode[1]);
          codeToChange = codeToChange.minus({minutes: +splitCorrecter[0], seconds: +splitCorrecter[1]});
          correctedCode = `${String(codeToChange.minute).length === 1 ? '0' + codeToChange.minute : codeToChange.minute}:${String(codeToChange.second).length === 1 ? '0' + codeToChange.second : codeToChange.second}`;
        } else {
          codeToChange = DateTime.local(2007, 5, 15, +splitCode[0], +splitCode[1], +splitCode[2]);
          codeToChange = codeToChange.minus({hours: +splitCorrecter[0], minutes: +splitCorrecter[1], seconds: +splitCorrecter[2]});
          correctedCode = `${String(codeToChange.hour).length === 1 ? '0' + codeToChange.hour : codeToChange.hour}:${String(codeToChange.minute).length === 1 ? '0' + codeToChange.minute : codeToChange.minute}:${String(codeToChange.second).length === 1 ? '0' + codeToChange.second : codeToChange.second}`;
        }
        code = code.replace(joinedCode, correctedCode.trim());

        return code + '\n';
      }
    });

    document.getElementById('timecodes').value = correctedCodes.join('');
    buttonElement.innerHTML = 'Success!';
    buttonElement.style.color = 'green';
    buttonElement.setAttribute('disabled', '');
    document.getElementById('timecodes').focus();
    document.getElementById('timecodes').select();
  } else {
    buttonElement.innerHTML = 'Fail!';
    buttonElement.style.color = 'red';
  }
};


const setValue = (type) => {
  if (type === 'input') {
    splitCorrecter.value = '00:07:23';
    inputHasValue = true;
  } else {
    timecodes.value = '00:10:23 Stream started\n00:45:11 Next topic'
    textareaHasValue = true;
  }
  watchButtonDisable();
}
