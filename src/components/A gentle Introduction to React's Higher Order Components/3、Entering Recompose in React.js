import { compose } from 'recompose';

const withTodosNull = Component => props => !props.todos ? null : <Component {...props} />

const withTodosEmpty = Component => props => !props.todos.length ? <div><p>You have no Todos.</p></div> : <Component {...props} />

const withLoadingIndicator = Component => ({ isLoadingTodos, ...others }) => isLoadingTodos ? <div><p>Loading todos ...</p></div> : <Component {...others} />

function TodoList({ todos }) {
  return (
    <div>
      {
				todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)
			}
    </div>
  )
}

const withConditionalRenderings = compose(
  withLoadingIndicator,
  withTodosNull,
  withTodosEmpty
);

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

function App(props) {
  return (
    <TodoListWithConditionalRendering todos={props.todos} isLoadingTodos={props.isLoadingTodos} />
  );
}
