import psycopg2

def queries():

    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="dianas",
        user="dianas",
        password="happy372python")

    cur = conn.cursor()

    sql1 = '''SELECT latitude, longitude FROM cities WHERE city = 'Minneapolis';'''
    
                
    cur.execute(sql1)
    row_list = cur.fetchall()
    if row_list:
        print(row_list)
    else:
        print("Northfield is not in the database")
        
        
        
    sql2 = '''SELECT city
    FROM cities
    WHERE population = (SELECT MAX(population) FROM cities);
    '''
    cur.execute(sql2)
    row_list = cur.fetchall()
    print(row_list)
    
    
    
queries()
