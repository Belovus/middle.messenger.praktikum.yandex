import Mistake from "./pages/mistake"
import Authorization from "./pages/authorization"
import Registration from "./pages/registration"
import Chats from "./pages/chats"
import Profile from "./pages/profile"
import Main from "./pages/main"

import './global.sass'

const routes = {
  "/404": Mistake,
  "/500": Mistake,
  "/login": Authorization,
  "/registration": Registration,
  "/chats": Chats,
  "/profile": Profile,
  "/": Main
}

const app = document.getElementById("app")
app.innerHTML = routes[window.location.pathname]()