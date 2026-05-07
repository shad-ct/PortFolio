const fs = require('fs').promises; // Built-in Node.js module

const PROJECT_ID = "shad-ct0";
const API_KEY = "AIzaSyAo8N2l3DWt20ChKUOLVgkCLCZDYthpoVw";
const COLLECTION = "contacts";
const OUTPUT_FILE = "firestore_backup.txt";

/**
 * Recursively unwraps Firestore's REST API types (stringValue, mapValue, etc.)
 */
function unwrapFirestore(fields) {
    const result = {};
    for (const key in fields) {
        const valueObj = fields[key];
        const type = Object.keys(valueObj)[0];

        if (type === 'mapValue') {
            result[key] = unwrapFirestore(valueObj.mapValue.fields);
        } else if (type === 'arrayValue') {
            result[key] = (valueObj.arrayValue.values || []).map(v => {
                const subType = Object.keys(v)[0];
                return v[subType];
            });
        } else {
            result[key] = valueObj[type];
        }
    }
    return result;
}

async function scrapeFirestore() {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?key=${API_KEY}`;

    try {
        console.log(`Connecting to ${COLLECTION}...`);
        const response = await fetch(url);
        const result = await response.json();

        if (result.documents) {
            const cleanData = result.documents.map(doc => ({
                id: doc.name.split('/').pop(),
                ...unwrapFirestore(doc.fields)
            }));

            // Convert object to a formatted string for the text file
            const fileContent = JSON.stringify(cleanData, null, 2);

            // Write to local disk
            await fs.writeFile(OUTPUT_FILE, fileContent, 'utf8');

            console.log(`Success! ${cleanData.length} documents saved to ${OUTPUT_FILE}`);
        } else {
            console.log("No documents found. Check collection name or rules.");
        }
    } catch (error) {
        console.error("Scrape failed:", error);
    }
}

scrapeFirestore();