import Vue from 'vue'
import { 
  /* 表单 */
  Button, 
  Form, 
  FormItem, 
  Input, 
  /* 布局 */
  Container, 
  Header, 
  Aside, 
  Main, 
  /* 菜单 */
  Menu, 
  Submenu, 
  MenuItemGroup, 
  MenuItem, 
  /* 面包屑 */
  Breadcrumb, 
  BreadcrumbItem, 
  /* 卡片 */
  Card,
  /* 栅格 */
  Row,
  Col,
  /* 表格 */
  Table,
  TableColumn,
  /* switch开关 */
  Switch,
  /* 文字提示 */
  Tooltip,
  /* 分页 */
  Pagination,
  /* 对话框 */
  Dialog,
  /* 标签 */
  Tag,
  /* 树形控件 */
  Tree,
  /* 选择器 */
  Select,
  Option,
  
  /* 弹框 */
  MessageBox,
  /* 消息提示 */
  Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
