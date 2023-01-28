import Stepper from "./components/Stepper.vue";

const plugin = {
    install(Vue) {
        Vue.component("vue3-stepper", Stepper);
    }
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;