const isXml = document.URL.includes('&xml=')

// add explicit check for login page to avoid injecting script
// and causing errors on login page (and clashes with Bitwarden password manager)

const isLoginPage = window.location.pathname.startsWith('/app/login')

// don't inject on the login page
if (!isXml && !isLoginPage && !document.getElementById('netsuite-tool-box')) {
  injectScript()
}

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
