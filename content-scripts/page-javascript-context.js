;(function () {
    function nstbLoadRecord (event) {
        require(['N/currentRecord'], (currentRecord) => {
            window.recordLoaded = currentRecord.get()
            console.log('Current record is stored in "recordLoaded" variable!')
        })
    }

    function nstbCopyFieldId (event) {
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

        highlightField(field.parentNode)
    }

    function nstbExportSearch () {
        try {
            if(!window.location.href.includes("searchresults.nl") && !window.location.href.includes("search.nl")) {
                throw new Error("ID not found. Are you on a search page?")
            }
            const params = new URLSearchParams(window.location.search)
            const id = params.get("id") || params.get("searchid")
            if(!id) {
                throw new Error("Search is not saved. Please save search to export.")
            }

            const currentSearch = nlapiLoadSearch(null, id)
            currentSearch.filters = currentSearch.filters.map(filter => {
                return Object.fromEntries(Object.entries(filter).filter(([key, value]) =>
                    !(value === null || (["isor", "isnot", "leftparens", "rightparens"].includes(key) && !value))
                ))
            })
            
            currentSearch.columns = currentSearch.columns.map(column => {
                return Object.fromEntries(Object.entries(column).filter(([key, value]) =>
                    !(value === null || (["index", "userindex"].includes(key) && value < 0))
                ))
            })

            window.open('data:application/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(currentSearch)))
        } catch (e) {
            alert(e.message)
        }
    }
    
    function nstbExportRecordXML () {
        require(['N/currentRecord', 'N/https', 'N/ui/dialog'], (cr, https, dialog) => {
            try {
                const cRec = cr.get();

                if (!cRec.type || !cRec.id) {
                    throw new Error('ID or Type not found. Are you on record page?')
                }

                window.open(window.location + '&xml=t')
            } catch (e) {
                dialog.alert({
                    title: 'Error',
                    message: e.message
                })
            }
        })
    }

    function nstbExportRecordJSON () {
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

    function nstbLoadSS2Modules() {
        return prompt('What modules? (separated by commas)')
            .split(',')
            .map((module) => {
                const mod = module.trim()
                require([mod], (modLoaded) => {
                    const key = mod.split("/").slice(-1)[0]
                    window[key] = modLoaded
                    console.log(`Module ${mod} has been loaded and stored in window.${key}.`)
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
            nstbLoadRecord,
            nstbCopyFieldId,
            nstbSearchId,
            nstbSearchLabel,
            evalFunction,
            nstbExportSearch,
            nstbDisableField: changeFieldVisibilty.bind(null, true),
            nstbEnableField: changeFieldVisibilty.bind(null, false),
            nstbExportRecordXML,
            nstbExportRecordJSON,
            nstbLoadSS2Modules
        }

        if (type && !window.require && type !== "nstbExportSearch") return alert('Require is not defined. Current page is not compatible.')

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
            '70': nstbSearchId,
            '76': nstbSearchLabel
        }

        return ctrlKey && shiftKey && handlers.hasOwnProperty(keyCode) && handlers[keyCode](e)
    })

    Array
        .from(document.querySelectorAll("a[href='javascript:void(\"help\")']"))
        .forEach( a => a.addEventListener('click', handleClickField))

    window.addEventListener('message', messageRouter)
})()
