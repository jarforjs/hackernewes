function TodoList({ todos, isLoadingTodos }) {
  if (isLoadingTodos){
    return (
      <div>
        <p>Loading todos...</p>
      </div>
    )
  }

  if (!todos){
    return null;
  }

  if (!todos.length){
    return (
      <div>
        <p>You have no todos.</p>
      </div>
    )
  }

  return (
    <div>
      {
				todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)
			}
    </div>
  )
}
