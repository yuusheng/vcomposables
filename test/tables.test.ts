import { describe, expect, it } from 'vitest'
import { usePage } from '../src'

describe('function to request data and page break', () => {
  const { current, data, nextPage, prePage, updateData } = usePage<{ title: string }>(mock)
  updateData()

  it('should be 1', () => {
    expect(current.value).toMatchInlineSnapshot('1')
    expect(data.value).toMatchInlineSnapshot(`
      [
        {
          "title": "1",
        },
      ]
    `)
  })

  it('should be next page', () => {
    nextPage()
    expect(current.value).toMatchInlineSnapshot('2')
    expect(data.value[0].title).toMatchInlineSnapshot('"1"')
  })

  it('should be pre page', () => {
    prePage()
    expect(current.value).toMatchInlineSnapshot('1')
    expect(data.value[0].title).toMatchInlineSnapshot('"2"')
  })
})

function mock(param: { page: number }) {
  const res
    = param.page === 1
      ? {
          code: 1,
          msg: 'success',
          data: {
            page: 1,
            total: 30,
            list: [{
              title: '1',
            }],
          },
        }
      : {
          code: 1,
          msg: 'success',
          data: {
            page: 2,
            total: 30,
            list: [
              {
                title: '2',
              },
            ],
          },
        }
  return Promise.resolve(res)
}
