import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { createVNode, createDOMNode, $mount } from './src/vdom.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

const createVApp = state => {
  const { count } = state
  return createVNode('div', { class: 'container', 'data-count': count }, [
    createVNode('h1', {}, ['CUSTOM, Virtual DOM']),
    createVNode('div', {}, [`Count: ${count}`]),
    'Text node without tags',
    createVNode('img', { src: 'https://tabler-icons.io/img/packages/logo-svelte.svg', width: 100 })
  ])
}

// const vNode = createVNode('div', { class: 'container' }, [
//   createVNode('h1', {}, ['CUSTOM Virtual DOM']),
//   'Text node without tags',
//   createVNode('img', { src: 'https://tabler-icons.io/img/packages/logo-svelte.svg', width: 100 })
// ])

// const node = createDOMNode(vNode)

// console.log(node)
const state = { count: 0 }
// const app = document.getElementById('app')
// $mount(createDOMNode(createVApp(state)), app)
let vApp = createVApp(state)
let rootNode = $mount(createDOMNode(vApp), document.getElementById('app'))

setInterval(() => {
  state.count++

  const nextVApp = createVApp(state)

  rootNode = patchNode(rootNode, vApp, nextVApp)

  vApp = nextVApp
}, 1000)

// setupCounter(document.querySelector('#counter'))
