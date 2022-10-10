browser.contextMenus.create({
    id: 'nstb-main-menu',
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
    parentId: 'nstb-main-menu',
    title: 'Copy Field Id',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbEnableField',
    parentId: 'nstb-main-menu',
    title: 'Enable Field',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbDisableField',
    parentId: 'nstb-main-menu',
    title: 'Disable Field',
    contexts: ['link']
})

browser.contextMenus.create({
    id: 'nstbSearchId',
    parentId: 'nstb-main-menu',
    title: 'Search by field ID'
})

browser.contextMenus.create({
    id: 'nstbSearchLabel',
    parentId: 'nstb-main-menu',
    title: 'Search by Field Label'
})

browser.contextMenus.create({
    id: 'nstbLoadRecord',
    parentId: 'nstb-main-menu',
    title: 'Load Current Record'
})

browser.contextMenus.create({
    id: 'nstbExportSearch',
    parentId: 'nstb-main-menu',
    title: 'Export Search to JSON'
})

browser.contextMenus.create({
    id: 'nstbExportRecordXML',
    parentId: 'nstb-main-menu',
    title: 'Export Record to XML'
})

browser.contextMenus.create({
    id: 'nstbExportRecordJSON',
    parentId: 'nstb-main-menu',
    title: 'Export Record to JSON'
})

browser.contextMenus.create({
    id: 'nstbLoadSS2Modules',
    parentId: 'nstb-main-menu',
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
