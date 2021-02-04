import page from '../section/topic.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { SITE_TITLE } from '~/constants'

const createWrapper = createWrapperHelper({
  mocks: {
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GptAd'],
})

describe('component methods', () => {
  test('setListData when brief property exist in response', () => {
    const idMock = 'id'
    const imageUrlMock = 'imageurl'
    const nameMock = 'name'
    const briefMock = 'brief'
    const briefHtmlMock = `<div>${briefMock}</div>`
    const ogDescriptionMock = 'og-description'
    const responseMock = {
      items: [
        {
          name: nameMock,
          id: idMock,
          ogImage: {
            image: {
              resizedTargets: {
                mobile: {
                  url: imageUrlMock,
                },
              },
            },
          },
          brief: {
            html: briefHtmlMock,
          },
          ogDescription: ogDescriptionMock,
        },
      ],
    }

    const wrapper = createWrapper(page)

    wrapper.vm.setListData(responseMock)
    expect(wrapper.vm.listData).toEqual([
      {
        id: idMock,
        href: `/topic/${idMock}`,
        imgSrc: imageUrlMock,
        imgText: undefined,
        imgTextBackgroundColor: undefined, // value from scss variable not available in jest
        infoTitle: nameMock,
        infoDescription: briefMock,
      },
    ])
  })
  test('setListData when brief property not exist in response', () => {
    const idMock = 'id'
    const imageUrlMock = 'imageurl'
    const nameMock = 'name'
    const ogDescriptionMock = 'og-description'
    const responseMock = {
      items: [
        {
          name: nameMock,
          id: idMock,
          ogImage: {
            image: {
              resizedTargets: {
                mobile: {
                  url: imageUrlMock,
                },
              },
            },
          },

          /*
           * brief: {
           *   html: briefHtmlMock,
           * },
           */
          ogDescription: ogDescriptionMock,
        },
      ],
    }

    const wrapper = createWrapper(page)
    wrapper.vm.setListData(responseMock)

    expect(wrapper.vm.listData).toEqual([
      {
        id: idMock,
        href: `/topic/${idMock}`,
        imgSrc: imageUrlMock,
        imgText: undefined,
        imgTextBackgroundColor: undefined, // value from scss variable not available in jest
        infoTitle: nameMock,
        infoDescription: ogDescriptionMock,
      },
    ])
  })
  test('setListDataTotal and listDataPageLimit computed by total', () => {
    const totalMock = 1234
    const responseMock = {
      meta: {
        total: totalMock,
      },
    }
    const wrapper = createWrapper(page)
    wrapper.vm.setListDataTotal(responseMock)
    expect(wrapper.vm.listDataTotal).toBe(totalMock)
    expect(wrapper.vm.listDataPageLimit).toBe(
      Math.ceil(totalMock / wrapper.vm.listDataMaxResults)
    )
  })
})

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const wrapper = createWrapper(page)

    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title', 'twitter:title']
    const titleExpected = `Topic - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      'https://www.mirrormedia.mg/section/topic'
    )

    // section-name
    expect(metaResults.meta.find((d) => d.hid === 'section-name').content).toBe(
      'other'
    )
  })
})
