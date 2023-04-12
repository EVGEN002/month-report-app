/**
 * Создаем виртуальный узел
 * @param {string} tagName - Имя узла
 * @param {Object} attrs - Атрибуты узла
 * @param {Array} children - Потомки текущего узла
 * @returns {Object}
 */
export const createVNode = (tagName, attrs = {}, children = []) => {
  return {
    tagName,
    attrs,
    children
  }
}

/**
 * Создаем DOM узел, потомки узла создаются с помощью рекурсии
 * @param {Object} vNode - Виртуальный узел
 */
export const createDOMNode = vNode => {
  if (typeof vNode === 'string') return document.createTextNode(vNode)

  const { tagName, attrs, children } = vNode
  const node = document.createElement(tagName)

  patchAttrs(node, {}, attrs)
  // здесь следует воспользоваться стеком
  children.forEach(child => node.appendChild(createDOMNode(child)))

  return node
}

/**
 * Сравниваем текущий виртаульный узел и новый
 * и производим манипуляции исходя из сравнений
 * @param {*} node - узел
 * @param {*} vNode - текущий виртуальный узел
 * @param {*} nextVNode - новый виртуальный узел
 * @returns
 */
export const patchNode = (node, vNode, nextVNode) => {
  // если значение нового узла не задано - удаляем узел
  if (nextVNode === undefined) {
    node.remove()
    return
  }

  // если значение нового или текущего узла равно строке
  // заменяем узел на новую
  if (typeof vNode === 'string' || typeof nextVNode === 'string') {
    if (vNode !== nextVNode) {
      const nextNode = createDOMNode(nextVNode)
      node.replaceWith(nextNode)
      return nextNode
    }

    return node
  }

  // если тег текущего узла не равен тегу нового
  // заменяем узел на новую
  if (vNode.tagName !== nextVNode.tagName) {
    const nextVNode = createDOMNode(nextVNode)
    node.replaceWith(nextVNode)
    return nextVNode
  }

  patchAttrs(node, vNode.attrs, nextVNode.attrs)

  patchChildren(node, vNode.children, nextVNode.children)

  return node
}


/**
 * Обновляем атрибуты узла
 * @param {Object} node - узел
 * @param {string} key - свойство атрибута
 * @param {string} value - значение атрибута 
 * @param {string} nextValue новое значение атрибута
 */
const patchAttr = (node, key, value, nextValue) => {
  if (key.startsWith('on')) {
    const eventName = key.slice(2)

    node[eventName] = nextValue

    if (!nextValue) {
      node.removeEventListener(eventName, listener)
    } else if (!value) {
      node.addEventListener(eventName, listener)
    }
    return
  }

  // если новое значение атрибута равен null или false удаляем атрибут
  if (nextValue === null || nextValue === false) {
    node.removeAttribute(key, nextValue)
    return
  }

  node.setAttribute(key, nextValue)
}

/**
 * Обновление атрибутов узла
 * @param {Object} node - узел
 * @param {Array} attrs - массив атрибутов
 * @param {Array} nextAttrs - массив новых атрибутов
 */
const patchAttrs = (node, attrs, nextAttrs) => {
  const mergedAttrs = { ...attrs, ...nextAttrs }

  Object.keys(mergedAttrs).forEach(key => {
    if (attrs[key] !== nextAttrs[key]) {
      patchAttr(node, key, attrs[key], nextAttrs[key])
    }
  })
}

const patchChildren = (parent, vChildren, nextVChildren) => {
  parent.childNodes.forEach((childNode, i) => {
    patchNode(childNode, vChildren[i], nextVChildren[i])
  })

  nextVChildren.slice(vChildren.length).forEach(vChild => {
    parent.appendChild(createDOMNode(vChild))
  })
}

export const patch = (nextVNode, node) => {
  const vNode = node.v || recycleNode(node)

  node = patchNode(node, vNode, nextVNode)

  node.v = nextVNode

  return node
}

const TEXT_NODE_TYPE = 3

const recycleNode = node => {
  if (node.nodeType === TEXT_NODE_TYPE) return node.nodeValue

  const tagName = node.nodeName.toLowerCase()

  const children = [].map.call(node.childNodes, recycleNode)

  return createVNode(tagName, {}, children)
}

function listener(event) {
  return this[event.type](event)
}

export const $mount = (node, target) => {
  target.innerHTML = ''
  target.appendChild(node)
  return node
}
