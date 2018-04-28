import Vue from 'vue'
import TypeAhead from '@/components/TypeAhead'

/** This test spec tests typeahead feature for both browse spaces
  and edit space flow.
  */

describe('TypeAhead.vue', () => {
  const Constructor = Vue.extend(TypeAhead)
  const TypeAheadComponent = new Constructor().$mount()

  //  Mock list of allowed attributes. In real life, this list
  //  will be populated using Elastic Search.
  TypeAheadComponent.uniqueAttributesList = ['whiteboard', 'chairs', 'projector']

  it('prompts for adding an attribute', () => {
    expect(TypeAheadComponent.$el.textContent).to.contain('Attributes')
  })

  it('renders pre-selected attributes in edit space flow', () => {
    TypeAheadComponent.selectedAttributes = ['chairs', 'whiteboard']
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })

  it('removes whiteboard when removeAttribute() is invoked', () => {
    TypeAheadComponent.removeAttribute('whiteboard')
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.not.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })

  it('adds whiteboard when addAttribute() is invoked', () => {
    TypeAheadComponent.newAttribute = 'whiteboard'
    TypeAheadComponent.addAttribute()
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })

  it('does not add invalid attribute', () => {
    TypeAheadComponent.newAttribute = 'idontexist'
    TypeAheadComponent.addAttribute()
    TypeAheadComponent._watcher.run()
    expect(TypeAheadComponent.$el.textContent).to.contain('whiteboard')
    expect(TypeAheadComponent.$el.textContent).to.contain('chairs')
  })
})
