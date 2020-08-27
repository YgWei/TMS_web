<template>
  <div>
    <v-data-table
      fixed-header
      :height="height"
      :headers="headers"
      :items="items"
      @click:row="handleClick($event)"
      @page-count="pageCount = $event"
      hide-default-footer
      id="dataTable"
      return-object
      :no-data-text="$t('noData')"
    >
      <template>
        <div slot="top" class="top-margin">
          <slot name="top"></slot>
        </div>
      </template>

      <template>
        <div slot="footer" class="footer-class">
          <v-pagination
            :value="page"
            @input="next"
            :length="Math.ceil(count / 10)"
            total-visible="5"
          ></v-pagination>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  model: {
    prop: "page",
    event: "click"
  },
  props: {
    check: {
      type: Boolean
    },
    headers: Array,
    items: Array,
    count: Number,
    page: Number
  },
  data() {
    return {
      pageCount: 0
    };
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    next(e) {
      this.$emit("click", e);
      let tr = document.getElementsByTagName("tr");
      tr.forEach(element => {
        element.classList.remove("v-data-table__selected");
      });
    },
    handleClick(e) {
      if (e) {
        if (!this.editShow) {
          this.setEditShow();
        }
      }
      if (this.oldTr) {
        this.oldTr.classList.remove("v-data-table__selected");
      }
      let tr = event.target.parentNode;
      tr.classList.add("v-data-table__selected");
      this.oldTr = tr;

      if (!this.footerShow) {
        this.setFooterShow();
      }

      this.$emit("handleClick", e);
    }
  },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow", editShow: "getEditShow" }),
    height() {
      if (
        this.$route.path == "/workcenter/responsible" ||
        this.$route.path == "/workcenter/templateList" ||
        this.$route.path == "/workcenter/taskList"
      ) {
        return "64vh";
      }
      return this.footerShow ? "40vh" : "64vh";
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-class {
  margin-top: 5px;
  float: right;
}
.top-margin {
  align-items: center;
  padding-left: 20px;
  padding-bottom: 10px;
}

#dataTable ::v-deep.v-data-table-header {
  background-color: #f3f3f3;
}
#dataTable ::v-deep thead th {
  font-size: 14px;
  text-align: left !important;
  background: #e5e5ea;
}
#dataTable ::v-deep td {
  font-size: 13px;
  text-align: left !important;
  color: #8e8e93;
  font-weight: 500;
}
</style>
