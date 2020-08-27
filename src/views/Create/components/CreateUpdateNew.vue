<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        text="templateName"
        :items="templates"
        v-model="template"
      ></t-select>
      <t-select
        text="releaseVersion"
        :items="releaseVersions"
        v-model="release"
        :disabled="checkTemplate"
      ></t-select>
      <t-select-multiple
        :text="'productCenter'"
        :items="items"
        v-model="workCenters"
        :disabled="checkTemplate"
      ></t-select-multiple>
      <t-radio-group :text="'updateExpiration'" v-model="startTime">
        <template v-slot:items>
          <v-radio
            :label="$t('afterProduction')"
            value="afterProduction"
          ></v-radio>
          <v-radio
            :label="$t('beforeProduction')"
            value="beforeProduction"
          ></v-radio>
          <v-radio :label="$t('immidiately')" value="immidiately"></v-radio>
        </template>
      </t-radio-group>
      <t-textarea text="note" v-model="note"></t-textarea>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="submitRegis()"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
  </div>
</template>
<script>
import { release, template, updateRecord } from "@/api";
export default {
  data() {
    return {
      items: [],
      releaseVersions: [],
      release: null,
      workCenters: null,
      workcenter: [],
      templates: [],
      template: null,
      startTime: null,
      note: "",
      valid: true,
      checkTemplate: true
    };
  },
  watch: {
    template: {
      async handler(val) {
        this.checkTemplate = false;
        this.workCenters = null;
        this.release = null;
        try {
          const params = {
            start: 0,
            limit: 999,
            templateUuid: val.uuid
          };
          const getReleases = await release.getRelease(params);
          this.releaseVersions = getReleases.data.data.data;

          const params2 = {
            start: 0,
            limit: 999
          };
          const workCenters = await template.getWorkcenterByTemplateUuid(
            val.uuid,
            params2
          );
          this.items = workCenters.data.data.data;
        } catch {
          /* empty */
        }
      }
    }
  },
  methods: {
    async submitRegis() {
      if (this.$refs.form.validate()) {
        this.workcenter = [];
        this.workCenters.forEach(uuid => {
          this.workcenter.push(uuid.uuid);
        });
        const body = {
          templateUuid: this.template.uuid,
          releaseUuid: this.release.uuid,
          workCenters: this.workcenter,
          startTime: this.startTime,
          note: this.note
        };
        try {
          await updateRecord.createUpdateRecord(body);
          this.$router.push("/update");
        } catch {
          /* empty */
        }
      }
    }
  },
  async mounted() {
    const params1 = {
      start: 0,
      limit: 999,
      type: "all"
    };
    try {
      const datas = await template.getTemplate(params1);
      this.templates = datas.data.data.data;
    } catch {
      /* empty */
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/design";

.col {
  @extend %create-col-style;
}
.col-btn {
  @extend %create-btn-style;
}
</style>
