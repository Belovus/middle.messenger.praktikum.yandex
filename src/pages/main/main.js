import Handlebars from 'handlebars'
import template from './main.tmpl'

import './main.sass'

const Main = () => {
  const compiled = Handlebars.compile(template)
  return compiled()
}

export default Main