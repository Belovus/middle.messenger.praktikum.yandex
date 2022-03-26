import Handlebars from "handlebars"
import template from './chatHeader.tmpl'

import './chatHeader.sass'

const chatHeader = (currentName) => {
  const data = {
    ava: '',
    name: currentName,
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default chatHeader