export default (
  `<div class="registrationForm">
      <h1>Регистрация</h1>
      <form>
        <div class="form-row">
            <input type="email" id="email" required autocomplete="off">
            <label for="email">Почта</label>      
        </div>
        <div class="form-row">
            <input type="text" id="login" required autocomplete="off">
            <label for="login">Логин</label>
        </div>
        <div class="form-row">
            <input type="text" id="first" required autocomplete="off">
            <label for="first">Имя</label>       
        </div>
        <div class="form-row">
            <input type="text" id="second" required autocomplete="off">
            <label for="second">Фамилия</label>
        </div>
        <div class="form-row">
            <input type="tel" id="phone" required autocomplete="off">
            <label for="phone">Телефон</label>       
        </div>
        <div class="form-row">
            <input type="password" id="pass1" required autocomplete="off">
            <label for="pass1">Пароль</label>
        </div>
        <div class="form-row">
            <input type="password" id="pass2" required autocomplete="off">
            <label for="pass2">Пароль (ещё раз)</label>       
        </div>
        <button>Зарегистрироваться</button>
       </form>
       <button>Войти</button>
   </div>`
)