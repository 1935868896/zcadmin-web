import Layout from '@/layout'

const tableRouter = {
  path: '/project-mange',
  component: Layout,
  redirect: 'project-mange',
  name: 'project-mange',
  meta: {
    title: '项目管理',
    icon: 'table'
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
      component: () => import('@/views/project/template'),
      name: 'template',
      meta: { title: '模板' }
    }
  ]
}
export default tableRouter
