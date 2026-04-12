const fs = require('fs');
const path = require('path');

// Load IPC data into memory once when the service starts
const ipcDataPath = path.join(__dirname, '..', 'data', 'IPC.json');
let ipcData = [];

// Helper to determine crime type based on keywords
const getCrimeType = (offence = '', description = '') => {
    const text = (offence + ' ' + (description || '')).toLowerCase();

    if (text.includes('murder') || text.includes('homicide') || text.includes('killing') || text.includes('death')) return 'Violent Crimes (Major)';
    if (text.includes('hurt') || text.includes('assault') || text.includes('violence') || text.includes('weapon') || text.includes('injury')) return 'Violent Crimes (Minor/General)';
    if (text.includes('rape') || text.includes('sexual') || text.includes('woman') || text.includes('female') || text.includes('marriage') || text.includes('miscarriage')) return 'Sexual/Women Related';
    if (text.includes('child') || text.includes('minor') || text.includes('juvenile')) return 'Crimes Against Children';
    if (text.includes('theft') || text.includes('robbery') || text.includes('extort') || text.includes('cheating') || text.includes('fraud') || text.includes('property') || text.includes('stolen') || text.includes('money')) return 'Financial/Property Crimes';
    if (text.includes('public servant') || text.includes('government') || text.includes('election') || text.includes('authority') || text.includes('state')) return 'Against State/Public Authority';
    if (text.includes('nuisance') || text.includes('peace') || text.includes('assembly') || text.includes('pollution') || text.includes('driving')) return 'Public Order & Safety';
    if (text.includes('false') || text.includes('perjury') || text.includes('justice') || text.includes('court') || text.includes('witness')) return 'False Evidence/Justice';

    return 'General/Other';
};

// Helper to determine punishment range
const getPunishmentRange = (punishment = '') => {
    const p = (punishment || '').toLowerCase();

    if (p.includes('death') || p.includes('life')) return 'Life Imprisonment / Death';
    if (p.includes('10 years') || p.includes('14 years') || p.includes('ten years')) return 'Long Term (7 - 14 Years)';
    if (p.includes('3 years') || p.includes('5 years') || p.includes('7 years') || p.includes('seven years')) return 'Medium Term (3 - 7 Years)';
    if (p.includes('1 year') || p.includes('2 years') || p.includes('one year')) return 'Short Term (1 - 3 Years)';
    if (p.includes('month') || p.includes('fine only') || p.includes('₹') || p.includes('rupees')) return 'Very Short (< 1 Year)';

    return 'Not Specified/Varies';
};

try {
    const rawData = fs.readFileSync(ipcDataPath, 'utf-8');
    const parsedData = JSON.parse(rawData);

    // Map JSON fields to our application's schema format and add categorization
    ipcData = parsedData.map((item, index) => ({
        _id: `ipc-${index}`,
        section: item["IPC Section"],
        description: item["Description"],
        offence: item["Offence"],
        punishment: item["Punishment"],
        bailable: item["Bailable or Not"],
        natureOfOffence: item["Nature of Offence"],
        consequences: item["Consequences"],
        solutions: item["Solutions"],
        suggestions: item["Suggestions"], // This one exists
        crimeType: getCrimeType(item["Offence"], item["Description"]),
        punishmentRange: getPunishmentRange(item["Punishment"])
    }));

    console.log(`[IPC Service] Loaded and categorized ${ipcData.length} sections from file.`);
} catch (error) {
    console.error(`[IPC Service] Failed to load IPC.json:`, error);
}

/**
 * Searches IPC sections with support for natural language and filters.
 * @param {string} query - The search query
 * @param {object} filters - Optional filters (crimeType, punishmentRange)
 */
const findIPC = async (query, filters = {}) => {
    try {
        console.log(`[IPC Service] Searching with query: "${query}" and filters:`, filters);

        let results = ipcData.map(item => {
            let score = 0;
            const lowerQuery = (query || '').toLowerCase().trim();
            const tokens = lowerQuery.split(/[^a-z0-9]+/).filter(t => t.length > 2);

            if (lowerQuery) {
                const section = (item.section || '').toLowerCase();
                const offence = (item.offence || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();

                // 1. Precise Section Match
                const queryNumbers = lowerQuery.match(/\d+/g) || [];
                const sectionNumbers = section.match(/\d+/g) || [];
                const exactNumberMatch = queryNumbers.some(qn => sectionNumbers.includes(qn));

                if (exactNumberMatch) score += 60;
                if (section.includes(lowerQuery)) score += 40;

                // 2. Offence/Description Keyword Match
                if (offence.includes(lowerQuery)) score += 30;
                if (desc.includes(lowerQuery)) score += 15;

                // 3. Token Matching
                tokens.forEach(token => {
                    if (offence.includes(token)) score += 5;
                    if (desc.includes(token)) score += 2;
                });
            } else {
                score = 1; // Base score if only filtering
            }

            return { ...item, score };
        });

        // Apply Filters
        if (filters.crimeType && filters.crimeType !== 'All') {
            results = results.filter(r => r.crimeType === filters.crimeType);
        }
        if (filters.punishmentRange && filters.punishmentRange !== 'All') {
            results = results.filter(r => r.punishmentRange === filters.punishmentRange);
        }

        // Final filtering and sorting
        if (query) {
            results = results
                .filter(r => r.score > 0)
                .sort((a, b) => b.score - a.score);
        } else {
            // If no query, sort by section number naturally
            results.sort((a, b) => {
                const aNum = parseInt(a.section.match(/\d+/)) || 0;
                const bNum = parseInt(b.section.match(/\d+/)) || 0;
                return aNum - bNum;
            });
        }

        return results.slice(0, 50); // Limit to top 50 for performance

    } catch (error) {
        console.error("Error searching IPC:", error);
        throw error;
    }
};

module.exports = { findIPC };
