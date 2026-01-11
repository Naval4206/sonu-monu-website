from db import get_db_connection


def get_user_by_phone(phone):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE phone = %s",
        (phone,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user


def create_user(phone, email, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO users (phone, email, password, role)
        VALUES (%s, %s, %s, %s)
        """,
        (phone, email, password, role)
    )

    conn.commit()
    cursor.close()
    conn.close()
