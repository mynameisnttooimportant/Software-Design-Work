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
    
    sql3 = '''
        -- Furthest North
        (SELECT city, 'Furthest North' AS Position
        FROM cities
        WHERE latitude = (SELECT MAX(latitude) FROM cities))

        UNION ALL

        -- Furthest East
        (SELECT city, 'Furthest East' AS Position
        FROM cities
        WHERE longitude = (SELECT MAX(longitude) FROM cities))

        UNION ALL

        -- Furthest South
        (SELECT city, 'Furthest South' AS Position
        FROM cities
        WHERE latitude = (SELECT MIN(latitude) FROM cities))

        UNION ALL

        -- Furthest West
        (SELECT city, 'Furthest West' AS Position
        FROM cities
        WHERE longitude = (SELECT MIN(longitude) FROM cities));
    '''
    
    cur.execute(sql3)
    row_list = cur.fetchall()
    print(row_list)
    
    
    
queries()
