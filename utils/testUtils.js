import React from "react";
import { mount, shallow } from "enzyme";
import { JSDOM } from "jsdom";

export const sel = id => `[data-test="${id}"]`;

export const setupGlobalObject = () => {
  const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
  const { window } = jsdom;
  global.window = window;
  global.document = window.document;
};

export const TestHelper = class TestHelper {
  constructor(component, defaultProps) {
    this.component = component;
    this.defaultProps = defaultProps;
  }

  mountComponent(props = {}, isShallow = false) {
    const propsToUse = {
      ...this.defaultProps,
      ...props
    };

    if (isShallow) {
      return shallow(React.createElement(this.component, propsToUse));
    }

    return mount(React.createElement(this.component, propsToUse));
  }
};
