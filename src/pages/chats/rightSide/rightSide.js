import Handlebars from "handlebars"
import template from './rightSide.tmpl'

import getHeader from '../../../components/chatHeader'
import getMiddle from '../../../components/chatMiddle'
import getBottom from '../../../components/chatBottom'

import './rightSide.sass'

const rightSide = () => {
  const internalData = {
    currentName: "Алексей",
    messages: [
      {
        className: "left", //temporary solution
        text: "Тестовое сообщение Тестовое сообщение Тестовое сообщение Тестовое сообщение Тестовое сообщение",
        time: "13:00",
      },
      {
        className: "right", //temporary solution
        text: "Тестовое сообщение 2",
        time: "14:00",
      },
    ]
  }
  const data = {
    header: getHeader(internalData.currentName),
    middle: getMiddle(internalData.messages),
    bottom: getBottom(),
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default rightSide