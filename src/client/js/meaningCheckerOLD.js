const APP_BASE_URL = 'http://localhost:8081';

async function checkMeaning(sourceURL) {
    console.log('checkMeaning() called');

    const result = await fetch(`${APP_BASE_URL}/getMeaning`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: sourceURL }),
    });

    try {
        let data  = await result.json();

        if (data.status.code != 0) {
            throw new Error(data.status.msg);
        }
        
        return data;

    } catch(error) {
        console.log(`checkMeaning() ${error}`);
        throw error;
    }
}
export { checkMeaning }