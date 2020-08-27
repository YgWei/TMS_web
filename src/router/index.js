import Vue from "vue";
import VueRouter from "vue-router";
import basicLayout from "../layout/BasicLayout.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/User/Login.vue")
  },
  {
    path: "/create",
    name: "createTemplate",
    meta: {
      title: "create",
      show: false
    },
    component: basicLayout,
    children: [
      {
        path: "/create",
        name: "create",
        component: () =>
          import(
            /* webpackChunkName: "create" */
            "../views/Create/CreatePage.vue"
          )
      }
    ]
  },
  {
    path: "/template",
    name: "template",
    meta: {
      title: "TemplateRegistration",
      show: true,
      icon: "mdi-tag"
    },
    component: basicLayout,
    children: [
      {
        path: "/template",
        name: "TemplateRegistration",
        component: () =>
          import(
            /* webpackChunkName: "template" */
            "@/views/Template/TemplateRegistration.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },
  {
    path: "/business",
    name: "business",
    meta: {
      title: "businessInfo",
      show: true,
      icon: "mdi-puzzle"
    },
    component: basicLayout,
    children: [
      {
        path: "/business",
        name: "businessInfo",
        component: () =>
          import(
            /* webpackChunkName: "update" */
            "../views/BusinessInfo/BusinessInfo.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },
  {
    path: "/deploymentmanage",
    name: "deploymentmanage",
    meta: {
      title: "deploymentmanage",
      show: true,
      icon: "mdi-shape"
    },
    component: basicLayout,
    children: [
      {
        path: "/deploymentmanage",
        name: "basicdata",
        component: () =>
          import(
            /* webpackChunkName: "basicdata" */
            "../views/DeploymentManage/BasicData.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },
  {
    path: "/quality",
    name: "quality",
    meta: {
      title: "QualityInspection",
      show: true,
      icon: "mdi-circle-edit-outline"
    },
    component: basicLayout,
    children: [
      {
        path: "/quality",
        name: "QualityInspection",
        component: () =>
          import(
            /* webpackChunkName: "template" */
            "@/views/QualityInspection/QualityInspection.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },

  {
    path: "/release",
    name: "release",
    meta: {
      title: "ReleaseRecord",
      show: true,
      icon: "mdi-scatter-plot"
    },
    component: basicLayout,
    children: [
      {
        path: "/release",
        name: "ReleaseRecord",
        component: () =>
          import(
            /* webpackChunkName: "release" */
            "@/views/ReleaseRecord/ReleaseRecord.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },
  {
    path: "/update",
    name: "HistoryUpdate",
    meta: {
      title: "update",
      show: true,
      icon: "mdi-pinwheel"
    },
    component: basicLayout,
    children: [
      {
        path: "/update",
        name: "update",
        component: () =>
          import(
            /* webpackChunkName: "update" */
            "../views/HistoryUpdate/Update.vue"
          ),
        meta: {
          clickHistorys: true
        }
      }
    ]
  },
  {
    path: "/workcenter",
    name: "work",
    meta: {
      title: "workCenter",
      show: true,
      icon: "mdi-lan-pending"
    },
    component: basicLayout,
    children: [
      {
        path: "/workcenter",
        name: "workCenter",
        component: () =>
          import(
            /* webpackChunkName: "workcenter" */
            "@/views/WorkCenter/WorkCenter.vue"
          ),
        meta: {
          clickHistorys: true
        }
      },
      {
        path: "/workcenter/responsible",
        name: "responsible",
        component: () =>
          import(
            /* webpackChunkName: "workcenter" */
            "@/views/WorkCenter/ResponsibleList.vue"
          )
      },
      {
        path: "/workcenter/responsible/edit",
        name: "edit",
        component: () =>
          import(
            /* webpackChunkName: "workcenter" */
            "@/views/WorkCenter/EditResponsible.vue"
          )
      },
      {
        path: "/workcenter/taskList",
        name: "taskList",
        component: () =>
          import(
            /* webpackChunkName: "workcenter" */
            "@/views/WorkCenter/TaskList.vue"
          )
      },
      {
        path: "/workcenter/templateList",
        name: "templateList",
        component: () =>
          import(
            /* webpackChunkName: "workcenter" */
            "@/views/WorkCenter/TemplateList.vue"
          )
      }
    ]
  },

  // {
  //   path: "/test",
  //   name: "TemplateTest",
  //   meta: {
  //     title: "templateTest",
  //     show: true,
  //     icon: "mdi-radiobox-marked"
  //   },
  //   component: basicLayout,
  //   children: [
  //     {
  //       path: "/test",
  //       name: "templateTest",
  //       component: () =>
  //         import(
  //           /* webpackChunkName: "test" */
  //           "@/views/TemplateTest/TemplateTest.vue"
  //         ),
  //       meta: {
  //         clickHistorys: true
  //       }
  //     }
  //   ]
  // },
  {
    path: "/*",
    redirect: "/login"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem("token");
  if (to.path !== "/login") {
    if (!token) {
      return next("/login");
    }
  }
  if (token) {
    if (!store.getters.getRoles) {
      try {
        await store.dispatch("userInfo");
        next("/deploymentmanage");
      } catch {
        localStorage.removeItem("token");
        next("/login");
      }
    }
  }

  next();
});

export default router;
