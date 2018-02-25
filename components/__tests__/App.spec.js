import App from '../App';
import { TestHelper, sel, setupGlobalObject } from '../../utils/testUtils';
import stateMock from '../../utils/stateMock.json';

const defaultProps = {};

const helper = new TestHelper(App, defaultProps);

const firebase = {};

beforeAll(() => {
  setupGlobalObject();
});

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

it('allows user to edit text', () => {
  const wrapper = helper.mountComponent();
  wrapper.setState(stateMock);
  const todoText = wrapper.find(sel('todo-text'));
  todoText.props().onLongPress();
  // console.log(todoText.props());

  let input = wrapper.update().find(sel('todo-edit-input'));
  expect(input).not.toHaveLength(0);

  // input.at(0).props().onChangeText({value: 'new foo'});
  input = wrapper.update().find(sel('todo-edit-input'));

  // console.log(input.at(1).html());
});
