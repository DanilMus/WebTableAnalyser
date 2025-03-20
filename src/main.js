import { createApp } from 'vue'
import App from './App.vue'
import '../public/index.css' // импорт глобальных стилей
import Toast from "vue-toastification"; // всплывающие подсказки
import "vue-toastification/dist/index.css"; // всплывающие подсказки

const app = createApp(App);
app.use(Toast);
app.mount("#app");
