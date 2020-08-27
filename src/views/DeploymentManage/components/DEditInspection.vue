<template>
  <div>
    <v-col>
      <p>{{ $t("alreadySelectedReviewGroup") }}</p>
      <span class="lineBreak">{{ selectedReviewGroup }}</span>
    </v-col>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select-multiple
        text="inspectionGroup"
        v-model="selectedUsers"
        :items="users"
        @change="onChange"
      ></t-select-multiple>
    </v-form>
  </div>
</template>
<script>
import { user } from "@/api";
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
      valid: true,
      users: [],
      selectedUsers: null,
      selectedReviewGroup: []
    };
  },
  methods: {
    onChange() {
      if (this.selectedUsers.length === 0) {
        this.selectedUsers = null;
      }
      this.deploymentBody.reviewGroup = this.selectedUsers;
    }
  },
  async mounted() {
    try {
      const getUsers = await user.getUser({
        type: "select",
        start: 0,
        limit: 10
      });
      this.users = getUsers.data.data.data;

      let i, j;
      for (i in this.deploymentBody.reviewGroup) {
        for (j in this.users) {
          if (this.deploymentBody.reviewGroup[i].uuid === this.users[j].uuid) {
            this.users.splice(j, 1);
            break;
          }
        }
      }
      this.selectedReviewGroup = this.deploymentBody.reviewGroup
        .map(element => element.name)
        .join(", ");
    } catch {
      /* empty */
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/design";

p {
  @extend %p-comp-style;
}
.col {
  display: flex;
  flex-direction: row;
  padding: 5px 90px 0px 15px;
}
.lineBreak {
  padding-top: 10px;
  font-size: 14px;
  margin-bottom: 10px;
  display: inline-block;
}
</style>
