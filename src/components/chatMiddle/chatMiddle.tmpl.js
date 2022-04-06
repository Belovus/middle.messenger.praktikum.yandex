export default (
  `<div class="chatMiddle">
       {{#each this}}
           <div class="chatMiddle__{{this.className}}">
               {{this.text}}
               <div class="chatMiddle__{{this.className}}__time">{{this.time}}</div>
           </div>
       {{/each}}
   </div>`
)