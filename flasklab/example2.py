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
    pops_filename = 'pops.csv'

    with open(pops_filename, newline='') as pops_file:
        pops_reader = csv.reader(pops_file)
        for row in pops_reader:
            if row[0].lower() == word1.lower():
                return '<h1 style="color:Red">' +str(row[2])+'</h1>'  # Return the population if found

    return '<h1 style="color:Red">' + 'Population not found.' + '</h1>'


if __name__ == '__main__':
    my_port = 5106
    app.run(host='0.0.0.0', port = my_port) 
