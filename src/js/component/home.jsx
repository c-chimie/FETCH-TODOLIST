import React, { useState, useEffect } from "react";
import { render } from "react-dom";

//create component
const Home = () => {
  // use state bc tasks are constantly changing
  const [tasks, setTasks] = useState([]);

  // add state to my input
  const [input, setInput] = useState("");

  function postTasks() {
    //FETCH USING POST METHOD (Creates a new todo list of a particular user)

    var raw = JSON.stringify([]);

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        },
      body: raw,
    };

    fetch(
      "https://assets.breatheco.de/apis/fake/todos/user/concetta",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  function putTasks(todo) {
    //FETCH USING PUT METHOD (Update the entire list of todo's of a particular user)
console.log("todo", todo)


var raw = JSON.stringify(todo);

var requestOptions = {
  method: 'PUT',
  body: raw,
  headers: {
    "Content-Type": "application/json"
    }
};

fetch("https://assets.breatheco.de/apis/fake/todos/user/concetta", requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    getTasks();
  })
  .catch(error => console.log('error', error));
  }

  function getTasks() {
    //FETCH USING GET METHOD (Get list of todo's for a particular user)

    //Does not use a body since it is just getting
    var raw = "";

    var requestOptions = {
      method: 'GET',
      // body: raw,
      headers: {
      "Content-Type": "application/json"
      }
    };
    
    fetch("https://assets.breatheco.de/apis/fake/todos/user/concetta", requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log("this is result", result);
        console.log("this is data", data)
        // setTasks(data);
      })
      .catch(error => {
        console.log('error', error); 
        postTasks();});
  }

  function ClearAllTasksAndUser() {
    //DELETE to remove user and all contents
    //Only then would you have to POST again after
    setTasks([]);
    
    var raw = "";

    var requestOptions = {
      method: 'DELETE',
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://assets.breatheco.de/apis/fake/todos/user/concetta", requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log('error', error));
  }

  // when the form is submitted, this is what happens (a task is added)
  const addTask = (event) => {
    event.preventDefault();

    if (input != "") {
      const newTask = {
        label: input,
        done: false
      }; // if input is empty, do not let user submit

      setTasks([...tasks, newTask]); // add the user input to the state (use spread operator to copy existing array of tasks)

      setInput(""); // make the input box appear empty again after the user submits
      console.log("task", tasks)
      putTasks(tasks); //Calling the function that PUT is in
    }
  };

  // delete tasks
  const deleteTask = (label) => {
    let filteredTasks = tasks.filter((myTodo) => {
      console.log("label", label)
      // console.log("tasks.indexOf(myTodo)", tasks.indexOf(myTodo))
      return myTodo.label != label
    });
    
    setTasks(filteredTasks);
    console.log("filteredTasks", filteredTasks)
    console.log("tasks", tasks)
    var raw = JSON.stringify(filteredTasks);
    
    var requestOptions = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
        },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://assets.breatheco.de/apis/fake/todos/user/concetta", requestOptions)
      .then(response => response.json())
      .then(data => {console.log("deleteTask data", data)
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {getTasks()}, []);

  return (
    <div className="container">
      <h1 className="todos">todos</h1>
      <div className="list-card">
        <form onSubmit={addTask}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="input-box"
            placeholder="What needs to be done?"
            type="text"
          />
        </form>

        {/* use .map to display submitted text inputs */}
        <div className="list-item">
          {tasks.map((task) => {
            console.log("task", task)
            return (
            <div className="todo" key={task.label}>
              <p>
                {task.label}
                <button className="button" onClick={() => deleteTask(task.label)}>
                  &#10060;
                </button>
              </p>
            </div>
          )})}
          <p className="counter">
            {" "}
            {tasks.length === 1 ? "1 task left" : `${tasks.length} tasks left`}
          </p>
        </div>
      </div>
      <button className="clear-button" onClick={ClearAllTasksAndUser}>Clear All</button>
    </div>
  );
};

export default Home;