import App from '../App';
import { TestHelper, sel, setupGlobalObject } from '../../utils/testUtils';
import stateMock from '../../utils/stateMock.json';

const defaultProps = {};

const helper = new TestHelper(App, defaultProps);

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
