import Layout from '@/layout'

const tableRouter = {
  path: '/system-mange',
  component: Layout,
  redirect: '/system-mange',
  name: 'system-mange',
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [
    {
      path: 'book-info-table',
      component: () => import('@/views/project/book-info'),
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
