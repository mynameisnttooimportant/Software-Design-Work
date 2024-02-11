import flask
import csv

app = flask.Flask(__name__)

#
@app.route('/hello')
def my_function():
    return "Hello World!"

@app.route('/display/<word1>/<word2>')
def my_display(word1, word2):
    the_string = "The words are: " + word1 + " and " + word2;
    return the_string

@app.route('/color/<word1>')
def my_color(word1):
    return '<h1 style="color:Red">' + word1 + '</h1>'

@app.route('/add/<word1>/<word2>')
def my_addition(word1, word2):
    sumword = int(word1) + int(word2)
    return '<h1 style="color:Red">' + str(sumword) + '</h1>'

@app.route('/pop/<word1>')
def get_population_by_abbreviation(word1):
    # Define the filenames for both CSV files
    states_filename = 'states.csv'
    pops_filename = 'pops.csv'
    
    # Initialize state name as None
    state_name = None

    # First, find the state name from the abbreviation
    with open(states_filename, newline='') as states_file:
        states_reader = csv.reader(states_file)
        for row in states_reader:
            if row[1].lower() == word1.lower():
                state_name = row[0]
                break  # Stop searching once the state name is found

    # If the state name was found, look up the population
    if state_name:
        with open(pops_filename, newline='') as pops_file:
            pops_reader = csv.reader(pops_file)
            for row in pops_reader:
                if row[1].lower() == state_name.lower():
                    return str(row[2])  # Return the population if found

    # Return appropriate messages if not found
    if not state_name:
        return "State not found."
    else:
        return "Population not found."


if __name__ == '__main__':
    my_port = 5106
    app.run(host='0.0.0.0', port = my_port) 
