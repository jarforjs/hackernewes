//对TodoList的改造
// function TodoList({ todos, isLoadingTodos }) {
// 	//1
// 	// if(!todos){
// 	// 	return null;
// 	// }
	
// 	//2
// 	// if(!todos.length){
// 	// 	return (
// 	// 		<div>
// 	// 			<p>You have no todos.</p>
// 	// 		</div>
// 	// 	)
// 	// }
	
// 	//3
// 	// if(isLoadingTodos){
// 	// 	return (
// 	// 		<div>
// 	// 			<p>Loading todos...</p>
// 	// 		</div>
// 	// 	)
// 	// }

// 	return (
// 		<div>
// 			{
// 				todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)
// 			}
// 		</div>
// 	)
// }

//1去掉上面代码中对null的处理
// function withTodosNull(Component) {
// 	return function(props){
// 		return !props.todos ? null :<Component { ...props } />
// 	}
// }
//对null的处理转为箭头写法
const withTodosNull = (Component) => (props) =>
	!props.todos ? null :<Component { ...props } />

//2对Empty的处理
const withTodosEmpty = (Component) => (props) =>
	!props.todos.length ? <p>You have no Todos.</p> : <Component { ...props } />

//3对Loading的处理
const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others}) =>
	isLoadingTodos ? <p>Loading todos ...</p> : <Component { ...others } />

//4对TodoLlist的改造
function TodoList({ todos }) {
	return (
		<div>
			{
				todos.map(todo => <TodoItem key={todo.id} todo={todoo} />)
			}
		</div>
	)
}

// //a.让4结合1,把Component传给1
// const TodoListWithNull = withTodosNull(TodoList);
// //b.让4结合1,把todos传给1
// function App(props){
// 	return (
// 		<TodoListWithNull todos={props.todos} />
// 	)
// }

//将4结合1，2，3
//5
// const TodoListOne = withTodosEmpty(TodoList);
// const TodoListTwo = withTodosNull(TodoListOne);
// const TodoListThree = withLoadingIndicator(TodoListTwo);

// function App(props){
// 	return (
// 		<TodoListThree todos={props.todos} isLoadingTodos={props.isLoadingTodos} />
// 	)
// }

// //其实上面的将4结合1，2，3同等于下面的代码
// const TodoListWithConditionalRendering = withLoadingIndicator(withTodosNull(withTodosEmpty(TodoList)));

//但是这样不具可读性，react具备函数式编程思想，为什么我们不实用这些呢？
//小的高阶组件库内置很多高阶组件，你可以重复使用他们
import { compose } from 'recomponse';
const withConditionalRenderings = compose(
	withLoadingIndicator,
	withTodosNull,
	withTodosEmpty
)
const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

//5重构之后
function App(props){
	return (
		<TodoListWithConditionalRendering todos={props.todos} isLoadingTodos={props.isLoadingTodos} />
	)
}

//6抽象高阶组件的可重用性
//先对withTodoNull做抽象
// const withTodosNull = (Component) => (props) =>
// 	!props.todos ? null :<Component { ...props } />

const withCondition = (Component, conditionalRenderingFn) => (props) =>
	conditionalRenderingFn(props) ? null :<Component { ...props } />

const conditioinFn = (props) => !props.todos;

const TodoListWithCondition = withCondition(TodoList, conditioinFn);