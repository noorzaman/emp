import Vue from 'vue'
import Search from '@/components/Search'

/** This test spec tests search space by name feature.
  */

describe('Search.vue', () => {
  const Constructor = Vue.extend(Search)
  const SearchComponent = new Constructor().$mount()

  it('shows Search by name page when changeSearchToByName() is called', () => {
    SearchComponent.changeSearchToByName()
    expect(SearchComponent.$el.textContent).to.contain('Space Name')
    expect(SearchComponent.showFullSearch).to.equal(false)
  })
})
