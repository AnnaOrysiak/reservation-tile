import dayjs from 'dayjs';
import { dateUtils } from '../../utils/DateUtils';

export class Date {

    value: any = null;
    weekLabel: string = '';
    label: number = 0;
    disabled = false;
    available = false;

    constructor(value: any, weekLabel: string, label: number, disabled = false, available = false) {
        this.value = value;
        this.weekLabel = weekLabel;
        this.label = label;
        this.disabled = disabled;
        this.available = available;
    }

    getTimestamp(): number {
        return parseInt(dayjs(this.value).format(dateUtils.dateFormats.ms));
    }

}
