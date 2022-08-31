import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth, useUser } from "./Context";

const MySwal = withReactContent(Swal);

function AddTodo(props) {
  const { todos, setTodos } = props;
  const [todo, setTodo] = useState('');
  const { token } = useAuth();

  const addTodo = async (todo) => {
    if(todo) {
      const api = 'https://todoo.5xcamp.us/todos';
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append('Content-Type', 'application/json');
      return fetch(api, {
        method: 'POST',
        headers,
        body: JSON.stringify({todo: {content: todo}})
      })
        .then(response => {
          if(response.status === 401) {
            throw new Error('未授權新增');
          }
          return response.json();
        })
        .then(response => {
          return response;
        })
        .catch(error => {
          return MySwal.fire({title: error.message});
        })
    }
  }

  return (
    <>
      <div className="inputBox">
        <input type="text" placeholder="請輸入待辦事項" value={ todo } onChange={(e) => setTodo(e.target.value)}/>
        <a href="#" onClick={async (e) => {
          e.preventDefault();
          let response = await addTodo(todo);
          let {id, content: task } = response; 
          if(id) {
            setTodos([{id, task, done: false}, ...todos]);
            setTodo('');
          }
        }}>
          <FontAwesomeIcon icon="fa fa-plus" />
        </a>
      </div>
    </>
  );
}

function Tabs(props) {
  const { active, setActive } = props;
  const listenTabEvent = (e) => {
    e.preventDefault();
    let activeTab = active;
    if(e.target.text === '全部') activeTab = 'all';
    if(e.target.text === '待完成') activeTab = 'todos';
    if(e.target.text === '已完成') activeTab = 'dones';
    setActive(activeTab);
  } 
  return (
    <>
      <ul className="todoList_tab">
        <li><a href="#" className={`${active === 'all' ? 'active' : ''}`} onClick={listenTabEvent}>全部</a></li>
        <li><a href="#" className={`${active === 'todos' ? 'active' : ''}`} onClick={listenTabEvent}>待完成</a></li>
        <li><a href="#" className={`${active === 'dones' ? 'active' : ''}`} onClick={listenTabEvent}>已完成</a></li>
      </ul>
    </>
  );
}

function TodoList(props) {
  const { todos, setTodos, active } = props;
  const { token } = useAuth();

  const deleteTodo = async (id) => {
    const api = `https://todoo.5xcamp.us/todos/${id}`;
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');
    fetch(api, {
      method: 'DELETE',
      headers,
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log('delete res', response);
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  const toggleDone = async (id) => {
    if(!id) return 
    const api = `https://todoo.5xcamp.us/todos/${id}/toggle`;
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');
    return fetch(api, {
      method: 'PATCH',
      headers,
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  const listTemplate = (item, index) => {
    return (
      <li key={ index }>
        <label className="todoList_label">
          <input className="todoList_input" type="checkbox" checked={ item.done } onChange={async (e) => {
            let response = await toggleDone(item.id);
            if(response.id) {
              let newTodos = todos.map((element) => {
                if(element.id === item.id) element.done = !(element.done);
                return element;
              }); 
              setTodos(newTodos);
            }
          }} />
          <span>{item.task}</span>
        </label>
        <a href="#" onClick={async (e) => {
          e.preventDefault();
          let delTodo = todos.find((element, ind) => ind === index);
          await deleteTodo(delTodo.id);
          let newTodos = todos.filter((element, ind) => ind !== index);
          setTodos(newTodos);
        }}><FontAwesomeIcon icon="fa fa-times" /></a>
      </li>
    );
  }

  return (
    <>
      <div className="todoList_items">
        <ul className="todoList_item">
          {
            todos.map((item, index) => {
              if(active === 'todos' && item.done === false) {
                return listTemplate(item, index);
              }
              if(active === 'dones' && item.done === true) {
                return listTemplate(item, index);
              }
              if(active === 'all') {
                return listTemplate(item, index);
              }
            })
          }
        </ul>
        <Statistics count={ todos.filter(item => item.done === false).length } todos={ todos } setTodos={ setTodos }></Statistics>
      </div>
    </>
  );
}

function Statistics(props) {
  const { count, todos, setTodos } = props;
  const { token } = useAuth();

  const deleteTodo = async (id) => {
    const api = `https://todoo.5xcamp.us/todos/${id}`;
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');
    fetch(api, {
      method: 'DELETE',
      headers,
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log('delete res', response);
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  return (
    <>
      <div className="todoList_statistics">
        <p> {count} 個待完成項目</p>
        <a href="#" onClick={(e) => {
          MySwal.fire({title: '確認刪除所有已完成項目？', confirmButtonText: '確認', showCancelButton: true, cancelButtonText: '取消' })
            .then((result) => {
              if(result.isConfirmed) {
                todos.filter(item => item.done).forEach(async (item) => {
                  await deleteTodo(item.id);
                })
                setTodos(todos.filter(item => !item.done));
              }
            })
        }}>清除已完成項目</a>
      </div>
    </>
  );
}

const Logout = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    const api = 'https://todoo.5xcamp.us/users/sign_out'
    let headers = new Headers();
    headers.append('Authorization', token);
    fetch(api, {
      method: 'DELETE',
      headers,
    })
      .then(response => {
        if(response.status === 401) {
          throw new Error('登出失敗，請洽管理員');
        }
        setToken(null);
        return response.json();
      })
      .then(response => {
        navigate('/login');
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  return (
    <li><a href="#" onClick={logout}>登出</a></li>
  );
}

function Todo() {
  const [active, setActive] = useState('all');
  const [todos, setTodos] = useState([]);
  const { user } = useUser();

  const { token } = useAuth();

  const getTodos = () => {
    const api = 'https://todoo.5xcamp.us/todos';
    let headers = new Headers();
    headers.append('Authorization', token);
    return fetch(api, {
      method: 'GET',
      headers,
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        console.log(response)
        let mapTodos = response.todos.map(item => {
          let {id, content, completed_at} = item;
          return {id, task: content, done: Boolean(completed_at)}
        });
        setTodos(mapTodos);
      })
  }

  useEffect(() => getTodos, []);

  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1><a href="#">ONLINE TODO LIST</a></h1>
          <ul>
            <li className="todo_sm"><a href="#"><span>{user}的代辦</span></a></li>
            <Logout></Logout>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <AddTodo todos={ todos } setTodos={ setTodos }></AddTodo>
            {
              todos.length === 0 
              &&
              <>
                <p className="info">目前尚無待辦事項</p>
                <img src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt=""></img>
              </>
            }
            {
              todos.length !== 0 
              &&
              <div className="todoList_list">
                <Tabs active={ active } setActive={ setActive }></Tabs>
                <TodoList todos={ todos } setTodos={ setTodos } active={ active }></TodoList>              
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;