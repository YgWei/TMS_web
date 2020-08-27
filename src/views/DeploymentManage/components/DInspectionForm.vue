<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        text="inspector"
        :items="users"
        v-model="deploymentBody.reviewUser"
      ></t-select>
      <t-select-multiple
        text="inspectionGroup"
        v-model="reviewGroup"
        :items="users"
        @change="onChange"
      ></t-select-multiple>
      <t-select
        text="customer"
        v-model="deploymentBody.customer"
        :items="users"
      ></t-select>
      <v-col>
        <p>{{ $t("expiration") }}</p>
        <t-date-time-picker
          :label="startTimeLabel"
          :min="min1"
          :max="max1"
          v-model="startTime"
          :textFieldProps="textFieldProps"
          @input="checkDate1()"
        ></t-date-time-picker>
        <div style="padding:10px">～</div>
        <t-date-time-picker
          :label="endTimeLabel"
          :min="min2"
          v-model="endTime"
          :textFieldProps="textFieldProps"
          @input="checkDate2()"
        ></t-date-time-picker>
      </v-col>
    </v-form>
  </div>
</template>
<script>
import { user } from "@/api";
import moment from "moment";
import { isSameDay } from "date-fns";
export default {
  model: {
    prop: "deploymentBody",
    event: "emit"
  },
  props: {
    deploymentBody: {
      type: Object
    },
    tabIndex: {
      type: Number
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      reviewGroup: null,
      startTimeLabel: this.$t("startTime"),
      endTimeLabel: this.$t("endTime"),
      valid: true,
      users: [],
      textFieldProps: {
        outlined: true,
        dense: true,
        rules: [v => !!v || this.$t("required")]
      },
      startTime: null,
      endTime: null,
      min1: new Date(),
      max1: null,
      min2: new Date()
    };
  },
  methods: {
    onChange() {
      if (this.reviewGroup.length === 0) {
        this.reviewGroup = null;
      }
      this.deploymentBody.reviewGroup = this.reviewGroup;
    },
    compareTime(date1, date2) {
      // return true if date1 > date2, false otherwise
      if (isSameDay(date1, date2)) {
        let time1 = moment(date1).format("kkmm");
        time1 = time1 === "2400" ? "0000" : time1;
        let time2 = moment(date2).format("kkmm");
        time2 = time2 === "2400" ? "0000" : time2;
        if (time1 > time2) return true;
        else return false;
      }
    },
    checkDate1() {
      if (this.endTime !== null) {
        if (this.compareTime(this.startTime, this.endTime)) {
          this.startTime = null;
          this.min2 = new Date();
          return;
        }
      }
      if (this.compareTime(this.min1, this.startTime)) {
        this.$nextTick(function() {
          this.startTime = null;
        });
        this.min2 = new Date();
        return;
      }
      if (this.startTime !== null) {
        this.min2 = this.startTime;
        this.deploymentBody.startTime = this.startTime;
      }
    },
    checkDate2() {
      if (this.startTime !== null) {
        if (this.compareTime(this.startTime, this.endTime)) {
          this.$nextTick(function() {
            this.endTime = null;
          });
          this.max1 = null;
          return;
        }
      }
      if (this.compareTime(this.min2, this.endTime)) {
        this.$nextTick(function() {
          this.endTime = null;
        });
        return;
      }
      this.max1 = this.endTime;
      this.deploymentBody.endTime = this.endTime;
    }
  },
  async mounted() {
    try {
      const getUsers = await user.getUser({
        type: "select",
        start: 0,
        limit: 999
      });
      this.users = getUsers.data.data.data;
    } catch {
      /* empty */
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/design";

p {
  @extend %p-comp-style;
}

.col {
  display: flex;
  flex-direction: row;
  padding: 5px 90px 0px 15px;
}
</style>
