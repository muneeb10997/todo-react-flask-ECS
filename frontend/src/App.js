import React, { useState, useEffect } from 'react';
 
function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const backendUrl = 'http://backend-alb-1936166341.us-east-2.elb.amazonaws.com/todos';  // Backend server URL through ALB

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await fetch(backendUrl);
        const todos = await response.json();
        setTodos(todos);
    };

    const addTodo = async () => {
        const maxResponse = await fetch(`${backendUrl}/max-id`);
        const maxIdData = await maxResponse.json();
        const maxId = maxIdData.maxId || 0;
        const newId = maxId + 1;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: newId, title, description }),
        });

        if (response.ok) {
            setTitle('');
            setDescription('');
            fetchTodos();  // Refresh the todo list
        } else {
            const error = await response.json();
            alert(error.error);
        }
    };

    const updateTodo = async (id, currentTitle, currentDescription) => {
        const newTitle = prompt("Enter new title:", currentTitle);
        const newDescription = prompt("Enter new description:", currentDescription);

        if (newTitle) {
            await fetch(`${backendUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle, description: newDescription }),
            });
            fetchTodos();  // Refresh the todo list
        }
    };

    const deleteTodo = async (id) => {
        await fetch(`${backendUrl}/${id}`, {
            method: 'DELETE',
        });
        fetchTodos();  // Refresh the todo list
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
            <h1 style={{ textAlign: 'center' }}>My To-Do App</h1>

            <div id="todo-form" style={{
                maxWidth: '600px',
                margin: '20px auto',
                padding: '10px',
                background: 'white',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2>Add Todo</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                    style={{
                        width: 'calc(100% - 20px)',
                        padding: '10px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows="3"
                    style={{
                        width: 'calc(100% - 20px)',
                        padding: '10px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                ></textarea>
                <button
                    onClick={addTodo}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                    Add Todo
                </button>
            </div>

            <div id="todo-list" style={{
                maxWidth: '600px',
                margin: '20px auto',
                padding: '10px',
                background: 'white',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2>My Todos</h2>
                <button onClick={fetchTodos}>See All Todos</button>
                <table id="todos-table" style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px'
                }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>ID</th>
                            <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Title</th>
                            <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Description</th>
                            <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo) => (
                            <tr key={todo.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{todo.id}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{todo.title}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{todo.description}</td>
                                <td className="actions" style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => updateTodo(todo.id, todo.title, todo.description)}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
