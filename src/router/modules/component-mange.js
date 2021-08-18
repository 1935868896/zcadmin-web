/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/component-mange',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '组件管理',
    icon: 'component'
  },
  children: [
    {
      path: 'icon',
      component: () => import('@/views/icons/index'),
      name: 'Icons',
      meta: { title: '图标库', icon: 'icon', noCache: true }
    },
    {
      path: 'tinymce',
      component: () => import('@/views/components-demo/tinymce'),
      name: 'TinymceDemo',
      meta: { title: '富文本' }
    }
  ]
}

export default componentsRouter
