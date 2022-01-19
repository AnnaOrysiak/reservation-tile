declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module '*.html' {
    interface WithRender {
        <V extends Vue>(options: Vue.ComponentOptions<V>): Vue.ComponentOptions<V>;
        <V extends typeof Vue>(component: V): V;
    }
    const withRender: WithRender;
    export default withRender;
}

declare module '*.scss' {
    const content: any;
    export default content;
}