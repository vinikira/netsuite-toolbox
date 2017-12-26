// browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         browser.tabs.sendMessage(
//             tabs[0].id,
//             {
//                 scriptURL: browser.extension.getURL(
//                     '../content-scripts/page-javascript-context.js'
//                 )
//             })
// })

// function executeFunction (e) {
//     console.log('popup procurando tabs...')
//     browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         console.log('tabs encontrada...', tabs)
//         browser.tabs.sendMessage(
//             tabs[0].id,
//             {
//                 action: 'evalFunction',
//                 fn: () => {
//                     console.log('executei a fn...')
//                 }
//             })
//         console.log('mensagem enviada...')
//     })
// }

// document.getElementById('exF').addEventListener('click', executeFunction)
