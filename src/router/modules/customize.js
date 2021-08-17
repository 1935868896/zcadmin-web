/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/customize',
  component: Layout,
  redirect: '/customize/complex-table',
  name: '自定义',
  meta: {
    title: '自定义',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/customize/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/customize/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/customize/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'book-info-table',
      component: () => import('@/views/project/book-info'),
      name: '图书信息2',
      meta: { title: '图书信息1' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/customize/complex-table'),
      name: '文章',
      meta: { title: '文章' }
    }
  ]
}
export default tableRouter
