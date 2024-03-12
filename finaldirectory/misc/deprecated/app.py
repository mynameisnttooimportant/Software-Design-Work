from flask import Flask, render_template, jsonify, request
import argparse
import psycopg2


app = Flask(__name__, static_folder='static', template_folder='templates')


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


@app.route('/')
def home():
    return render_template('home_page.html')

@app.route('/search/<category>')
def search_category(category):
    return render_template('category_search_page.html', category=category)


# Define a route to handle the request for character information
@app.route('/characters-info', methods=['POST'])
def characters_info():
    try:
        # Extract species name from request
        request_data = request.get_json()
        characters_name = request_data.get('characters')

        # Query the database for species information
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM characters WHERE name = %s", (characters_name,))
        characters_info = cursor.fetchone()
        cursor.close()
        conn.close()

        if characters_info:
            # If character information is found, return it as JSON
            return jsonify(characters_info)
        else:
            # If species not found, return appropriate response
            return jsonify({'error': 'Character not found'}), 404
    except Exception as e:
        # Handle any exceptions that occur during processing
        return jsonify({'error': str(e)}), 500


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


# Define a route to handle the request for starships information
@app.route('/starships-info', methods=['POST'])
def starships_info():
    try:

        # Extract starships name from request
        request_data = request.get_json()
        starships_name = request_data.get('starships')

        # Query the database for starships information
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM starships WHERE name = %s", (starships_name,))
        starships_info = cursor.fetchone()
        cursor.close()
        conn.close()

        if starships_info:
            # If starships information is found, return it as JSON
            return jsonify(starships_info)
        else:
            # If starships not found, return appropriate response
            return jsonify({'error': 'Starships not found'}), 404
    except Exception as e:
        # Handle any exceptions that occur during processing
        return jsonify({'error': str(e)}), 500


# Define a route to handle the request for vehicles information
@app.route('/vehicles-info', methods=['POST'])
def vehicles_info():
    try:

        # Extract vehicles name from request
        request_data = request.get_json()
        vehicles_name = request_data.get('vehicles')

        # Query the database for starships information
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM vehicles WHERE name = %s", (vehicles_name,))
        vehicles_info = cursor.fetchone()
        cursor.close()
        conn.close()

        if vehicles_info:
            # If vehicles information is found, return it as JSON
            return jsonify(vehicles_info)
        else:
            # If vehicles not found, return appropriate response
            return jsonify({'error': 'Vehicles not found'}), 404
    except Exception as e:
        # Handle any exceptions that occur during processing
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('host', help='the host server that this application runs on')
    parser.add_argument('port', help='the port that this application listens on')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True) 
