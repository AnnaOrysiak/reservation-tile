import { Vue, Component, Prop } from "vue-property-decorator";
import WithRender from './calendarTile.html';
import './calendarTile.scss';

@WithRender
@Component
export default class CalendarTile extends Vue {
    @Prop() price: number;
    @Prop() rating: number;
    @Prop() ratingsCount: number;
    @Prop() unavailableDates: string[];
    @Prop() selectedDates: { from: string, to: string };

    get currency(): string {
        // in real conditions, most propably an Enum received from store
        return 'zł';
    }

    get priceWithCurrency(): string {
        return `${this.price} ${this.currency}`;
    }

}

