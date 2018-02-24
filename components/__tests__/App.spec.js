import React from 'react';
import { mount, shallow } from 'enzyme';

import App from '../App';
import Todo from '../Todo';
import { TestHelper, sel, setupGlobalObject } from '../../utils/testUtils';

const defaultProps = {};

const helper = new TestHelper(App, defaultProps);

beforeAll(() => {
  setupGlobalObject();
});

const stateMock = {
  todos: [
    { id: 1, text: 'foo', isCompleted: false, listId: 0 },
    { id: 2, text: 'bar', isCompleted: true, listId: 1 }
  ],
  lists: [{ id: 0, title: 'Personal' }, { id: 1, title: 'Movies to watch' }],
  inputValue: '',
  editingId: 0,
  openLists: [0]
};

it('renders correctly', () => {
  const wrapper = helper.mountComponent({}, true);
  expect(wrapper).toMatchSnapshot();
});

it('renders correct amount of todos', () => {
  const wrapper = helper.mountComponent({});
  wrapper.setState(stateMock);
  const todos = wrapper.update().find(sel('todo-checkbox'));

  expect(todos).toHaveLength(
    stateMock.todos.filter(({ listId }) => stateMock.openLists.includes(listId))
      .length
  );
});
