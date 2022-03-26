import Handlebars from "handlebars"
import template from './chats.tmpl'

import getLeftSide from "./leftSide"
import rightSide from "./rightSide"

import './chats.sass'

const Chats = () => {
  const data = {
    leftSide: getLeftSide(),
    rightSide: rightSide()
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default Chats