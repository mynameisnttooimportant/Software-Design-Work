from flask import Flask, render_template, jsonify, request
import psycopg2

app = Flask(__name__)

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
        print(f"Error connecting to database: {e}")
        return None

@app.route('/species')
def species():
    return render_template('species.html')

@app.route('/starships')
def starships():
    return render_template('starships.html')

@app.route('/starships-info', methods=['POST'])
def starships_info():
    try:
        request_data = request.get_json()
        search = request_data.get('search', '')
        min_cargo_capacity = request_data.get('minCargoCapacity', 0)
        max_cargo_capacity = request_data.get('maxCargoCapacity', "Infinity")

        conn = connect_to_db()
        cursor = conn.cursor()

        query = """
        SELECT * FROM starships 
        WHERE name ILIKE %s 
        AND cargo_capacity >= %s
        """
        params = [f"%{search}%", min_cargo_capacity]

        if max_cargo_capacity != "Infinity":
            query += " AND cargo_capacity <= %s"
            params.append(max_cargo_capacity)

        cursor.execute(query, params)
        starships_info = cursor.fetchall()
        cursor.close()
        conn.close()

        starships = [{'name': row[0], 'cargo_capacity': row[1]} for row in starships_info]  # Adjust based on your table structure
        return jsonify(starships)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5106)
