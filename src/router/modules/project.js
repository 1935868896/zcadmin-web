/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project-mange/book-info-table',
  name: '项目',
  meta: {
    title: '项目',
    icon: 'table'
  },
  children: [
    {
      path: 'book-info-table',
      component: () => import('@/views/project-mange/book-info'),
      name: '图书信息2',
      meta: { title: '图书信息' }
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
