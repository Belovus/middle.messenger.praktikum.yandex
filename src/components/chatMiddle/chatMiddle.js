import Handlebars from "handlebars"
import template from './chatMiddle.tmpl'

import './chatMiddle.sass'

const chatMiddle = (data) => {
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default chatMiddle