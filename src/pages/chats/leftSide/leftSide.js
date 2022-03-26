import Handlebars from "handlebars"
import template from './leftSide.tmpl'

import getChatsHeader from "../../../components/chatsHeader"

import './leftSide.sass'

const leftSide = () => {
  const data = {
    chatsHeader: getChatsHeader(),
    chats: [
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
      {
        ava: '',
        name: 'Алексей',
        message: 'Привет',
        time: '10:49'
      },
      {
        ava: '',
        name: 'Ваня',
        message: 'Пока',
        time: '14:00'
      },
    ]
  }
  const compiled = Handlebars.compile(template)
  return compiled(data)
}

export default leftSide