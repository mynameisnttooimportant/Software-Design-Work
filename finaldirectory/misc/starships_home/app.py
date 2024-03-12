from flask import Flask, render_template, jsonify, request
import psycopg2

app = Flask(__name__)

# Define a function to establish connection to PostgreSQL
def connect_to_db():
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            dbname="honga2",
            user="honga2",
            password="lion587smile"
        )
        print("Database connection established successfully")
        return conn
    except Exception as e:
        print("Error connecting to database:", e)

# Define routes
@app.route('/')
def index():
    return render_template('index.html')

# Define a route to handle the request for species information
@app.route('/species-info', methods=['POST'])
def species_info():
    try:

        # Extract species name from request
        request_data = request.get_json()
        species_name = request_data.get('species')

        # Query the database for species information
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM species WHERE name = %s", (species_name,))
        species_info = cursor.fetchone()
        cursor.close()
        conn.close()

        if species_info:
            # If species information is found, return it as JSON
            return jsonify(species_info)
        else:
            # If species not found, return appropriate response
            return jsonify({'error': 'Species not found'}), 404
    except Exception as e:
        # Handle any exceptions that occur during processing
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    my_port = 5123
    app.run(host='0.0.0.0', port = my_port)
