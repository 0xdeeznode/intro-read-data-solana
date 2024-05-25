async function myAsyncFunction() {
    let result;

    try {
        result = await fetch('https://catfact.ninja/fact');
        const data = await result.json();
        console.log('Did you know that... ', data.fact)
    } catch(error) {
        console.error('Error: ', error);
    }
}

myAsyncFunction();
