if (((document.URL).indexOf('&xml=') === -1) && (!document.getElementById('netsuite-tool-box'))) injectScript()

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
    script.id = 'netsuite-tool-box'
    script.src = scriptURL
    ;(document.head || document.documentElement).appendChild(script)
}

browser.runtime.onMessage.addListener(onMessage);
