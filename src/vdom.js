export const createVNode = (tagName, attrs = {}, children = []) => {
  return {
    tagName,
    attrs,
    children
  }
}

export const createDOMNode = vNode => {
  if (typeof vNode === 'string') return document.createTextNode(vNode)

  const { tagName, attrs, children } = vNode
  const node = document.createElement(tagName)

  patchAttrs(node, {}, attrs)

  children.forEach(child => node.appendChild(createDOMNode(child)))

  return node
}

export const patchNode = (node, vNode, nextVNode) => {
  if (nextVNode === undefined) {
    node.remove()
    return
  }

  if (typeof vNode === 'string' || typeof nextVNode === 'string') {
    if (vNode !== nextVNode) {
      const nextVNode = createDOMNode(nextVNode)
      // check how does 'replaceWith' work in this project
      node.replaceWith(nextVNode)
      return nextVNode
    }

    return node
  }

  if (vNode.tagName !== nextVNode.tagName) {
    const nextVNode = createDOMNode(nextVNode)
    node.replaceWith(nextVNode)
    return nextVNode
  }

  patchAttrs(node, vNode.attrs, nextVNode.attrs)

  patchChildren(node, vNode.children, nextVNode.children)

  return node
}

const patchAttr = (node, key, value, nextValue) => {
  if (nextValue === null || nextValue === false) {
    node.removeAttribute(key, nextValue)
    return
  }

  node.setAttribute(key, nextValue)
}

const patchAttrs = (node, attrs, nextAttrs) => {
  const mergedAttrs = { ...attrs, ...nextAttrs }

  Object.keys(mergedAttrs).forEach(key => {
    if (attrs[key] !== nextAttrs[key]) {
      patchAttr(node, key, attrs[key], nextAttrs[key])
    }
  })
}

const patchChildren = () => {
  
}

export const $mount = (node, target) => {
  target.innerHTML = ''
  target.appendChild(node)
  return node
}
