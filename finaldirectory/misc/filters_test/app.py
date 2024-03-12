from flask import *
import psycopg2

app = Flask(__name__)


#returns connection to database
def connect():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="honga2",
        user="bremerj",
        password="tree288cow")


#returns a dictionary with the column names and data types of each column
def get_all_columns(db):
    conn = connect()
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


#redirects from index to filter 
@app.route('/')
def index():
    return redirect(url_for("filters_test", category="starships"))


#loads main filtering page, with criteria options and datatypes
@app.route('/filter/<category>')
def filters_test(category):
    allColumns = get_all_columns(category);
    data = {
        "criteriaOptions" : allColumns["columns"], 
        "criteriaOptions_dataTypes" : allColumns["columnDataTypes"]
    }

    return render_template("filters_test.html", data=data, category=category)


#search page for filter - "search" variable is all of the criteria/filtering types/values seperated by ampersands
@app.route('/filter/<category>/search/<search>')
def filters_test_search(category,search):
    searchTerms = search.split("&")

    if(len(searchTerms) % 3 != 0):
        return "WRONG NUMBER OF TERMS"; #if there are the wrong number of search terms, something has gone wrong / user error

    sqlQuery = "SELECT name FROM " + category + " WHERE "

    for i in range(0,len(searchTerms),3):
        if(i != 0):
            sqlQuery += " AND "

        searchTerm_criteria = "\""+searchTerms[i]+"\""
        searchTerm_criteria_filter = searchTerms[i+1]
        searchTerm_value = searchTerms[i+2].upper()

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

    sqlQuery += ";"

    conn = connect()
    cur = conn.cursor()

    cur.execute( sqlQuery )
    data = cur.fetchall()

    return str(data)

if __name__ == '__main__':
    my_port = 5122
    app.run(host='0.0.0.0', port = my_port) 
