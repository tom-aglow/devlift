import App from '../App';
import Todo from '../Todo';
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
    wrapper.setState(stateMock);
  });

  afterEach(() => {
    wrapper
      .update()
      .instance()
      .firebaseDb.goOffline();
  });

  it('renders correct amount of todos', () => {
    const todos = wrapper.update().find(Todo);

    expect(todos).toHaveLength(
      stateMock.todos.filter(({ listId }) =>
        stateMock.openLists.includes(listId)
      ).length
    );
  });

  it('allows user to edit text', () => {
    const INDEX = 0;
    const NEW_TEXT = 'baz baz baz';

    let todoText = wrapper
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-text'));

    //  open input to edit todo text
    todoText.props().onLongPress();
    let input = wrapper
      .update()
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-edit-input'));
    expect(input).not.toHaveLength(0);

    //  change text and blur input
    input
      .first()
      .props()
      .onChangeText(NEW_TEXT);
    input
      .first()
      .props()
      .onBlur();
    input = wrapper
      .update()
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-edit-input'));
    expect(input).toHaveLength(0);

    //  check new text of the todo
    todoText = wrapper
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-text'));
    expect(todoText.text()).toBe(NEW_TEXT);
  });

  it('allows user to toggle todo completion status', () => {
    const INDEX = 0;
    const INITIAL_CHECKBOX_STATE = stateMock.todos[INDEX].isCompleted;

    let checkBox = wrapper
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-checkbox'));
    expect(checkBox.props().isChecked).toBe(INITIAL_CHECKBOX_STATE);

    checkBox.props().onClick();
    checkBox = wrapper
      .update()
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-checkbox'));
    expect(checkBox.props().isChecked).toBe(!INITIAL_CHECKBOX_STATE);

    checkBox.props().onClick();
    checkBox = wrapper
      .update()
      .find(Todo)
      .at(INDEX)
      .find(sel('todo-checkbox'));
    expect(checkBox.props().isChecked).toBe(INITIAL_CHECKBOX_STATE);
  });

  it('allows user to delete completed tasks', () => {
    const INDEX = 1;
    const todosLength = wrapper.find(Todo).length;
    expect(stateMock.todos[INDEX].isCompleted).toBe(true);

    let removeBtn = wrapper
      .find(Todo)
      .at(INDEX)
      .find(sel('remove-todo-btn'));
    removeBtn.props().onPress();

    const newTodosLength = wrapper.update().find(Todo).length;
    expect(newTodosLength).toBe(todosLength - 1);
  });
});
