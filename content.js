const EXPLORE_PATH = "/feed/explore";
const TIMEOUT = 300;
const MAX_RETRIES = 20;

// Finds all links with /explore path
const getExploreLinks = () => {
    const links = Array.from(document.querySelectorAll("#endpoint"));
    return links.filter(link => link.href.includes(EXPLORE_PATH))
}

// Removes the link nodes
const removeExpore = (exploreLinks) => exploreLinks.forEach(link => link.remove());

// Retry helper keeps calling provided callback until get a result or reach max retries
const withRetry = (cb) => {
    let retries = MAX_RETRIES;

    const retry = () => new Promise((resolve) => setTimeout(() => {
        if(!retries) {
            resolve(null);
        }

        const result = cb();

        if(result) {
            resolve(result);
        }
        else {
            retries -= 1;
            retry();
        }
    }, TIMEOUT))

    retry();
}



window.onload = () => {
    // Remove links from sidebar
    removeExpore(getExploreLinks());

    // Add click handler for the side burger menu
    // Remove the feed link. Add retries if menu was not loaded immediately
    document.querySelector("#guide-button").onclick = () => {
        withRetry(() => {
            const links = getExploreLinks();
            if(links.length) {
                removeExpore(links);
                // Return truthy to resolve the Promise
                return 1;
            }

            return null;
        })
    }
}