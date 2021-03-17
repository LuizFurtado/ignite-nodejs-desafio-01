// @ts-nocheck
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [
//   {
//     id: "f03b8c0a-9c95-4933-9ad1-2ebc800a8682",
//     name: "John Doe",
//     username: "jdoe",
//     todos: [{
//       id: "ebcc4b5b-24c1-4471-9ec3-46c5bd6100470",
//       title: "My one todo",
//       dealine: "2021-03-19T00:00:00.000Z",
//       created_at: "2021-03-16T00:00:00.000Z",
//       done: false
//     }]
//   },
//   {
//     id: "33a97198-8ca5-4660-bb91-505cfec933ee",
//     name: "Jane Doe",
//     username: "thejane",
//     todos: [{
//       id: "bb21eae7-e82e-426c-9912-c0383f9a53c7",
//       title: "Either another todo",
//       dealine: "2021-03-19T00:00:00.000Z",
//       created_at: "2021-03-16T00:00:00.000Z",
//       done: false
//     }]
//   }
// ];

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user)
    return response.status(400).json({ error: "User not found!" })

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userAlreadyExist = users.some(user => user.username === username);

  if (userAlreadyExist)
    return response.status(400).json({ error: "Username already taken" });

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  });

  return response.status(201).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    deadline,
    created_at: new Date(),
    done: false
  }

  user.todos.push(newTodo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const existTodo = user.todos.find(todo => todo.id === id);

  if (!existTodo)
    return response.status(400).json({ error: "Todo does not exist" })

  existTodo.title = title;
  existTodo.deadline = deadline;

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const existTodo = user.todos.find(todo => todo.id === id)

  if (!existTodo)
    return response.status(400).json({ error: "Todo does not exist" })

  existTodo.done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  user.todos.splice(id, 1);

  return response.status(200).send();
});

module.exports = app;