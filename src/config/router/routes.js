const constantMap = [
  {
    path: "/user",
    // component: userLayout,
    // component: { render: h => h("router-view") }, //使用jsx渲染方式写路由占位符
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "layout" */ "@/components/layouts/UserLayout.vue"),
    children: [
      {
        // 重定向跳转页
        path: "/user",
        redirect: "/user/login",
      },
      {
        path: "/user/login",
        name: "login",
        component: () => import(/* webpackChunkName: "user" */ "@/views/User/Login.vue"),
      },
      {
        path: "/user/register",
        name: "register",
        component: () => import(/* webpackChunkName: "user" */ "@/views/User/Register.vue"),
      },
    ],
    meta: { title: "user", hide: true },
  },
  {
    path: "/403",
    name: "403",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "@/views/403.vue"),
    meta: { title: "403", hide: true },
  },
  {
    path: "/500",
    name: "500",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "@/views/500.vue"),
    meta: { title: "500", hide: true },
  },
];

const asyncMap = [
  {
    path: "/home",
    name: "home",
    hideInMenu: true, //左侧菜单标志位：不渲染该菜单
    // component: HomeView,
    component: { render: (h) => h("router-view") },
    meta: { title: "index", hide: true },
    redirect: "/",
  },
  {
    path: "/",
    name: "index",
    meta: {
      title: "系统后台",
      authority: ["user", "admin"],
      tags: [],
      ignore: true,
      hide: false,
      hideChildren: false,
      icon: "dashboard",
    },
    component: () => import(/* webpackChunkName: "layout" */ "@/components/layouts/BasicLayout.vue"),
    redirect: "/safe",
    children: [
      {
        path: "/safe",
        name: "safe",
        meta: { title: "十大安全", icon: "fund" }, //菜单元信息
        component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Safe/Safe.vue"),
      },
      {
        path: "/develop",
        name: "develop",
        meta: { title: "发展管理", authority: ["admin", "user"], hide: true }, //菜单元信息
        component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Develop/Develop.vue"),
      },
      {
        path: "/manage",
        name: "manage",
        meta: { title: "管理", authority: ["admin", "user"], hide: true }, //菜单元信息
        component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Manage/Manage.vue"),
      },
      {
        path: "/info",
        name: "info",
        meta: { title: "安全信息管理", authority: ["admin", "user"], hide: true }, //菜单元信息
        component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Info/Info.vue"),
      },
      {
        path: "/sys",
        name: "sys",
        meta: { icon: "bar-chart", title: "系统设置", authority: ["admin", "user"] }, //菜单元信息
        component: { render: (h) => h("router-view") },
        children: [
          {
            path: "/sys/rights",
            name: "rights",
            meta: { title: "权限管理" }, //菜单元信息
            component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Rights/Rights.vue"),
          },
          // {
          //   path: "/sys/files",
          //   name: "files",
          //   meta: { title: "文件管理", authority: ["super"] }, //菜单元信息
          //   component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Sys/Files.vue"),
          // },
        ],
      },
      // //情景管理
      // {
      //   path: "/plot",
      //   name: "plot",
      //   meta: { icon: "dot-chart", title: "情景配置", authority: ["admin", "user"] }, //菜单元信息
      //   component: { render: (h) => h("router-view") },
      //   children: [
      //     {
      //       path: "/plot/scene",
      //       name: "scene",
      //       meta: { title: "情景管理" }, //菜单元信息
      //       component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Plot/Scene.vue"),
      //     },
      //     {
      //       path: "/plot/groups",
      //       name: "groups",
      //       meta: { title: "组别管理" }, //菜单元信息
      //       component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Plot/Groups.vue"),
      //     },
      //   ],
      // },
    ],
  },
  {
    // 这项需要在最后，因为路由按顺序匹配，匹配到了就直接跳转到该路由的视图
    path: "*",
    name: "404",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "@/views/404.vue"),
    meta: { title: "404", hide: true },
  },
];

export default { asyncMap, constantMap };
