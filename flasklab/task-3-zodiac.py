from flask import Flask, request, render_template
from datetime import datetime

app = Flask(__name__)

# Function to determine the zodiac sign
def get_zodiac_sign(day, month):
    if (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorn"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Aquarius"
    elif (month == 2 and day >= 19) or (month == 3 and day <= 20):
        return "Pisces"
    elif (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittarius"

def home():
    if 'birthday' in request.form:  # Check if 'birthday' field is in the form data.
        birthday = request.form['birthday']
        birthday_date = datetime.strptime(birthday, '%Y-%m-%d')
        sign = get_zodiac_sign(birthday_date.day, birthday_date.month)
        return render_template('result.html', sign=sign)
    else:
        return render_template('customindex.html')
    
    
if __name__ == '__main__':
    my_port = 5106
    app.run(host='0.0.0.0', port = my_port) 
