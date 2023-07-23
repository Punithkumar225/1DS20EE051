// frontend.js
document.addEventListener('DOMContentLoaded', async function () {
    const numbersList = document.getElementById('numbersList');
    const urls = [
        'http://20.244.56.144/numbers/primes',
        // Add other valid URLs here
    ];

    const fetchDataFromURL = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.numbers;
        } catch (error) {
            console.error(`Error fetching data from URL: ${url}`, error);
            return [];
        }
    };

    const promises = urls.map(fetchDataFromURL);
    const dataArray = await Promise.all(promises);

    const allNumbers = dataArray.flatMap(data => data);
    const mergedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

    for (const number of mergedNumbers) {
        const li = document.createElement('li');
        li.textContent = number;
        numbersList.appendChild(li);
    }
});
