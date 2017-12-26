
function nstbLoadRecord (event) {
    require(['N/currentRecord'], (currentRecord) => {
        window.recordLoaded = currentRecord.get()
        console.log('Current record is stored in "recordLoaded" variable!')
    })
}

function nstbCopyFieldId (event) {
    const { info } = event.data
    const field = Array.from(document.querySelectorAll("a[href='javascript:void(\"help\")']")).filter(e => e.text === info.linkText)[0]

    prompt(`ID ${info.linkText}`, extractIdFromField(field))
}

function highlightField (field) {
    clickOnParentWrapper(field)

    field.scrollIntoView(false)

    field.style.background = 'yellow'
    field.style.border = '1px solid red'

    setTimeout(() => {
        field.style.background = ''
        field.style.border = ''
    }, 3000)
}

function nstbSearchId () {
    const idToSearch = prompt('Input field ID to search')
    const field = document.getElementById(`${idToSearch}_fs_lbl`)

    field && highlightField(field)
}

function nstbSearchLabel () {
    const labelToSearch = prompt('Input field label to search').toUpperCase()
    const field = Array
          .from(document.querySelectorAll('span.smallgraytextnolink>a.smallgraytextnolink'))
          .reduce((node, actNode) =>
                  actNode.text.toUpperCase() === labelToSearch && !node ? actNode : node, '')

    if (!field) alert('Label not found.')

    console.log(field)

    highlightField(field.parentNode)
}

function nstbExportSearch () {
    require(['N/search', 'N/currentRecord', 'N/ui/dialog'], (search, cr, dialog) => {
        try {
            const currentRecord  = cr.get()

            if (!currentRecord.id) dialog.alert({
                title: 'NetSuite Toolbox',
                message:'Search is not saved. Please save search to export.'
            })

            const currentSearch = search.load({id: currentRecord.id})

            dialog.alert({
                title: 'Search exported',
                message: `<pre>${JSON.stringify(currentSearch, null, 2)}</pre>`
            })
        } catch (e) {
            dialog.alert({
                title: 'Error',
                message: e.message
            })
        }
    })
}

function evalFunction (event) {
    try {
        console.log('executando o eval funcion...');
        const fn = event.data.fn
        const response = fn()
        console.log('eval executado...');
    } catch (e) {
        console.log(e)
    }
}

function showCopiedIdMessage (target) {
    const message = document.createElement('p')

    message.innerText = 'ID Copied'

    target.parentElement.appendChild(message)

    setTimeout(() => {
        target.parentElement.removeChild(message)
    }, 1000)

    document.querySelector('.x-tool-close').click()
}

function extractIdFromField (target) {
    return target.parentElement.id.replace('_fs_lbl', '')
}

function copyToClipboard (text) {
    const textarea = document.createElement('textarea')
    textarea.id = 'copy-' + Math.random()
    textarea.style.position = 'fixed'
    textarea.style.top = 0
    textarea.style.left = 0
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.padding = 0
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.boxShadow = 'none'
    textarea.style.background = 'transparent'

    const body = document.querySelector("body")
    body.appendChild(textarea)

    textarea.value = text
    textarea.select()

    document.execCommand('copy')

    return body.removeChild(textarea)
}

function clickOnParentWrapper (node) {
    if (/_wrapper$/.test(node.id)) {
        const tabId = node.id.split('_')[0]

        return document.getElementById(tabId + 'txt').click();
    }

    return node.parentElement && clickOnParentWrapper(node.parentElement)
}

function messageRouter (event) {
    //console.log('mensagem recebida pelo script injetado...', event)

    if (!window.require) return alert('Require is not defined. Current page is not compatible.')

    const type = event.data.action
    const actions = {
        nstbLoadRecord,
        nstbCopyFieldId,
        nstbSearchId,
        evalFunction,
        nstbExportSearch
    }

    return actions[type](event)
}

function handleClickField (event) {
    event.preventDefault()
    if (event.shiftKey) {
        const target = event.target
        const id = extractIdFromField(target)

        copyToClipboard(id)

        showCopiedIdMessage(target)
    }
}

;(() => {
    document.addEventListener('keydown', e => {
        const { keyCode, shiftKey, ctrlKey } = e
        const handlers = {
            '70': nstbSearchId,
            '76': nstbSearchLabel
        }

       return ctrlKey && shiftKey && handlers.hasOwnProperty(keyCode) && handlers[keyCode](e)
    });

    Array
        .from(document.querySelectorAll("a[href='javascript:void(\"help\")']"))
        .forEach( a => a.addEventListener('click', handleClickField))

    window.addEventListener('message', messageRouter)
})()
