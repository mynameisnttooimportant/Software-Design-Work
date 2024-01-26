import psycopg2

def create_tables():

    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="dianas",
        user="dianas",
        password="happy372python")

    cur = conn.cursor()

    sql1 = '''DROP TABLE IF EXISTS STATES;
            CREATE TABLE STATES (
            state text,
            abbreviation text
            );'''
            
    sql2 = '''DROP TABLE IF EXISTS CITIES;
            CREATE TABLE CITIES (
            city,
            state text,
            population real,
            latitude real,
            longitute real
            );'''
    
    cur.execute(sql1)
    cur.execute(sql2)
    
    
create_tables()