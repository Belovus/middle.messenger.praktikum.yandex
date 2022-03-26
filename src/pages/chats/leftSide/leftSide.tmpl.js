export default (
  `<div class="leftSide">
      {{{chatsHeader}}}
      <ul class="leftSide__bottom">
        {{#each chats}}
            <li class="leftSide__bottom__Chat">
                <div class="leftSide__bottom__Chat__ava">{{{this.ava}}}</div>
                <div class="leftSide__bottom__Chat__middle">
                    <div class="leftSide__bottom__Chat__middle__name">{{this.name}}</div>
                    <div class="leftSide__bottom__Chat__middle__lastMessage">{{this.message}}</div>
                </div>
                <div class="leftSide__bottom__Chat__last">
                    <div class="leftSide__bottom__Chat__last__time">{{this.time}}</div>
                </div>
            </li>
        {{/each}}
      </ul>
   </div>`
)

//<!--        <div class="Chat__last__circle">{{number}}</div>-->