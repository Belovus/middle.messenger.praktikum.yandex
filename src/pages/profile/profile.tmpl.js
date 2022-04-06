export default (
  `<div class="Profile">
      <div class="Profile__top">
        <div class="Profile__top__ava">
            <img src={{defaultAva}}/>
        </div>
        <div class="Profile__top__rightInfo">
            <div class="Profile__top__rightInfo__top">{{firstName}} {{secondName}}</div>
            <span class="Profile__top__rightInfo__bottom">
                Укажите основную информацию, чтобы пользоваться<br> мессенджером было удобнее
            </span>
        </div>
      </div>
      <div class="Profile__middle">
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Имя</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Фамилия</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Имя в чате</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Логин</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Почта</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
        <div class="Profile__middle__element">
          <span class="Profile__middle__element__text">Телефон</span>
          <input type="text" class="Profile__middle__element__field"/>
        </div>
      </div>
      <div class="Profile__bottom">
        <div class="Profile__bottom__save">Сохранить</div>
        <div class="Profile__bottom__changePass">Сменить пароль</div>
      </div>
   </div>`
)