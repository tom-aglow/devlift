import App from "../App";
import Row from "../Row";
import { TestHelper, setupGlobalObject } from "../../utils/testUtils";

const defaultProps = {};

const helper = new TestHelper(App, defaultProps);

beforeAll(() => {
  setupGlobalObject();
});

const items = [
  { id: 1, text: "foo", isCompleted: false },
  { id: 2, text: "bar", isCompleted: true }
];

it("renders correctly", () => {
  const wrapper = helper.mountComponent({}, true);
  expect(wrapper).toMatchSnapshot();
});

it("renders correct amount of todos", () => {
  const wrapper = helper.mountComponent({});
  wrapper.setState({ items });
  const todos = wrapper.find(Row);

  expect(todos).toHaveLength(items.length);
});
