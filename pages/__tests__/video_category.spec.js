import page from '../video_category/_name.vue'
import UiLinkedItemWithTitle from '~/components/UiLinkedItemWithTitle.vue'
import UiVideoIframeWithItems from '~/components/UiVideoIframeWithItems.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const $ga = {
  event: jest.fn(),
}

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      state: {
        sections: {
          data: {
            items: [],
          },
        },
      },
    },
    $ga,
  },
})

const sectionNameMock = 'video_coverstory'
const playlistItemsMock = [
  { videoId: 1 },
  { videoId: 2 },
  { videoId: 3 },
  { videoId: 4 },
  { videoId: 5 },
  { videoId: 6 },
]

const wrapper = createWrapper(page, {
  mocks: {
    $route: {
      path: `/video_category/${sectionNameMock}`,
    },
  },
  data() {
    return {
      playlistItems: playlistItemsMock,
    }
  },
})

describe('computed data', () => {
  test('should return proper categoryName', () => {
    expect(wrapper.vm.categoryName).toBe(sectionNameMock)
  })
  test('should return proper firstFiveItems', () => {
    const playlistItemsMock = [
      { videoId: 1 },
      { videoId: 2 },
      { videoId: 3 },
      { videoId: 4 },
      { videoId: 5 },
      { videoId: 6 },
    ]
    expect(wrapper.vm.firstFiveItems.length).toBe(5)
    expect(wrapper.vm.firstFiveItems).toEqual(playlistItemsMock.slice(0, 5))
  })
  test('should return proper remainingItems', () => {
    expect(wrapper.vm.remainingItemsBeforeMobileAd.videoId).toEqual(
      playlistItemsMock[5].videoId
    )
    expect(wrapper.vm.remainingItemsAfterMobileAdBeforeDesktopAd.length).toBe(0)
    expect(wrapper.vm.remainingItemsAfterDesktopAd.length).toBe(0)
  })
})

describe('handleSendGa method', () => {
  const gaArgs = {
    eventCategory: 'listing',
    eventAction: 'click',
    eventLabel: 'test',
  }
  test('call $ga.event when UiVideoIframeWithItems emits sendGa', () => {
    wrapper.findComponent(UiVideoIframeWithItems).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})

describe('handleClick method', () => {
  test('call $ga.event when UiVideoIframeWithItems emits sendGa', () => {
    wrapper.findComponent(UiLinkedItemWithTitle).vm.$emit('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'listing',
      eventAction: 'click',
      eventLabel: 'latest_video',
    })
  })
})
