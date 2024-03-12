from flask import Flask, render_template, jsonify, request
import argparse
import psycopg2
import sys


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

    allColumns = get_all_columns(category);
    data = {
        "criteriaOptions" : allColumns["columns"], 
        "criteriaOptions_dataTypes" : allColumns["columnDataTypes"]
    }

    return render_template('category_search_page.html', category=category, data=data)







#returns a dictionary with the column names and data types of each column
def get_all_columns(db):
    conn = connect_to_db()
    cur = conn.cursor()

    sql = "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = %s;"
    cur.execute( sql, [db] )
    data = cur.fetchall();

    columns = []
    columnDataTypes = []

    for column in data:
        columns.append(str(column[0]))
        columnDataTypes.append(str(column[1]))

    return { 
        "columns" : columns,
        "columnDataTypes" : columnDataTypes
    }


# Define a route to handle the request for character information
@app.route('/fetch-category-element-names', methods=['POST'])
def fetch_category_element_names():
    request_data = request.get_json()
    category = request_data.get('fetch_from_category')
    sort_by = request_data.get('sort_by', 'name')  # Default sort criteria
    sort_direction = request_data.get('sort_direction', 'ASC').upper()  # Default sort direction
    
    query = f"SELECT name FROM {category} ORDER BY {sort_by} {sort_direction};"
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(query)
    names = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([name[0] for name in names])







# Define a route to handle the request for element information
@app.route('/element-info', methods=['POST'])
def element_info():
    try:
        # get category and element name from request
        request_data = request.get_json()
        category = request_data.get('fetch_from_category')
        element = request_data.get('fetch_element')

        # Query the database
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM " + category + " WHERE name = '" + element + "'")
        info = cursor.fetchone()
        cursor.close()
        conn.close()

        if info:
            return jsonify(info)

        else:
            return jsonify({'error': 'Element not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500





# Define a route to handle filter checks
@app.route('/check-if-filter-applies', methods=['POST'])
def check_if_filter_applies():
    try:
        # get category and element name from request
        request_data = request.get_json()
        print(request_data)
        category = request_data.get('fetch_from_category')
        element = request_data.get('fetch_element')
        criteria = request_data.get('fetch_by_criteria')

        sqlQuery = "SELECT name FROM " + category + " WHERE name = '" + element + "'"

        for criterion in criteria:
            sqlQuery += " AND "

            searchTerm_criteria = "\""+criterion.get("criteria")+"\""
            searchTerm_criteria_filter = criterion.get("criteria_filter")
            searchTerm_value = criterion.get("value").upper()

            searchQuery = ""

            #sql query depends on types of filters applied
            if(searchTerm_criteria_filter == "filter_real_is"):
                searchQuery = searchTerm_criteria + " = " + searchTerm_value
            elif(searchTerm_criteria_filter == "filter_real_greaterThan"):
                searchQuery = searchTerm_criteria + " > " + searchTerm_value
            elif(searchTerm_criteria_filter == "filter_real_lessThan"):
                searchQuery = searchTerm_criteria + " < " + searchTerm_value
            elif(searchTerm_criteria_filter == "filter_text_is"):
                searchQuery = searchTerm_criteria + " = '" + searchTerm_value + "'"
            elif(searchTerm_criteria_filter == "filter_text_contains"):
                searchQuery = "UPPER(" + searchTerm_criteria + ") LIKE '%" + searchTerm_value + "%'"
            elif(searchTerm_criteria_filter == "filter_text_startsWith"):
                searchQuery = "UPPER(" + searchTerm_criteria + ") LIKE '" + searchTerm_value + "%'"
            elif(searchTerm_criteria_filter == "filter_text_endsWith"):
                searchQuery = "UPPER(" + searchTerm_criteria + ") LIKE '%" + searchTerm_value + "'"

            #adds this part of the query to full sql query
            sqlQuery += searchQuery


        # Query the database
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute(sqlQuery)
        info = cursor.fetchone()
        cursor.close()
        conn.close()

        if info:
            return jsonify({'result' : "true"})

        else:
            return jsonify({'result' : "false"})

    except Exception as e:
        return jsonify({'error': str(e)}), 500





if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('host', help='the host server that this application runs on')
    parser.add_argument('port', help='the port that this application listens on')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True) 
