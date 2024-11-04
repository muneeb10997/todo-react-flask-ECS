from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

# CORS Configuration
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = '10.0.2.89'  # Replace with your database host
app.config['MYSQL_USER'] = 'todo_user'  # Replace with your database user
app.config['MYSQL_PASSWORD'] = 'Muneeb@1122'  # Replace with your database password
app.config['MYSQL_DB'] = 'todo_database'  # Use the newly created database

mysql = MySQL(app)

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200


# Get all todos
@app.route('/todos', methods=['GET'])
def get_todos():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, title, description FROM todos")  # Exclude 'completed' from the query
        results = cur.fetchall()
        todos = [{'id': row[0], 'title': row[1], 'description': row[2]} for row in results]  # Exclude 'completed' from response
        cur.close()
        return jsonify(todos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get the maximum ID
@app.route('/todos/max-id', methods=['GET'])
def get_max_id():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT MAX(id) AS maxId FROM todos")
        result = cur.fetchone()
        max_id = result[0] if result[0] is not None else 0
        cur.close()
        return jsonify({'maxId': max_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new todo
@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()  # Get JSON data from the request
    if not data or 'title' not in data or 'description' not in data:
        return jsonify({'error': 'Title and description are required'}), 400

    try:
        # Get the current maximum ID to calculate the new ID
        cur = mysql.connection.cursor()
        cur.execute("SELECT MAX(id) AS maxId FROM todos")
        result = cur.fetchone()
        new_id = (result[0] + 1) if result[0] is not None else 1  # Start from 1 if no todos exist

        # Insert the title and description into the database with the new ID
        cur.execute("INSERT INTO todos (id, title, description) VALUES (%s, %s, %s)", 
                    (new_id, data['title'], data['description']))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Todo added', 'id': new_id, 'title': data['title'], 'description': data['description']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update a todo by ID
@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    if not data or 'title' not in data or 'description' not in data:
        return jsonify({'error': 'Title and description are required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE todos SET title = %s, description = %s WHERE id = %s", 
                    (data['title'], data['description'], todo_id))  # Remove 'completed'
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Todo updated'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a todo by ID
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
        mysql.connection.commit()
        cur.close()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
