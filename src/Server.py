from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask and configure SQLite database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Enable CORS
CORS(app)

# Define a model for storing strings
class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)

# Route to create tables before any request (or use before_request instead of before_first_request)
@app.before_request
def create_tables():
    db.create_all()

# Route to get all data
@app.route('/data', methods=['GET'])
def get_data():
    all_data = Data.query.all()
    return jsonify([{'id': data.id, 'content': data.content} for data in all_data])

# Route to add new data
@app.route('/data', methods=['POST'])
def add_data():
    content = request.json.get('content')
    if not content:
        return jsonify({'error': 'Content is required'}), 400

    new_data = Data(content=content)
    db.session.add(new_data)
    db.session.commit()

    return jsonify({'id': new_data.id, 'content': new_data.content}), 201

if __name__ == '__main__':
    app.run(debug=True)
