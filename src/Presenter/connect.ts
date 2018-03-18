import React, { Component, ComponentType } from 'react';
import { ComponentProvider } from 'react-native';
import { actionsKey, Presenter, PresenterOutput } from './Presenter';

export interface Actions<T> {
  actions: T;
}

export const connect = <P extends Presenter<VM>, I, VM>
(presenter: P,
 initialState: VM,
 component: ComponentType<Actions<I> & VM>,
 mapPresenterToActions?: (presenter: P) => Actions<I>,
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
      const actions = mapPresenterToActions ?
        mapPresenterToActions(this.presenter) : autoMapPresenterToActions(this.presenter);
      const props = { ...actions, ...this.state as any };
      return React.createElement(component, props);
    }
  }

  return () => PresenterProvider;
};

const autoMapPresenterToActions = <P, A>(presenter: P): Actions<A> => {
  const map: Actions<any> = { actions: {} };

  const actionsKeys = (presenter as any)[actionsKey];
  if (actionsKeys) {
    for (const actionKey of actionsKeys) {
      const fn = (presenter as any)[actionKey];
      if (fn.bind) {
        map.actions[actionKey] = fn.bind(presenter);
      } else {
        map.actions[actionKey] = fn;
      }
    }
  }

  return map;
};
