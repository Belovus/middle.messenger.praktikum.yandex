import Handlebars from 'handlebars'
import template from './authorization.tmpl'

import './authAndRegistration.sass'

const Authorization = () => {
  const compiled = Handlebars.compile(template)
  return compiled()
}

export default Authorization