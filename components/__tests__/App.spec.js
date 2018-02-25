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

describe('firebase app', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = helper.mountComponent({});
  });

  afterEach(() => {
    wrapper
      .update()
      .instance()
      .firebaseDb.goOffline();
  });

  it('renders correct amount of todos', () => {
    wrapper.setState(stateMock);
    const todos = wrapper.update().find(sel('todo-checkbox'));

    expect(todos).toHaveLength(
      stateMock.todos.filter(({ listId }) =>
        stateMock.openLists.includes(listId)
      ).length
    );
  });

  it('allows user to edit text', () => {
    wrapper.setState(stateMock);
    const NEW_TEXT = 'baz';

    let todoText = wrapper.find(sel('todo-text'));

    //  open input to edit todo text
    todoText.props().onLongPress();
    let input = wrapper.update().find(sel('todo-edit-input'));
    expect(input).not.toHaveLength(0);

    //  change text and blur input
    input
      .first()
      .props()
      .onChangeText(NEW_TEXT);
    input = wrapper.update().find(sel('todo-edit-input'));
    input
      .first()
      .props()
      .onBlur();
    input = wrapper.update().find(sel('todo-edit-input'));
    expect(input).toHaveLength(0);

    //  check new text of the todo
    todoText = wrapper.find(sel('todo-text'));
    expect(todoText.text()).toBe(NEW_TEXT);
  });
});
