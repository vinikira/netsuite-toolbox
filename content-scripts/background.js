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
    title: 'Export Search to SS2'
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
