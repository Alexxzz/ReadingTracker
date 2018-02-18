import React, { Component, ComponentClass } from 'react';
import { ComponentProvider } from 'react-native';
import { Presenter, PresenterOutput } from './Presenter';

export interface Actions<T> {
  actions: T;
}

export const connect = <P extends Presenter<VM>, I, VM>
(presenter: P,
 initialState: VM,
 component: ComponentClass<Actions<I> & VM>,
 mapPresenterToActions: (presenter: P) => Actions<I>,
): ComponentProvider => {
  class PresenterProvider extends Component implements PresenterOutput<VM> {
    private readonly presenter: P;

    state: VM = initialState;

    constructor(props: any) {
      super(props);

      this.presenter = presenter;
      presenter.setOutput(this);
    }

    renderOutput(viewModel: Partial<VM>): void {
      this.setState(viewModel);
    }

    render() {
      const actions = mapPresenterToActions(this.presenter);
      const props = { ...actions, ...this.state as any };
      return React.createElement(component, props);
    }
  }

  return () => PresenterProvider;
};
