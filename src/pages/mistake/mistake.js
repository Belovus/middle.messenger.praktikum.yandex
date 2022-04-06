import Handlebars from 'handlebars'
import template from './mistake.tmpl'

import './mistake.sass'

const Mistake = () => {
  const data = {
    errorCode: window.location.pathname.substr(1),
    message: "Мы уже фиксим",
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default Mistake