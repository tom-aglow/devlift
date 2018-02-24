import NewTodo, { styles } from '../NewTodo';
import { TestHelper, sel, setupGlobalObject } from '../../utils/testUtils';
import stateMock from '../../utils/stateMock.json';

const defaultProps = {
  inputValue: stateMock.inputValue,
  lists: stateMock.lists,
  onChange() {},
  onAddItem() {}
};

const helper = new TestHelper(NewTodo, defaultProps);

beforeAll(() => {
  setupGlobalObject();
});

it('renders correctly', () => {
  const wrapper = helper.mountComponent({}, true);
  expect(wrapper).toMatchSnapshot();
});

it('shows and hide list chips when user focus or blur on the input', () => {
  const wrapper = helper.mountComponent({}, true);

  let chips = wrapper.find(sel('list-chip'));
  expect(chips).toHaveLength(0);

  const input = wrapper.find(sel('new-todo-input'));
  input.simulate('focus');
  chips = wrapper.update().find(sel('list-chip'));
  expect(chips).toHaveLength(stateMock.lists.length);

  input.simulate('blur');
  chips = wrapper.update().find(sel('list-chip'));
  expect(chips).toHaveLength(0);
});

it('selects correct list when user clicks on a chip', () => {
  const wrapper = helper.mountComponent({});
  const input = wrapper.find(sel('new-todo-input')).first();
  const chipIndex = 1;
  const listId = stateMock.lists[chipIndex].id;

  input.simulate('focus');

  let chipTwo = wrapper.find(sel('list-chip')).at(chipIndex);
  chipTwo.props().onPress(chipTwo.props().obj.value);

  chipTwo = wrapper
    .update()
    .find(sel('list-chip'))
    .at(chipIndex);

  expect(chipTwo.props().labelWrapStyle).toContain(
    styles.radioButtonWrapperActive
  );
  expect(wrapper.state('listId')).toBe(listId);

  const chipOne = wrapper.find(sel('list-chip')).at(0);
  expect(chipOne.props().labelWrapStyle).not.toContain(
    styles.radioButtonWrapperActive
  );
});
