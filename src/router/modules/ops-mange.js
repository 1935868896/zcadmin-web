import Layout from '@/layout'

const tableRouter = {
  path: '/ops-mange',
  component: Layout,
  redirect: '/ops-mange',
  name: 'ops-mange',
  meta: {
    title: '运维管理',
    icon: 'mnt'
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
