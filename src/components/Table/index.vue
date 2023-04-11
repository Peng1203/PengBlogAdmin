<template>
  <el-table
    stripe
    style="width: 100%"
    empty-text="暂无数据"
    v-loading="props.loading"
    :border="props.border"
    :data="props.data"
    @filter-change="handleFilterTable"
    @sort-change="handleColumnSort"
  >
    <template
      :key="i"
      v-for="({ label, prop, width, minWidth, sort, tooltip, fixed, align, slotName, childrenColumns }, i) in tableColumns"
    >
      <!-- 自定义某列 -->
      <el-table-column
        v-if="slotName"
        :prop="prop"
        :label="label"
        :width="width || 'auto'"
        :sortable="sort"
        :min-width="minWidth"
        :show-overflow-tooltip="tooltip"
        :fixed="fixed"
        :align="align || 'left'"
      >
        <template #default="scope">
          <slot
            :prop="prop"
            :name="slotName"
            :scope="scope"
            :row="scope.row"
          />
        </template>
      </el-table-column>

      <!-- 二级表头 -->
      <!-- :width="width || 'auto'" -->
      <el-table-column
        :label="label"
        :align="align || 'center'"
        v-else-if="(childrenColumns && childrenColumns.length)"
      >
        <template
          :key="childrenItem.prop"
          v-for="childrenItem in childrenColumns"
        >
          <!-- 自定义内容 -->
          <el-table-column
            v-if="childrenItem.slotName"
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          >
            <template #defult="scope">
              <slot
                :row="scope.row"
                :name="childrenItem.slotName"
                :prop="childrenItem.prop"
              ></slot>
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          ></el-table-column>
        </template>
      </el-table-column>

      <el-table-column
        v-else
        :prop="prop"
        :label="label"
        :width="width"
        :sortable="sort"
        :min-width="minWidth || ''"
        :show-overflow-tooltip="tooltip"
        :fixed="fixed"
        :align="align || 'left'"
      />
    </template>

    <!-- 过滤 当有二级表头时也不展示 -->
    <el-table-column
      width="30"
      fixed="right"
      align="center"
      column-key="filter"
      class-name="filter-column-header"
      filter-placement="bottom"
      :filters="filterList"
      v-if="isFilterShowColumn"
    >
      <template #header>
        <el-icon>
          <Tools />
        </el-icon>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页器 -->
  <el-pagination
    v-if="props.isNeedPager"
    class="mt15"
    background
    :pager-count="5"
    :page-sizes="pagerInfo?.pageSizeList || defaultPageSizeList"
    :total="Total"
    layout="total, sizes, prev, pager, next, jumper"
    v-model:current-page="Page"
    v-model:page-size="PageSize"
    @size-change="handlePageSzieChange"
    @current-change="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, PropType, defineEmits } from 'vue'

const props = defineProps({
	// 表格数据
	data: {
		type: Array,
		required: true,
		default: () => [],
	},
	// columns 列表
	columns: {
		type: Array<ColumnItem>,
		required: true,
		default: () => [],
	},
	border: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	// 是否展示过滤表格
	isFilterShowColumn: {
		type: Boolean,
		default: false,
	},
	// 是否需要分页
	isNeedPager: {
		type: Boolean,
		default: true,
	},
	// 分页器信息
	pagerInfo: {
		type: Object as PropType<PageInfo>,
		default: () => {},
	},
})

const emits = defineEmits(['columnSort', 'pageChange', 'pageSizeChange', 'pageNumOrSizeChange'])

// 表格展示的 columns
let tableColumns = ref<ColumnItem[]>([])

// 过滤数据
interface filterItem {
	text: string
	value: string
}
const filterList = reactive<filterItem[]>([])
watch(
	() => props.isFilterShowColumn,
	(val) => {
		if (!val) return
		props.columns.forEach(({ label, prop }) => filterList.push({ text: label, value: prop }))
	},
	{
		deep: true,
		immediate: true,
	}
)

// column排序
type OrderProp = {
	ascending: string
	descending: string
}
const handleColumnSort = ({ prop, order }: { prop: string; order: keyof OrderProp }) => {
	const orderProp: OrderProp = {
		ascending: 'ASC',
		descending: 'DESC',
	}
	emits('columnSort', {
		column: orderProp[order] ? prop : '',
		order: orderProp[order] || '',
	})
}

/**
 * 分页器
 */
// 默认可选的page大小列表
const defaultPageSizeList = [10, 30, 50, 100, 200]
const handleFilterTable = (filters: any) => {
	const { filter } = filters

	if (!filter.length) return (tableColumns.value = props.columns)
	tableColumns.value = props.columns.filter((column: ColumnItem) => !filter.includes(column.prop))
}
const Page = ref<number>(0)
const PageSize = ref<number>(0)
const Total = ref<number>(0)
// 分页器
watch(
	() => props.pagerInfo,
	(val) => {
		if (!val || !props.isNeedPager) return
		const { page, pageSize, total } = val
		Page.value = page
		PageSize.value = pageSize
		Total.value = total
	},
	{
		deep: true,
		immediate: true,
	}
)
const handlePageChange = (val: number) => {
	Page.value = val
	emits('pageChange', val)
	emits('pageNumOrSizeChange', { page: Page.value, pageSize: PageSize.value })
}
const handlePageSzieChange = (val: number) => {
	PageSize.value = val
	Page.value = 1
	emits('pageSizeChange', val)
	emits('pageNumOrSizeChange', { page: Page.value, pageSize: PageSize.value })
}

onMounted(() => {
	tableColumns.value = props.columns
})
</script>

<style scop lang="scss">
</style>