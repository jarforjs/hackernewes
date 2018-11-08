import { compose } from 'recomponse';

const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
	isLoadingTodos ? <p>Loading todos ...</p> : <Component { ...others } />

const withCondition = (conditionalRenderingFn) => (Component) => (props) =>
	conditionalRenderingFn(props) ? null : <Component { ...props } />

const conditioinFn = (props) => !props.todos;

const withTodosEmpty = (Component) => (props) =>
	!props.todos.length ? <p>You have no Todos.</p> : <Component { ...props } />

const TodoList = ({ todos }) =>
	<div>{todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)}</div>

const withConditionalRenderings = compose(
	withLoadingIndicator,
	withCondition(conditioinFn),
	withTodosEmpty
)

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

const App = (props) =>
	<TodoListWithConditionalRendering todos={props.todos} isLoadingTodos={props.isLoadingTodos} />