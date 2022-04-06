import Handlebars from "handlebars"
import template from './chatsHeader.tmpl'

import './chatsHeader.sass'

const chatsHeader = () => {
  const compiled = Handlebars.compile(template)
  return compiled()
}

export default chatsHeader