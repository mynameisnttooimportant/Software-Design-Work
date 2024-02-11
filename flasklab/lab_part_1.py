import flask
import csv

app = flask.Flask(__name__)

# task 1, addition
@app.route('/add/<word1>/<word2>')
def my_addition(word1, word2):
    sumword = int(word1) + int(word2)
    return '<h1 style="color:Red">' + str(sumword) + '</h1>'

# task 2, states
@app.route('/pop/<word1>')
def get_population_by_abbreviation(word1):

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
