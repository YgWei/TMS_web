<template>
  <v-dialog fullscreen v-model="isDialog">
    <v-card>
      <div id="reviewContainer">
        <v-btn icon class="icon" @click="goBack()">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <h2>{{ template.name }} / {{ template.tag }}</h2>
        <div v-for="(reviewType, index) in reviews" :key="index">
          <h3>{{ $t(reviewType.user) }}</h3>
          <review-card
            v-for="(review, index) in reviewType.reviews"
            :key="index"
            :reviews="review"
            style="margin-left: 120px; margin-bottom: 20px;"
          ></review-card>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ReviewCard from "./ReviewCard";
import { deployment } from "@/api";
export default {
  props: {
    isDialog: {
      type: Boolean
    },
    infoData: {
      type: Object
    }
  },
  components: { ReviewCard },
  data() {
    return {
      titles: ["reviewUser", "customer", "reviewGroup"],
      reviews: [],
      template: {}
    };
  },
  watch: {
    isDialog: {
      immediate: true,
      async handler() {
        if (this.isDialog == true) {
          this.reviews = [];
          for (const i of this.titles) {
            const params = {
              start: 0,
              limit: 10,
              group: i
            };
            try {
              const getReview = await deployment.getReviews(
                this.infoData.deployment.uuid,
                params
              );
              this.reviews.push({
                user:
                  i === "reviewUser"
                    ? "mainInspectioner"
                    : i === "reviewGroup"
                    ? "groupInspectioner"
                    : i,
                reviews: getReview.data.data.data
              });
            } catch {
              /* error */
            }
          }
          this.template.name = this.infoData.deployment.template.name;
          this.template.tag = this.infoData.deployment.template.tag;
        }
      }
    }
  },
  methods: {
    goBack() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="scss" scoped>
#reviewContainer {
  padding: 50px 0px 20px 0px;
  max-width: 850px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
h2 {
  color: #8e8e93;
  font-size: 22px;
  margin-bottom: 30px;
}
h3 {
  padding-left: 20px;
  color: #4a90e2;
  font-size: 18px;
}
.icon {
  align-self: flex-end;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
