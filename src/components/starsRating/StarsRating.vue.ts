import { Vue, Component, Prop } from "vue-property-decorator";
import WithRender from './starsRating.html';
import './starsRating.scss';

@WithRender
@Component
export default class StarsRating extends Vue {
    @Prop({ default: 0 }) rating: number;
    @Prop({ default: 0 }) ratingsCount: number;

    // rating for a five-point scale
    // if we would like to use different scales on different components, we can change this variable to prop
    readonly ratingScale = 5;

    getRatingClass(rate: number): string[] {
        if (rate < (this.rating - 1)) {
            return ['star--full'];
        }

        if (rate < this.rating) {
            return ['star--half'];
        }

        return [];
    }

    // not a word about what should happen with user selection 
    // or whether stars should be reactive
    // so I leave it as it is
}

