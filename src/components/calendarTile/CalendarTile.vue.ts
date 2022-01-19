import { Vue, Component, Prop } from "vue-property-decorator";
import Calendar from '../calendar/Calendar.vue';
import FormButton from '../formButton/FormButton.vue';
import StarsRating from '../starsRating/StarsRating.vue';
import WithRender from './calendarTile.html';
import './calendarTile.scss';

@WithRender
@Component({
    components: {
        FormButton,
        StarsRating,
        Calendar,
    }
})
export default class CalendarTile extends Vue {
    @Prop() price: number;
    @Prop() rating: number;
    @Prop() ratingsCount: number;
    @Prop() unavailableDates: string[];
    @Prop() selectedDates: { from: string, to: string };

    showError = false;
    errorMessage = '';
    errorDisplayDuration = 5000;

    get currency(): string {
        // in real conditions, most propably an Enum received from store
        return 'zł';
    }

    get priceWithCurrency(): string {
        return `${this.price} ${this.currency}`;
    }

    get reservationError(): boolean {
        return this.errorMessage.length > 0;
    }

    handleReservation(): void {
        this.validateReservationForm();

        if (this.reservationError) {
            return;
        }

        // request to the server using the REST API
        // the response should update the data (eg unavailableDates or selectedDates)

        alert('Booking Successful')

        // clear form or redirect - depends on specification
    }

    handleError(message: string): void {
        this.showError = true;
        this.errorMessage = message;

        setTimeout(() => {
            this.showError = false;
        }, this.errorDisplayDuration);
    }

    closeError(): void {
        this.showError = false;
    }

    clearErrors(): void {
        this.errorMessage = '';
    }

    validateReservationForm(): void {
        if (!this.selectedDates.from || !this.selectedDates.to) {
            this.handleError('Please complete the empty fields');
        }
    }

}

