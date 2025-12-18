const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/Dashboard.vue')
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/dashboards/Dashboard.vue')
    },
    {
      name: 'Member',
      path: '/Member',
      component: () => import('@/views/pages/MemberList.vue')
    },
    {
      name: 'Staff',
      path: '/Staff',
      component: () => import('@/views/pages/StaffList.vue')
    },
    {
      name: 'Goods',
      path: '/Goods',
      component: () => import('@/views/pages/GoodsView.vue')
    },
    {
      name: 'editGoods',
      path: '/editGoods/:id',
      component: () => import('@/views/pages/EditGoods.vue')
    },
    {
      name: 'Write Member',
      path: '/member/write',
      component: () => import('@/views/pages/MemberForm.vue')
    },
    {
      name: 'Write Staff',
      path: '/staff/write',
      component: () => import('@/views/pages/StaffForm.vue')
    },
    {
      name: 'Edit Member',
      path: '/member/:id',
      component: () => import('@/views/pages/EditMember.vue')
    },
    {
      name: 'Edit Staff',
      path: '/staff/:id',
      component: () => import('@/views/pages/EditStaff.vue')
    },
    {
      name: 'Customer',
      path: '/customer',
      component: () => import('@/views/pages/CustomerView.vue')
    },
    {
      name: 'Edit Customer',
      path: '/customer/:id',
      component: () => import('@/views/pages/CustomerForm.vue')
    },
    
    {
      name: 'New Customer',
      path: '/customer/new',
      component: () => import('@/views/pages/CustomerForm.vue')
    },
    {
      name: 'goods',
      path: '/goods',
      component: () => import('@/views/pages/GoodsView.vue')
    },
    {
      name: 'Edit goods',
      path: '/goods/:id',
      component: () => import('@/views/pages/GoodsForm.vue')
    },
    
    {
      name: 'New goods',
      path: '/goods/new',
      component: () => import('@/views/pages/GoodsForm.vue')
    },
    {
      name: 'class',
      path: '/class',
      component: () => import('@/views/pages/ClassView.vue')
    },
    {
      name: 'Edit class',
      path: '/editclass/:id',
      component: () => import('@/views/pages/EditClass.vue')
    },

    {
      name: 'New class',
      path: '/class/new',
      component: () => import('@/views/pages/ClassForm.vue')
    },
    {
      name: 'Calendar',
      path: '/calendar',
      component: () => import('@/views/pages/CalendarView.vue')
    },
    {
      name: 'Purchase',
      path: '/purchase',
      component: () => import('@/views/pages/PurchaseView.vue')
    },
    {
      name: 'Edit Purchase',
      path: '/purchase/:id',
      component: () => import('@/views/pages/PurchaseForm.vue')
    },
    
    {
      name: 'New Purchase',
      path: '/purchase/new',
      component: () => import('@/views/pages/PurchaseForm.vue')
    },
    {
      name: 'Blog',
      path: '/blog',
      component: () => import('@/views/pages/BlogView.vue')
    },
    {
      name: 'Error 404',
      path: '/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
    // ,
    // {
    //   name: 'Tabler Icons',
    //   path: '/icons/tabler',
    //   component: () => import('@/views/utilities/icons/TablerIcons.vue')
    // },
    // {
    //   name: 'Material Icons',
    //   path: '/icons/material',
    //   component: () => import('@/views/utilities/icons/MaterialIcons.vue')
    // },
    // {
    //   name: 'Typography',
    //   path: '/utils/typography',
    //   component: () => import('@/views/utilities/typography/TypographyPage.vue')
    // },
    // {
    //   name: 'Shadows',
    //   path: '/utils/shadows',
    //   component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    // },
    // {
    //   name: 'Colors',
    //   path: '/utils/colors',
    //   component: () => import('@/views/utilities/colors/ColorPage.vue')
    // },
  ]
};

export default MainRoutes;
