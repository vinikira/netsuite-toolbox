;(function () {
    function nstsLoadRecord (event) {
        require(['N/currentRecord'], (currentRecord) => {
            window.recordLoaded = currentRecord.get()
            console.log('Current record is stored in "recordLoaded" variable')
        })
    }

    function nstsCopyFieldId (event) {
        const { info } = event.data

        return prompt(`ID ${info.linkText}`, getFieldIdByLink(event))
    }

    function highlightField (field) {
        clickOnParentWrapper(field)

        field.scrollIntoView(false)

        field.style.background = '#BDE5F8'
        field.style.border = '1px solid #00529B'
        field.style.padding = '10px'

        setTimeout(() => {
            field.style.background = ''
            field.style.border = ''
            field.style.padding = ''
        }, 3000)
    }

    function nstsSearchId () {
        const idToSearch = prompt('Input field ID to search')
        const field = document.getElementById(`${idToSearch}_fs_lbl`)

        field && highlightField(field)
    }

    function nstsSearchLabel () {
        const labelToSearch = prompt('Input field label to search').toUpperCase()
        const field = Array
              .from(document.querySelectorAll('span.smallgraytextnolink>a.smallgraytextnolink'))
              .reduce((node, actNode) =>
                      actNode.text.toUpperCase() === labelToSearch && !node ? actNode : node, '')

        if (!field) alert('Label not found.')

        highlightField(field.parentNode)
    }

    function nstsExportSearch () {
        require(['N/search', 'N/currentRecord', 'N/ui/dialog'], (search, cr, dialog) => {
            try {
                const currentRecord  = cr.get()

                if (!currentRecord.id) dialog.alert({
                    title: 'NetSuite ToolSuite',
                    message:'Search is not saved. Please save search to export.'
                })

                const currentSearch = search.load({
                    type: currentRecord.getValue('searchtype'),
                    id: currentRecord.id
                })

                dialog.alert({
                    title: 'Search exported',
                    message: '<textarea style="font-family: monospace; font-size=12px;" \
                          autofocus \
                          readonly \
                          rows="18" \
                          cols="40" \
                          autocomplete="off" \
                          autocorrect="off" \
                          autocapitalize="off" \
                          spellcheck="false">' +
                        JSON.stringify(currentSearch, null, 2) +
                        '</textarea>\
                        <br/><br/>\
                        <a href="data:application/json;charset=utf-8,' +
                        encodeURIComponent(JSON.stringify(currentSearch)) +
                        '" target="_blank"> Open in new tab </a>'
                })
            } catch (e) {
                dialog.alert({
                    title: 'Error',
                    message: e.message
                })
            }
        })
    }

    function nstsExportRecord () {
        require(['N/currentRecord', 'N/https', 'N/ui/dialog'], (cr, https, dialog) => {
            try {
                const cRec = cr.get();

                if (!cRec.type || !cRec.id) {
                    throw new Error('ID or Type not found. Are you on record page?')
                }

                https
                    .get
                    .promise({
                        url: window.location + '&xml=t'
                    })
                    .then((response) => {
                        const recordJSON = xmlToJson(response.body)
                        window.open('data:application/json;charset=utf-8,' +
                                    encodeURIComponent(JSON.stringify(recordJSON)))
                    })
                    .catch((error) => {
                        throw new Error(error)
                    })

            } catch (e) {
                dialog.alert({
                    title: 'Error',
                    message: e.message
                })
            }
        })
    }

    function nstsLoadSS2Modules (modules) {
        return prompt('What modules? (separated by commas)')
            .split(',')
            .map((module) => {
                const mod = module.trim()
                require([mod], (modLoaded) => {
                    const modNFree = mod.replace('N/', '')
                    window[modNFree] = modLoaded
                    console.log(`Module ${mod} has been loaded and stored in window.${modNFree}.`)
                })
            })
    }

    /**
     * XML to JSON function
     * https://gist.github.com/demircancelebi/f0a9c7e1f48be4ea91ca7ad81134459d
     */
    function xmlToJson (xml) {
        if (typeof xml === 'string') {
            xml = new DOMParser().parseFromString(xml, 'text/xml')
        }

        let obj = {};

        if (xml.nodeType === 1) {
            if (xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let j = 0; j < xml.attributes.length; j += 1) {
                    const attribute = xml.attributes.item(j);
                    obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
            obj = xml.childNodes[0].nodeValue;
        } else if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i += 1) {
                const item = xml.childNodes.item(i);
                const nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === 'undefined') {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === 'undefined') {
                        const old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj
    }

    function changeFieldVisibilty (visible, event) {
        return nlapiDisableField(getFieldIdByLink(event), visible)
    }

    function getFieldIdByLink (event) {
        const { info } = event.data
        const field = Array
              .from(document
                    .querySelectorAll("a[href='javascript:void(\"help\")']"))
              .filter(e => e.text === info.linkText)[0]
        return extractIdFromField(field)
    }

    function evalFunction (event) {
        try {
            const fn = event.data.fn
            const response = fn()
        } catch (e) {
            console.log(e)
        }
    }

    function showCopiedIdMessage (target) {
        const message = document.createElement('p')

        message.style.padding = '10px'
        message.style.color = '#4F8A10'
        message.style.backgroundColor = '#DFF2BF'
        message.style.fontWeight = 'bold'
        message.style.textTransform = 'capitalize'

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
        const type = event.data.action
        const actions = {
            nstsLoadRecord,
            nstsCopyFieldId,
            nstsSearchId,
            evalFunction,
            nstsExportSearch,
            nstsDisableField: changeFieldVisibilty.bind(null, true),
            nstsEnableField: changeFieldVisibilty.bind(null, false),
            nstsExportRecord,
            nstsLoadSS2Modules
        }

        if (type && !window.require) return alert('Current page is not compatible with the NetSuite-ToolSuite extension.')

        return actions.hasOwnProperty(type) && actions[type](event)
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


    document.addEventListener('keydown', e => {
        const { keyCode, shiftKey, ctrlKey } = e
        const handlers = {
            '70': nstsSearchId,
            '76': nstsSearchLabel
        }

        return ctrlKey && shiftKey && handlers.hasOwnProperty(keyCode) && handlers[keyCode](e)
    })

    Array
        .from(document.querySelectorAll("a[href='javascript:void(\"help\")']"))
        .forEach( a => a.addEventListener('click', handleClickField))

    window.addEventListener('message', messageRouter)
})()
