import { createApp } from "vue";
import * as NaiveUI from "naive-ui";
import App from "./App.vue";
import router, { setupRouter } from "./router";
import "./style.css";

function setupNaiveDiscreteApi() {
  const { message, loadingBar } = NaiveUI.createDiscreteApi([
    "message",
    "loadingBar",
  ]);
  window["$message"] = message;
  window["$loading"] = loadingBar;
}
async function setup() {
  const app = createApp(App);

  // 挂载 naive-ui 脱离上下文的 Api
  setupNaiveDiscreteApi();
  // 挂载路由
  setupRouter(app);
  await router.isReady();
  app.mount("#app");
}

setup();
