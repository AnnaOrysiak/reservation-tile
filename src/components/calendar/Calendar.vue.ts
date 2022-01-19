import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
import { dateUtils } from '../../utils/DateUtils';
import { Date as Day } from './Date';
import WithRender from './calendar.html';
import './calendar.scss';

@WithRender
@Component
export default class Calendar extends Vue {
    @Prop() unavailableDates: string[];
    @Prop() selectedDates: { from: string, to: string };
    @Prop() reservationError: boolean;

    editMode = false;
    pickedDate: string = '';
    year: number = 2022;
    month: number = 0;
    today = dayjs();
    stopCounting = false;
    monthlyDays: Day[] = [new Day('', this.weekDays[0], 1)];
    displayDuration = 1500;

    get weekDays(): string[] {
        return dateUtils.weekDays;
    }

    get dateFrom(): string {
        return this.selectedDates.from ? this.selectedDates.from : 'Date from';
    }

    get dateTo(): string {
        return this.selectedDates.to ? this.selectedDates.to : 'Date to';
    }

    get editFrom(): boolean {
        return this.editMode && (this.pickedDate === 'from');
    }

    get editTo(): boolean {
        return this.editMode && (this.pickedDate === 'to');
    }

    beforeMount() {
        this.month = this.today.month();
        this.year = this.today.year();
        this.fillMonthlyDays();
    }

    @Watch('month')
    refresh() {
        this.fillMonthlyDays();
    }

    @Watch('selectedDates', { deep: true })
    checkData() {
        if (!this.selectedDates.from || !this.selectedDates.to) {
            return;
        }

        setTimeout(() => {
            if (!this.reservationError) {
                this.editMode = false;
            }
        }, this.displayDuration);

    }

    getMonth(number: number): string {
        if (number < 0) {
            return this.today.month(11).format(dateUtils.dateFormats.m);
        }
        if (number > 11) {
            return this.today.month(0).format(dateUtils.dateFormats.m);
        }
        return this.today.month(number).format(dateUtils.dateFormats.m);
    }

    fillMonthlyDays(): void {
        const month = dayjs().year(this.year).month(this.month);
        const monthDays = month.daysInMonth();
        const firstDayOfMonth = month.date(1).format(dateUtils.dateFormats.d);
        const lastDayOfMonth = month.date(monthDays + 1).format(dateUtils.dateFormats.d);

        this.monthlyDays = [];
        let year = this.year;
        let currMonth = this.month;

        //  fill previous month
        if (dateUtils.weekDays.indexOf(firstDayOfMonth) > 0) {
            currMonth--;
            if (this.month === 0) {
                year = this.year - 1;
                currMonth = 11;
            }

            const prevMonth = dayjs().year(year).month(currMonth);
            const monthDays = prevMonth.daysInMonth();
            for (let i = dateUtils.weekDays.indexOf(firstDayOfMonth); i >= 0; i--) {
                const day = prevMonth.date(monthDays - i);
                const dayLabel = monthDays - i;
                const weekLabel = day.format(dateUtils.dateFormats.d);
                const available = !this.unavailableDates.includes(day.format(dateUtils.dateFormats.ymd));
                this.monthlyDays.push(new Day(day, weekLabel, dayLabel, true, available));
            }
        }

        // fill current month
        for (let i = 1; i <= monthDays; i++) {
            const day = month.date(i);
            const dayLabel = i;
            const weekLabel = day.format(dateUtils.dateFormats.d);
            const available = !this.unavailableDates.includes(day.format(dateUtils.dateFormats.ymd));
            this.monthlyDays.push(new Day(day, weekLabel, dayLabel, false, available));
        }

        // fill next month
        if (dateUtils.weekDays.indexOf(lastDayOfMonth) < (dateUtils.weekDays.length - 1)) {
            year = this.year;
            currMonth = this.month + 1;
            if (this.month === 11) {
                year = this.year + 1;
                currMonth = 0;
            }

            const nextMonth = dayjs().year(year).month(currMonth);
            const missedDays = dateUtils.weekDays.length - dateUtils.weekDays.indexOf(lastDayOfMonth);
            for (let i = 1; i < missedDays; i++) {
                const day = nextMonth.date(i);
                const dayLabel = i;
                const weekLabel = day.format(dateUtils.dateFormats.d);
                const available = !this.unavailableDates.includes(day.format(dateUtils.dateFormats.ymd));
                this.monthlyDays.push(new Day(day, weekLabel, dayLabel, true, available));
            }
        }
    }

    editDate(dateType: string): void {
        this.editMode = true;
        this.pickedDate = dateType;
    }

    removeDate(type: 'from' | 'to'): void {
        this.editMode = false;
        this.$set(this.selectedDates, type, '');
    }

    goToPrevMonth(): void {
        if (this.month === 0) {
            this.month = 11;
            this.year--;
            return;
        }

        this.month--;
    }

    goToNextMonth(): void {
        if (this.month === 11) {
            this.month = 0;
            this.year++;
            return;
        }

        this.month++;
    }

    getClasses(date: any): string[] {
        const classes = [];
        const formattedDate = date.value.format(dateUtils.dateFormats.ymd);
        if (this.today.format(dateUtils.dateFormats.ymd) === formattedDate) {
            classes.push('today');
        }

        if (date.disabled) {
            classes.push('disabled');
        }

        if (!date.available) {      // for unavailabled dates
            classes.push('unavailabled');
        }

        if (this.selectedDates.from === formattedDate) {
            classes.push('start');
        }

        if (this.selectedDates.to === formattedDate) {
            classes.push('end');
        }

        if (this.isReservationScope(formattedDate)) {
            classes.push('scoped');
        }

        return classes
    }

    isReservationScope(date: string): boolean {
        if (this.selectedDates.from && this.selectedDates.to) {
            const milliDate = dayjs(date).format(dateUtils.dateFormats.ms);
            const milliFrom = dayjs(this.selectedDates.from).format(dateUtils.dateFormats.ms);
            const milliTo = dayjs(this.selectedDates.to).format(dateUtils.dateFormats.ms);
            return milliDate >= milliFrom && (milliDate <= milliTo);
        }

        return false;
    }

    handleSelect(event: Event, dateValue: dayjs.Dayjs): void {
        if (this.pickedDate === 'to') {
            if (this.selectedDates.from && (dateValue.format(dateUtils.dateFormats.ms) < dayjs(this.selectedDates.from).format(dateUtils.dateFormats.ms))) {
                dateValue.format(dateUtils.dateFormats.ms) < dayjs(this.selectedDates.from).format(dateUtils.dateFormats.ms);
                this.$emit('showError', '"Date to" must be after the "Date from"');
                return;
            }

            this.$set(this.selectedDates, 'to', dateValue.format(dateUtils.dateFormats.ymd));
        }

        if (this.pickedDate === 'from') {
            if (this.selectedDates.to && (dateValue.format(dateUtils.dateFormats.ms) > dayjs(this.selectedDates.to).format(dateUtils.dateFormats.ms))) {
                this.selectedDates.to = '';
            }

            this.$set(this.selectedDates, 'from', dateValue.format(dateUtils.dateFormats.ymd));
            this.pickedDate = 'to';
        }

        this.$nextTick(this.isReservationUnavailable);
    }

    isReservationUnavailable(): boolean {
        const elements = this.$el.querySelectorAll('.scoped.unavailabled');
        if (elements.length) {
            this.$emit('showError', 'The selected time range includes unavailable dates');
            return true;
        }

        this.$emit('clearErrors');
        return false;
    }

}

