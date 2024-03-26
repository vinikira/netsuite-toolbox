browser.contextMenus.create({
    id: 'nsts-main-menu',
    title: 'NetSuite Toolbox',
    icons: {
        '16': '../netsuite.png'
    },
    documentUrlPatterns: [
        'https://*.netsuite.com/*'
    ]
})

browser.contextMenus.create({
    id: 'nstbCopyFieldId',
    parentId: 'nsts-main-menu',
    title: 'Copy Field Id',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbEnableField',
    parentId: 'nsts-main-menu',
    title: 'Enable Field',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbDisableField',
    parentId: 'nsts-main-menu',
    title: 'Disable Field',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbSearchId',
    parentId: 'nsts-main-menu',
    title: 'Search by field ID'
})

browser.contextMenus.create({
    id: 'nstbSearchLabel',
    parentId: 'nsts-main-menu',
    title: 'Search by Field Label'
})

browser.contextMenus.create({
    id: 'nstbLoadRecord',
    parentId: 'nsts-main-menu',
    title: 'Load Current Record'
})

browser.contextMenus.create({
    id: 'nstbExportSearch',
    parentId: 'nsts-main-menu',
    title: 'Export Search to JSON'
})

browser.contextMenus.create({
    id: 'nstbExportRecord',
    parentId: 'nsts-main-menu',
    title: 'Export Record to JSON'
})

browser.contextMenus.create({
    id: 'nstbLoadSS2Modules',
    parentId: 'nsts-main-menu',
    title: 'Load SS2 Modules'
})

browser.contextMenus.onClicked.addListener(function (info, tab) {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(
            tabs[0].id,
            {
                action: info.menuItemId,
                info
            })

    })
})
