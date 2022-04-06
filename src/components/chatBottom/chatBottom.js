import Handlebars from "handlebars"
import template from './chatBottom.tmpl'
import button from '../../../static/chatButton.svg'
import clip from '../../../static/clip.svg'

import './chatBottom.sass'

const chatBottom = () => {
  const data = {
    button,
    clip
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default chatBottom