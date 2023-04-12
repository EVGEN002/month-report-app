import './style.css'
import { createVNode, createDOMNode, patch } from './src/vdom.js'

const createVButton = props => {
  const { text, onclick } = props

  return createVNode('button', { onclick }, [text])
}

const createVApp = store => {
  const { count } = store.state
  return createVNode('div', { class: 'container', 'data-count': count }, [
    createVNode('h1', {}, ['CUSTOM VDOM APP']),
    createVNode('div', {}, [`Count: ${count}`]),
    'Text node without tags',
    createVNode('img', { src: 'https://tabler-icons.io/img/packages/logo-svelte.svg', width: 400 }),
    createVNode('div', {}, [
      createVButton({
        text: '-1',
        onclick: () => store.setState({ count: store.state.count - 1 })
      }),
      ' ',
      createVButton({
        text: '+1',
        onclick: () => store.setState({ count: store.state.count + 1 })
      })
    ])
  ])
}

const store = {
  state: { count: 0 },
  onStateChanged: () => {},
  setState(nextState) {
    this.state = nextState
    this.onStateChanged()
  }
}

let app = patch(createVApp(store), document.getElementById('app'))

store.onStateChanged = () => {
  app = patch(createVApp(store), app)
}

setInterval(() => {
  store.setState({ count: store.state.count + 1 })
}, 1000)
