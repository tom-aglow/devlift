import Todo from '../Todo';
import { TestHelper, sel, setupGlobalObject } from '../../utils/testUtils';
import stateMock from '../../utils/stateMock.json';

const INDEX = 0;

const defaultProps = {
  ...stateMock.todos[INDEX],
  isEditing: false,
  onToggle() {},
  onEditToggle() {},
  onUpdate() {},
  onBlur() {},
  onDelete() {}
};

const helper = new TestHelper(Todo, defaultProps);

beforeAll(() => {
  setupGlobalObject();
});

it('renders correctly', () => {
  const wrapper = helper.mountComponent({}, true);
  expect(wrapper).toMatchSnapshot();
});

it('shows remove button if task is completed', () => {
  const wrapper = helper.mountComponent({ isCompleted: true }, true);
  const removeBtn = wrapper.find(sel('remove-todo-btn'));

  expect(removeBtn).toHaveLength(1);
});

it('does not show remove button if task is not completed', () => {
  const wrapper = helper.mountComponent({ isCompleted: false }, true);
  const removeBtn = wrapper.find(sel('remove-todo-btn'));

  expect(removeBtn).toHaveLength(0);
});

it('renders todo text when state is not editing', () => {
  const wrapper = helper.mountComponent({ isEditing: false }, true);
  const todoHtml = wrapper.find(sel('todo-text')).html();

  expect(todoHtml).toContain(stateMock.todos[INDEX].text);
});

it('renders input when state is editing', () => {
  const wrapper = helper.mountComponent({ isEditing: true }, true);
  const input = wrapper.find(sel('todo-edit-input'));

  expect(input).toHaveLength(1);
});

it('hides remove button in editing mode', () => {
  const wrapper = helper.mountComponent({ isEditing: true }, true);
  const removeBtn = wrapper.find(sel('remove-todo-btn'));

  expect(removeBtn).toHaveLength(0);
});

it('does not allow edit completed items', () => {
  const onEditToggle = jest.fn();
  const wrapper = helper.mountComponent(
    { isCompleted: true, onEditToggle },
    true
  );
  const todoText = wrapper.find(sel('todo-text'));
  todoText.props().onLongPress();

  expect(onEditToggle).toHaveBeenCalledTimes(0);
});
