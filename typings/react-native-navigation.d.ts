declare module 'react-native-navigation' {
  export declare const Navigation: NavigationClass;

  export type NavigationProps = {
    componentId: string;
  };

  export declare class NavigationClass {
    public registerComponent(componentName: string, getComponentClassFunc: ComponentProvider): void;
    public setRoot(params: any): Promise<any>;
    public events(): any;

    public push(componentId: string, layout: any): Promise<any>;
  }

  // export default NavigationClass;
  //
  // export declare class NavigationClass {
  //   readonly Element: any;
  //   private readonly store;
  //   private readonly nativeEventsReceiver;
  //   private readonly uniqueIdProvider;
  //   private readonly componentRegistry;
  //   private readonly layoutTreeParser;
  //   private readonly layoutTreeCrawler;
  //   private readonly nativeCommandsSender;
  //   private readonly commands;
  //   private readonly publicEventsRegistry;
  //
  //   constructor();
  //
  //   /**
  //    * Every navigation component in your app must be registered with a unique name. The component
  //    * itself is a traditional React component extending React.Component.
  //    * @param {string} componentName Unique component name
  //    * @param {function} getComponentClassFunc generator function,
  //    * typically `() => require('./myComponent')`
  //    */
  //   registerComponent(componentName: string, getComponentClassFunc: ComponentProvider): void;
  //
  //   /**
  //    * Reset the navigation stack to a new component (the stack root is changed).
  //    * @param {Root} root
  //    */
  //   setRoot(params: any): any;
  //
  //   /**
  //    * Set default options to all screens. Useful for declaring a consistent style across the app.
  //    * @param {options:Options} options
  //    */
  //   setDefaultOptions(options: any): void;
  //
  //   /**
  //    * Change a components navigation options
  //    * @param {string} componentId The component's id.
  //    * @param {options:Options} options
  //    */
  //   setOptions(componentId: any, options: any): void;
  //
  //   /**
  //    * Show a screen as a modal.
  //    * @param {object} params
  //    */
  //   showModal(params: any): any;
  //
  //   /**
  //    * Dismiss a modal by componentId. The dismissed modal can be anywhere in the stack.
  //    * @param {string} componentId The component's id.
  //    */
  //   dismissModal(componentId: any): any;
  //
  //   /**
  //    * Dismiss all Modals
  //    */
  //   dismissAllModals(): any;
  //
  //   /**
  //    * Push a new screen into this screen's navigation stack.
  //    * @param {string} componentId The component's id.
  //    * @param {Component} component
  //    */
  //   push(componentId: any, component: any): any;
  //
  //   /**
  //    * Pop a component from the stack, regardless of it's position.
  //    * @param {string} componentId The component's id.
  //    * @param {*} params
  //    */
  //   pop(componentId: any, params: any): any;
  //
  //   /**
  //    * Pop the stack to a given component
  //    * @param {string} componentId The component's id.
  //    */
  //   popTo(componentId: string): any;
  //
  //   /**
  //    * Pop the component's stack to root.
  //    * @param {*} componentId
  //    */
  //   popToRoot(componentId: string): any;
  //
  //   /**
  //    * Show overlay on top of the window
  //    * @param {*} params
  //    */
  //   showOverlay(params: any): any;
  //
  //   /**
  //    * dismiss overlay by componentId
  //    * @param {string} componentId
  //    */
  //   dismissOverlay(componentId: string): any;
  //
  //   /**
  //    * Obtain the events registry instance
  //    */
  //   events(): any;
  // }
}
