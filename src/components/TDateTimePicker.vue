<template>
  <v-dialog v-model="display" :width="dialogWidth" persistent>
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :label="label"
        :value="formattedDatetime"
        v-on="on"
        readonly
      >
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <v-icon>mdi-calendar</v-icon>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <v-icon>mdi-clock-outline</v-icon>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              :min="minDate"
              :max="maxDate"
              @input="showTimePicker"
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              class="v-time-picker-custom"
              v-model="time"
              v-bind="timePickerProps"
              format="24hr"
              :min="minTime"
              :max="maxTime"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey lighten-1" text @click.native="clearHandler">
          {{ clearText }}
        </v-btn>
        <v-btn color="green darken-1" text @click="okHandler">
          {{ okText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parse, isSameDay } from "date-fns";

const DEFAULT_DATE = "";
const DEFAULT_TIME = "00:00:00";
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";
const DEFAULT_DIALOG_WIDTH = 340;

export default {
  name: "v-datetime-picker",
  model: {
    prop: "datetime",
    event: "input"
  },
  props: {
    datetime: {
      type: [Date, String],
      default: null
    },
    label: {
      type: String,
      default: ""
    },
    min: {
      type: Date,
      default: null
    },
    max: {
      type: Date,
      default: null
    },
    dialogWidth: {
      type: Number,
      default: DEFAULT_DIALOG_WIDTH
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT
    },
    timeFormat: {
      type: String,
      default: "HH:mm"
    },
    textFieldProps: {
      type: Object
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME,
      clearText: this.$t("clear"),
      okText: this.$t("confirm")
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + " " + this.timeFormat;
    },
    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + " " + DEFAULT_TIME_FORMAT;
    },
    formattedDatetime() {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateTimeFormat)
        : "";
    },
    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = this.date + " " + this.time;
        if (this.time.length === 5) {
          datetimeString += ":00";
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date());
      } else {
        return null;
      }
    },
    minDate() {
      return this.min ? format(this.min, DEFAULT_DATE_FORMAT) : null;
    },
    minTime() {
      const { selectedDatetime, min } = this;
      if (
        selectedDatetime === null ||
        min === null ||
        !isSameDay(selectedDatetime, min)
      ) {
        return null;
      }
      return format(min, DEFAULT_TIME_FORMAT);
    },
    maxDate() {
      return this.max ? format(this.max, DEFAULT_DATE_FORMAT) : null;
    },
    maxTime() {
      const { selectedDatetime, max } = this;
      if (
        selectedDatetime === null ||
        max === null ||
        !isSameDay(selectedDatetime, max)
      ) {
        return null;
      }
      return format(max, DEFAULT_TIME_FORMAT);
    },

    dateSelected() {
      return !this.date;
    }
  },
  methods: {
    init() {
      if (!this.datetime) {
        return this.clearHandler();
      }

      let initDateTime;
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime;
      } else if (
        typeof this.datetime === "string" ||
        this.datetime instanceof String
      ) {
        // see https://stackoverflow.com/a/9436948
        initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
      }

      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    },
    okHandler() {
      this.resetPicker();
      this.$emit("input", this.selectedDatetime);
    },
    clearHandler() {
      this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit("input", null);
    },
    resetPicker() {
      this.display = false;
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },
    showTimePicker() {
      this.activeTab = 1;
    }
  },
  watch: {
    datetime: function() {
      this.init();
    }
  }
};
</script>
