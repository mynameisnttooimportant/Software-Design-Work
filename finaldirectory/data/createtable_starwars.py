# WOOYEOK CHOI (2024.1.24)
# This code is for the python-psql lab in the software design course

import psycopg2

def create_tables():
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="choir",
        user="honga2",
        password="lion587smile"
    )

    cur = conn.cursor()

    sql_commands = [
        """
        CREATE TABLE planets (
            name VARCHAR(255),
            model VARCHAR(255),
            manufacturer VARCHAR(255),
            cost_in_credits INTEGER,
            length INTEGER,
            max_atmosphering_speed INTEGER,
            crew INTEGER,
            passengers INTEGER,
            cargo_capacity INTEGER,
            consumables VARCHAR(255),
            hyperdrive_rating FLOAT,
            MGLT INTEGER,
            startship_class VARCHAR(255)
        )
        """,
        """
        CREATE TABLE species (
            name VARCHAR(255),
            classification VARCHAR(255),
            designation VARCHAR(255),
            average_height INTEGER,
            skin_colors VARCHAR(255),
            hair_colors VARCHAR(255),
            eye_colors VARCHAR(255),
            average_lifespan INTEGER,
            language VARCHAR(255),
            homeworld VARCHAR(255)
        )
        """
    ]

    try:
        for sql in sql_commands:
            cur.execute(sql)

        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    create_tables()

