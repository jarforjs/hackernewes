const withLoadingIndicator = Component => ({ isLoadingTodos, ...others }) => isLoadingTodos ? <div><p>Loading todos ...</p></div> : <Component {...others} />

const withTodosNull = Component => props => !props.todos ? null : <Component {...props} />

const withTodosEmpty = Component => props => !props.todos.length ? <div><p>You have no Todos.</p></div> : <Component {...props} />

function TodoList({ todos }) {
  return (
    <div>
      {
				todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)
			}
    </div>
  )
}

// const TodoListOne = withTodosEmpty(TodoList);
// const TodoListTwo = withTodosNull(TodoListOne);
// const TodoListThree = withLoadingIndicator(TodoListTwo);
const TodoListWithConditionalRendering = withLoadingIndicator(withTodosNull(withTodosEmpty(TodoList)));

function App(props) {
  return (
    <TodoListWithConditionalRendering todos={props.todos} isLoadingTodos={props.isLoadingTodos} />
  );
}
