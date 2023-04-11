<template>
  <div class="my-table">
    <el-table :data="props.data">
      <template
        :key="i"
        v-for="({ label, prop, width, minWidth, sort, tooltip, fixed, align, slotName, childrenColumns }, i) in props.columns"
      >
        <!-- 自定义某列 -->
        <el-table-column
          v-if="slotName"
          :prop="prop"
          :label="label"
          :width="width"
          :sortable="sort"
          :min-width="minWidth || ''"
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
        <el-table-column
          :label="label"
          :width="width"
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
              :width="childrenItem.width"
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
              :width="childrenItem.width"
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

      <!-- 过滤 -->
      <el-table-column
        v-if="isFilterShowColumn"
        width="60"
        fixed="right"
        align="center"
        :filters="filterList"
        filter-placement="bottom"
      >
        <template #header>
          <div class="filter-header">
            <el-icon>
              <Tools />
            </el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { columns } from 'element-plus/es/components/table-v2/src/common'
import { watch, reactive } from 'vue'

const props = defineProps({
	// 表格数据
	data: {
		type: Array,
		default: () => [],
	},
	// columns 列表
	columns: {
		type: Array<ColumnItem>,
		default: () => [],
	},
	isFilterShowColumn: {
		type: Boolean,
		default: false,
	},
})

// 过滤数据
interface filterItem {
	text: string
	prop: string
}
const filterList = reactive<filterItem[]>([])
watch(
	() => props.isFilterShowColumn,
	(val) => {
		if (!val) return
		props.columns.forEach(({ label, prop }) => filterList.push({ text: label, prop }))

		console.log('isFilterShowColumn -----', val, filterList)
	},
	{
		deep: true,
		immediate: true,
	}
)
</script>

<style scop lang="scss">
</style>