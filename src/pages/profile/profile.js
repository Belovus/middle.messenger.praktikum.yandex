import Handlebars from "handlebars"
import template from './profile.tmpl'

import defaultAva from '../../../static/defaultAva.svg'

import './profile.sass'

const Profile = () => {
  const data = {
    firstName: 'Алексей',
    secondName: 'Белов',
    defaultAva
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default Profile