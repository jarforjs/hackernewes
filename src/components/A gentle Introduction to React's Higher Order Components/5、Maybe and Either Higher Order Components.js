import { compose } from 'recomponse';

const LoadingIndicator = () =>
	<p>Loading todos ...</p>

const EmptyMessage = () =>
	<p>You have no Todos.</p>

const conditioinFn = (props) => !props.todos;

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) => {
	conditionalRenderingFn(props) ? <EitherComponent /> : <Component { ...props } />
}

const withMaybe = (conditionalRenderingFn) => (Component) => (props) =>
	conditionalRenderingFn(props) ? null : <Component { ...props } />

const isLoadingConditionFn = (props) => props.isLoadingTodos;
const isEmptyConditionFn = (props) => !props.todos.length;

const TodoList = ({ todos }) =>
	<div>{todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)}</div>
	
const withConditionalRenderings = compose(
	withEither(isLoadingConditionFn, LoadingIndicator),
	withMaybe(conditioinFn),
	withEither(isEmptyConditionFn, EmptyMessage)
)

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

const App = (props) =>
	<TodoListWithConditionalRendering todos={props.todos} isLoadingTodos={props.isLoadingTodos} />