import Vue from "vue";
import CalendarTile from "./components/calendarTile/CalendarTile.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <calendar-tile :price="298" :rating="4.7" :ratingsCount="123" :unavailableDates="unavailableDates" :selectedDates="selectedDates" />
    </div>
    `,
    data: {
        unavailableDates: [
            "2022-01-06",
            "2022-01-07",
            "2022-01-08",
            "2022-01-09",
        ],

        selectedDates: {
            from: '',
            to: ''
        },
    },
    components: {
        CalendarTile
    }
});
