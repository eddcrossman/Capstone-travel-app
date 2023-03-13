async function handleSubmit(event) {
    event.preventDefault();

    const formText = document.getElementById('url').value;
    const resultsElement = document.getElementById('results');
    const explainerElement = document.getElementById('explainer');
    resultsElement.innerHTML = "";

    try {
        if (! validateURL(formText)) {
            throw new Error('Invalid URL, please check and try again');
        }

        const resultText = await Client.checkMeaning(formText);

        for (const [key,value] of Object.entries(resultText)) {
            if (typeof value === 'string'){
                let keyText = key.toLowerCase();
                let valueText = value.toLowerCase();

                keyText = keyText.charAt(0).toUpperCase() + keyText.slice(1);
                valueText = valueText.charAt(0).toUpperCase() + valueText.slice(1);

                resultsElement.innerHTML += `<h2>${keyText}</h2><p>${valueText}</p>`;
                explainerElement.style.visibility = 'visible';
            }
        }
    } catch(error) {
        alert(error.message);
    }
}

function validateURL(input){
    try {
        const checkURL = new URL(input);
        return checkURL.protocol === 'http:' || checkURL.protocol === 'https:';        
    } catch (error) {
        console.log(`validateURL() ${error}`);
        return false;
    }
}

export { handleSubmit }
export { validateURL }