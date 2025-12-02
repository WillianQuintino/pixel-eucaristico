const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Carlo_Acutis.jpg",
        path: "public/images/carlo_acutis.jpg"
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Rycerz_Niepokalanej.jpg",
        path: "public/images/rycerz_niepokalanej.jpg"
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const request = (currentUrl) => {
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            https.get(currentUrl, options, (response) => {
                // Handle Redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    console.log(`Redirecting to ${response.headers.location}`);
                    return request(response.headers.location);
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download ${currentUrl}: Status Code ${response.statusCode}`));
                    return;
                }

                const file = fs.createWriteStream(filepath);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Successfully downloaded ${filepath} (${response.headers['content-length']} bytes)`);
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });
        };

        request(url);
    });
};

(async () => {
    for (const img of images) {
        try {
            console.log(`Starting download for ${img.path}...`);
            await downloadImage(img.url, img.path);
        } catch (error) {
            console.error(`Error downloading ${img.path}:`, error.message);
        }
    }
})();
