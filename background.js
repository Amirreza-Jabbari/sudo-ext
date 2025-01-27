chrome.runtime.onInstalled.addListener(() => {
    console.log("Custom Search Extension Installed");
    chrome.storage.sync.set({ commands: {} });
});

const websites = {
    "gt": "https://github.com/",
    "gpt": "https://chat.openai.com/",
    "yt": "https://www.youtube.com/",
    "ai": "https://blackbox.ai/",
    "tg": "https://web.telegram.org/",
    "gm": "https://mail.google.com/",
    "hoo": "https://www.yahoo.com/",
    "cnv": "https://www.canva.com/",
}

// Define a mapping of prefixes to search URLs
const searchEngines = {
    "a: ": "https://www.amazon.com/s?k=",
    "amazon: ": "https://www.amazon.com/s?k=",
    "arxiv: ": "https://arxiv.org/search/?query=",
    "bbc: ": "https://www.bbc.co.uk/search?q=",
    "bing: ": "https://www.bing.com/search?q=",
    "b: ": "https://www.bing.com/search?q=",
    "bitbucket: ": "https://bitbucket.org/repo/all?name=",
    "coursera: ": "https://www.coursera.org/search?query=",
    "canvas: ": "https://canvas.instructure.com/search?q=",
    "c: ": "https://www.codecademy.com/search?q=",
    "d: ": "https://www.dailymotion.com/search/",
    "devto: ": "https://dev.to/search?q=",
    "edureka: ": "https://www.edureka.co/search?q=",
    "edx: ": "https://www.edx.com/search?q=",
    "fb: ": "https://www.facebook.com/search/top/?q=",
    "f: ": "https://www.fanfiction.net/search.php?keywords=",
    "flickr: ": "https://www.flickr.com/search/?text=",
    "futurelearn: ": "https://www.futurelearn.com/courses/search?q=",
    "gh: ": "https://www.goodreads.com/search?q=",
    "gitlab: ": "https://gitlab.com/search?search=",
    "giphy: ": "https://giphy.com/search/",
    "g: ": "https://github.com/search?q=",
    "h: ": "https://www.hulu.com/search?q=",
    "hubspot: ": "https://academy.hubspot.com/courses/search?q=",
    "img: ": "https://www.google.com/search?tb=isch&q=",
    "im: ": "https://www.imdb.com/find?q=",
    "k: ": "https://www.khanacademy.org/search?page_search_query=",
    "l: ": "https://www.lynda.com/search?q=",
    "li: ": "https://www.linkedin.com/search/results/all/?keywords=",
    "m: ": "https://www.merriam-webster.com/dictionary/",
    "medium: ": "https://medium.com/search?q=",
    "netflix: ": "https://www.netflix.com/search?q=",
    "news: ": "https://news.google.com/search?q=",
    "openlearn: ": "https://www.open.edu/openlearn/search/?q=",
    "pandora: ": "https://www.pandora.com/search/",
    "p: ": "https://www.pinterest.com/search?q=",
    "pluralsight: ": "https://www.pluralsight.com/search?q=",
    "pubmed: ": "https://pubmed.ncbi.nlm.nih.gov/?term=",
    "r: ": "https://www.reddit.com/search?q=",
    "sc: ": "https://www.sciencedirect.com/search?qs=",
    "s: ": "https://www.scribd.com/search?query=",
    "skillshare: ": "https://www.skillshare.com/search?query=",
    "sitepoint: ": "https://www.sitepoint.com/search/?q=",
    "smashing: ": "https://www.smashingmagazine.com/search/",
    "soundcloud: ": "https://soundcloud.com/search?q=",
    "t: ": "https://www.ted.com/search?q=",
    "tiktok: ": "https://www.tiktok.com/search?q=",
    "trip: ": "https://www.tripadvisor.com/Search?q=",
    "twitch: ": "https://www.twitch.tv/search?term=",
    "udacity: ": "https://www.udacity.com/courses/all?search=",
    "udemy: ": "https://www.udemy.com/courses/search/?q=",
    "v: ": "https://www.vimeo.com/search?q=",
    "vk: ": "https://www.vk.com/search?c[search]=&c[section]=all&q=",
    "wattpad: ": "https://www.wattpad.com/search/all?q=",
    "w: ": "https://en.wikipedia.org/wiki/Special:Search?search=",
    "yt: ": "https://www.youtube.com/results?search_query=",
    "ytmusic: ": "https://music.youtube.com/search?q=",
    "z: ": "https://www.zillow.com/homes/for_sale/"
};

// Function to validate URLs
const isValidUrl = (url) => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
};

const copyToClipboard = async (text) => {
    try {
        // Use the Clipboard API
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        
        // Fallback method using a temporary input element
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (fallbackErr) {
            console.error('Fallback copy method failed:', fallbackErr);
            return false;
        }
    }
};

// Modify shortenUrl function
// const shortenUrl = async (urlToShorten) => {
//     // Remove quotes if present
//     urlToShorten = urlToShorten.replace(/^"|"$/g, '').trim();

//     // Validate URL
//     if (!isValidUrl(urlToShorten)) {
//         console.error("Invalid URL");
//         console.log("Invalid URL format");
//         return;
//     }

//     try {
//         // Use the ulvis.net API to shorten the URL
//         const response = await fetch('https://ulvis.net/api/v1/shorten', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 url: urlToShorten,
//             }),
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         const shortenedUrl = data.shortUrl;

//         // Use the custom clipboard function
//         const copySuccess = await copyToClipboard(shortenedUrl);
        
//         if (copySuccess) {
//             console.log(`Shortened URL copied: ${shortenedUrl}`);
//         } else {
//             console.log(`Shortened URL: ${shortenedUrl} (Unable to automatically copy)`);
//         }
//     } catch (error) {
//         console.error("Error shortening URL:", error);
//         console.log("Unable to shorten URL. Please check your internet connection.");
//     }
// };

// Similar modification for expandUrl
// const expandUrl = async (shortUrl) => {
//     // Remove quotes if present
//     shortUrl = shortUrl.replace(/^"|"$/g, '').trim();

//     // Validate short URL
//     if (!/^(https?:\/\/)?(tinyurl\.com|is\.gd|bit\.ly)\/\w+$/.test(shortUrl)) {
//         console.error("Invalid shortened URL");
//         console.log("Invalid shortened URL format");
//         return;
//     }

//     try {
//         const response = await fetch(shortUrl, { 
//             method: 'HEAD', 
//             redirect: 'follow' 
//         });
        
//         const originalUrl = response.url;
        
//         // Use the custom clipboard function
//         const copySuccess = await copyToClipboard(originalUrl);
        
//         if (copySuccess) {
//             console.log(`Original URL copied: ${originalUrl}`);
//         } else {
//             console.log(`Original URL: ${originalUrl} (Unable to automatically copy)`);
//         }
//     } catch (error) {
//         console.error("Error expanding URL:", error);
//         console.log("Unable to expand URL. Please check the link and your internet connection.");
//     }
// };

// Provide autocomplete suggestions for search engines and custom commands
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
    const suggestions = [];

    // Include predefined website commands
    for (const [prefix, url] of Object.entries(websites)) {
        if (prefix.startsWith(text)) {
            suggestions.push({
                content: prefix,
                description: `Go to website "${prefix.trim()}"`,
            });
        }
    }

    // Include predefined search engine prefixes
    for (const prefix of Object.keys(searchEngines)) {
        if (prefix.startsWith(text)) {
            suggestions.push({
                content: prefix,
                description: `Search using prefix "${prefix.trim()}"`,
            });
        }
    }

    // Include custom commands from storage
    const { commands } = await chrome.storage.sync.get("commands");
    if (commands) {
        for (const prefix of Object.keys(commands)) {
            if (prefix.startsWith(text)) {
                suggestions.push({
                    content: prefix,
                    description: `Custom command "${prefix}"`,
                });
            }
        }
    }

    // Add bookmark management commands
    const bookmarkCommands = ["addbookmark", "rmbookmark", "lsbookmarks"];
    for (const command of bookmarkCommands) {
        if (command.startsWith(text)) {
            suggestions.push({
                content: command,
                description: `Bookmark management command "${command}"`,
            });
        }
    }

    // Add weather commands
    const weatherCommands = ["weather", "forecast"];
    for (const command of weatherCommands) {
        if (command.startsWith(text)) {
            suggestions.push({
                content: command,
                description: `Weather command "${command}"`,
            });
        }
    }

    // Add pin suggestions
    if (text === "pin") {
        suggestions.push({
            content: "pin",
            description: "Pin the current tab",
        });
    }

    // Add unpin suggestions
    if (text === "unpin") {
        suggestions.push({
            content: "unpin",
            description: "Unpin the current tab",
        });
    }

    if (text === "mute") {
        suggestions.push({
            content: "mute",
            description: "Mute the current tab",
        });
    }

    // Add clear cache suggestions
    if (text === "clear") {
        suggestions.push({
            content: "clear",
            description: "Clear cache",
        });
    }

    // Add clear and rmhistory commands
    const clearCommands = [
        { 
            command: "rmhistory recent", 
            description: "Remove browsing history from the last hour" 
        },
        { 
            command: "rmhistory today", 
            description: "Remove browsing history from today" 
        },
        { 
            command: "rmhistory week", 
            description: "Remove browsing history from the last week" 
        }
    ];

    for (const cmd of clearCommands) {
        if (cmd.command.startsWith(text)) {
            suggestions.push({
                content: cmd.command,
                description: cmd.description
            });
        }
    }

    // Add exit and kill command suggestions
    const systemCommands = ["exit", "kill", "new"];
    for (const command of systemCommands) {
        if (command.startsWith(text)) {
            suggestions.push({
                content: command,
                description: `System command: ${command}`
            });
        }
    }

    // Handle URL shortening and expanding suggestions
    // const urlCommands = ["shorten", "expand"];
    // for (const command of urlCommands) {
    //     if (command.startsWith(text)) {
    //         suggestions.push({
    //             content: command,
    //             description: `URL command "${command}"`,
    //         });
    //     }
    // }

    // Handle time-related suggestions
    if (text === "t") {
        suggestions.push({
            content: "time",
            description: 'time: Get the current time',
        });
        suggestions.push({
            content: "time ",
            description: 'time: Get the current time in a specific city (e.g., "time London")',
        });
    }

    if (text.startsWith("time ")) {
        const city = text.slice(5).trim();
        if (city) {
            suggestions.push({
                content: `time ${city}`,
                description: `Get the current time in ${city}`,
            });
        }
    }

    // Pass the suggestions to Chrome
    suggest(suggestions);
});

// Handle omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
    let url;

    // Check if user wants to add a new command
    if (text.startsWith("add ")) {
        const match = text.match(/add "(.+?)" "(.+?)"/);
        if (match) {
            const [_, prefix, searchUrl] = match;
            const commands = (await chrome.storage.sync.get("commands")).commands || {};
            commands[prefix] = searchUrl;
            await chrome.storage.sync.set({ commands });
            console.log(`Command added: ${prefix} -> ${searchUrl}`);
            return;
        } else {
            console.error('Invalid add command format. Use: add "prefix" "searchUrl"');
            return;
        }
    }

    // Check if the user wants to add a bookmark
    if (text.startsWith("addbookmark ")) {
        const match = text.match(/addbookmark "(.+?)" "(.+?)"/);
        if (match) {
            const [_, title, url] = match;
            chrome.bookmarks.create({ title, url }, () => {
                console.log(`Bookmark added: ${title} -> ${url}`);
            });
            return;
        } else {
            console.error('Invalid addbookmark command format. Use: addbookmark "title" "url"');
            return;
        }
    }

    // Check if the user wants to delete a bookmark by title with quotes
    if (text.startsWith("rmbookmark ")) {
        const match = text.match(/^rmbookmark\s+"(.+)"$/);
        if (match) {
            const title = match[1]; // Extract the bookmark name from quotes
            chrome.bookmarks.search({ title }, (results) => {
                if (results.length > 0) {
                    chrome.bookmarks.remove(results[0].id, () => {
                        console.log(`Bookmark removed: ${title}`);
                    });
                } else {
                    console.error(`Bookmark with title "${title}" not found.`);
                }
            });
        } else {
            console.error('Invalid rmbookmark command format. Use: rmbookmark "bookmark_name"');
        }
        return;
    }

    // Check if the user wants to list bookmarks
    if (text === "lsbookmarks") {
        chrome.tabs.create({ url: "chrome://bookmarks/" });  // Opens the bookmarks sidebar
        return;
    }

    // check for pin command
    if (text === "pin") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { pinned: true });
                console.log(`Tab pinned: ${tabs[0].title}`);
            }
        });
        return;
    }

    // Handle unpin command
    if (text === "unpin") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                // Check if the tab is currently pinned
                if (tabs[0].pinned) {
                    // Unpin the tab
                    chrome.tabs.update(tabs[0].id, { pinned: false }, (updatedTab) => {
                        console.log(`Tab unpinned: ${updatedTab.title}`);
                    });
                } else {
                    console.log("The current tab is not pinned.");
                }
            }
        });
        return;
    }
        
    // Handle mute command
    if (text === "mute") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                // Toggle mute state
                chrome.tabs.update(tabs[0].id, { 
                    muted: !tabs[0].mutedInfo.muted 
                }, (updatedTab) => {
                    console.log(`Tab ${updatedTab.mutedInfo.muted ? 'muted' : 'unmuted'}`);
                });
            }
        });
        return;
    }

    // Exit command to close the browser
    if (text === "exit") {
        chrome.windows.getCurrent((currentWindow) => {
            chrome.windows.remove(currentWindow.id, () => {
                console.log("Browser window closed");
            });
        });
        return;
    }

    // Kill command to close the current tab
    if (text === "kill") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.remove(tabs[0].id, () => {
                    console.log(`Tab closed: ${tabs[0].title}`);
                });
            }
        });
        return;
    }

    // New command to open a new tab
    if (text === "new") {
        chrome.tabs.create({ url: "chrome://newtab" }, () => {
            console.log("New tab opened");
        });
        return;
    }

    // shorten command
    // if (text.startsWith("shorten ")) {
    //     // Extract the URL, removing the "shorten " prefix
    //     const urlToShorten = text.slice(8).trim();
    //     await shortenUrl(urlToShorten);
    //     return;
    // }

    // // expand command
    // if (text.startsWith("expand ")) {
    //     const shortUrl = text.slice(7).trim();
    //     await expandUrl(shortUrl);
    //     return;
    // }

    // Check for weather commands
    if (text.startsWith("weather ")) {
        const city = text.slice(8).trim();
        if (city ) {
            url = `https://www.accuweather.com/en/search-locations?query=${encodeURIComponent(city)}`;
        }
    } else if (text.startsWith("forecast ")) {
        const city = text.slice(9).trim();
        if (city) {
            url = `https://www.accuweather.com/en/search-locations?query=${encodeURIComponent(city)}`;
        }
    }

    // Check for user-defined commands
    const commands = (await chrome.storage.sync.get("commands")).commands || {};
    for (const [prefix, searchUrl] of Object.entries(commands)) {
        if (text.startsWith(`${prefix}:`)) {
            const query = text.slice(prefix.length + 1); // Remove 'prefix:' from input
            url = `${searchUrl}?q=${encodeURIComponent(query)}`; 
            break;
        }
    }

    // Check for website commands
    for (const [prefix, websiteUrl] of Object.entries(websites)) {
        if (text.startsWith(prefix)) {
            url = websiteUrl; // Directly use the website URL
            break;
        }
    }

    // Check predefined commands
    if (!url) {
        for (const [prefix, searchUrl] of Object.entries(searchEngines)) {
            if (text.startsWith(prefix)) { // Matching the prefix itself
                const query = text.slice(prefix.length).trim(); // Extract query after prefix
                url = `${searchUrl}${encodeURIComponent(query)}`;
                break;
            }
        }
    }

    // Handle time-related commands
    if (text === "time") {
        url = "https://www.google.com/search?q=time";
    } else if (text.startsWith("time ")) {
        const city = text.slice(5).trim();
        if (city) {
            url = `https://www.google.com/search?q=time+${encodeURIComponent(city)}`;
        }
    }

    // Handle cache clearing command
    if (text === "clear") {
        chrome.browsingData.remove({
            "since": 0
        }, {
            "cache": true,
            "downloads": true,
            "formData": true,
            "passwords": false,
            "cookies": false,
            "localStorage": true
        }, () => {
            console.log("Browser cache cleared successfully");
            chrome.tabs.create({ 
                url: "chrome://newtab", 
                active: true 
            });
        });
        return;
    }

    // Handle history clearing commands
    if (text.startsWith("rmhistory")) {
        let timeFrame = text.split(" ")[1];
        let since;

        switch (timeFrame) {
            case "recent":
                since = Date.now() - 60 * 60 * 1000; // Last hour
                break;
            case "today":
                since = Date.now() - 24 * 60 * 60 * 1000; // Last day
                break;
            case "week":
                since = Date.now() - 7 * 24 * 60 * 60 * 1000; // Last week
                break;
            default:
                console.log("Invalid timeframe for history clearing");
                return;
        }

        chrome.browsingData.remove({
            "since": since
        }, {
            "history": true
        }, () => {
            console.log(`Browsing history cleared for the last ${timeFrame}`);
            chrome.tabs.create({ 
                url: "chrome://history", 
                active: true 
            });
        });
        return;
    }


    // Navigate to the resulting URL
    if (url) {
        chrome.tabs.update({ url });
    } else {
        console.error("No matching command found");
    }
});
