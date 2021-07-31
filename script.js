let inputHasValue = false;
let textareaHasValue = false;
let splitCorrecter = document.getElementById('correcter');
let timecodes = document.getElementById('timecodes');
const buttonElement = document.getElementById('correct-button');

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
        let correctedCode = '';

        for (let i = 0; i < splitCode.length; i++) {
          let oneOf = Number(splitCode[i]) - Number(splitCorrecter[i]);
          if (oneOf < 0) {
            oneOf = String(60 + oneOf);

            // seconds
            if (i === 2) {
              const secondsCorrection = correctedCode.split(':');
              correctedCode = '';
              for (let i = 0; i < secondsCorrection.length - 1; i++) {
                if (secondsCorrection[i] > 0) {
                  let oneOf = Number(secondsCorrection[i]) - 1;
                  if (oneOf < 0) {
                    oneOf = String(60 + oneOf);
                  } else {
                    oneOf = String(oneOf);
                  }

                  if (oneOf.length === 1) {
                    oneOf = '0' + oneOf;
                  }
                  correctedCode += oneOf + ':';
                } else {
                  correctedCode += secondsCorrection[0] + ':';
                }
              }
            }
          } else {
            oneOf = String(oneOf);
          }

          if (oneOf.length === 1) {
            oneOf = '0' + oneOf;
          }
          correctedCode += oneOf + ':';
        }
        correctedCode = correctedCode.substring(0, correctedCode.length - 1);

        code = code.replace(joinedCode, correctedCode);

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
