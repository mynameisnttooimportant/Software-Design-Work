import flask

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

if __name__ == '__main__':
    my_port = 5106
    app.run(host='0.0.0.0', port = my_port) 
