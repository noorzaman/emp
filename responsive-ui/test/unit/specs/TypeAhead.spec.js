import Vue from 'vue'
import TypeAhead from '@/components/TypeAhead'

describe('TypeAhead.vue', () => {
  const Constructor = Vue.extend(TypeAhead)
  const TypeAheadComponent = new Constructor().$mount()

  it('should prompt for adding an attribute', () => {
    expect(TypeAheadComponent.$el.textContent).to.contain('Add attribute')
  })

  it('should add whiteboard and chairs as a new attribute', () => {
    TypeAheadComponent.selectedAttributes = ['whiteboard', 'chairs']
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })

  it('should remove whiteboard when removeAttribute() is invoked', () => {
    TypeAheadComponent.removeAttribute('whiteboard')
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.not.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })
})
