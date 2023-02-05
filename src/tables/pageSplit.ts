import { onMounted, ref, unref } from 'vue'
import type { MaybeRef } from '~/utils'

interface Param {
  page: number
  number: number
  [key: string]: any
}

type RefParam<T> = { [P in keyof T]: MaybeRef<T[P]> }

interface BaseRes<T> {
  code: number
  data: BaseData<T>
  msg: string
}

interface BaseData<T> {
  page: number
  total: number
  list: T[]
}

export function usePage<T, U extends BaseRes<T> = BaseRes<T>>(
  reqFn: (param: Param) => Promise<U>,
  param?: RefParam<Param>,
) {
  const current = ref(unref(param?.page) | 1)
  const total = ref(0)

  const data = ref<T[]>()
  async function updateData() {
    const unrefParam = <Param>Object
      .entries({ ...param, page: current.value })
      .reduce((pre, [key, val]) => {
        pre[key] = unref(val)
        return pre
      }, {})
    const { data: res } = await reqFn(unrefParam)
    data.value = res.list
    total.value = res.total
  }

  function prePage() {
    if (current.value === 0)
      return
    current.value--
    updateData()
  }

  function nextPage() {
    if (current.value >= total.value)
      return
    current.value++
    updateData()
  }

  onMounted(() => {
    updateData()
  })

  return {
    current,
    total,
    data,
    updateData,
    prePage,
    nextPage,
  }
}
