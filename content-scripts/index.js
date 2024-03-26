if (!document.getElementById('netsuite-tool-suite')) injectScript()

function onMessage (request, sender, sendResponse) {
    try {
        request.action && window.postMessage(request, '*')
    } catch (e) {
        alert(e.message)
    }
}

function injectScript () {
    const script = document.createElement('script')
    const scriptURL = browser.extension.getURL(
        '../content-scripts/page-javascript-context.js'
    )
    script.id = 'netsuite-tool-suite'
    script.src = scriptURL
    ;(document.head || document.documentElement).appendChild(script)
}

browser.runtime.onMessage.addListener(onMessage);
