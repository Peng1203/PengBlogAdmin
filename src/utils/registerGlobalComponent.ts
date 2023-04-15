import Table from '@/components/Table/index.vue'
import Search from '@/components/Search/index.vue'
import Drawer from '@/components/Drawer/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import Form from '@/components/Form/index.vue'

const commonName = 'Peng'

const ComponentHashMap = {
  [`${commonName}Table`]: Table,
  [`${commonName}Search`]: Search,
  [`${commonName}Drawer`]: Drawer,
  [`${commonName}Dialog`]: Dialog,
  [`${commonName}Form`]: Form,
}

export default ComponentHashMap