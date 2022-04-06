import Handlebars from "handlebars"
import template from './registration.tmpl'

import '../authorization/authAndRegistration.sass'

const Registration = () => {
  const compiled = Handlebars.compile(template)
  return compiled()
}

export default Registration