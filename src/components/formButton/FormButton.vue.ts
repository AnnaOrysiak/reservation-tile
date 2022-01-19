import { Vue, Component, Prop } from "vue-property-decorator";
import WithRender from './formButton.html';
import './formButton.scss';

@WithRender
@Component
export default class FormButton extends Vue {
    @Prop({ default: 'Reserve' }) text: string;
    @Prop({ default: () => { } }) callback: Function;
}

