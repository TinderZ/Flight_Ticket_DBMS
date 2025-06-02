'''
Author: Zhurun Zhang
Date: 2025-06-02 10:24:06
LastEditors: Zhurun Zhang
LastEditTime: 2025-06-02 16:26:41
FilePath: \Flight_ticket_DBMS\app.py
Description: Always happy to chat! Reach out via email < b23042510@njupt.edu.cn or 2857895300@qq.com >

'''
from flask import Flask, render_template, request, redirect, url_for, session
import mysql.connector
from mysql.connector import Error
import hashlib
import os
from datetime import timedelta

app = Flask(__name__)
# 更安全的密钥配置：优先使用环境变量，否则使用安全的默认值
app.secret_key = os.environ.get('SECRET_KEY', '4fdff253e26833f416d9116dbf692adb01d82db3a89f81b82945e1ecb33b5928')

# Database configuration (replace with your MySQL credentials)
db_config = {
    'host': 'localhost',
    'database': 'civil_aviation_db',
    'user': 'B23042510',  
    'password': 'zzrydyjy!' 
}

# Function to establish database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return None

# Function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Users WHERE Username = %s", (username,))
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            if user and user['PasswordHash'] == hash_password(password):
                session['user_id'] = user['UserID']
                session['role'] = user['Role']
                return redirect(url_for('home'))
            else:
                return "Invalid username or password"
    return render_template('login.html')

# Register route (for admin setup)
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            try:
                cursor.execute("INSERT INTO Users (Username, PasswordHash, Role) VALUES (%s, %s, 'admin')",
                               (username, hash_password(password)))
                connection.commit()
                return redirect(url_for('login'))
            except mysql.connector.IntegrityError:
                return "Username already exists"
            finally:
                cursor.close()
                connection.close()
    return render_template('register.html')

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# Home route
@app.route('/')
def home():
    if 'user_id' in session and session['role'] == 'admin':
        return render_template('home.html')
    else:
        # 普通用户或未登录用户重定向到查询航班页面
        return redirect(url_for('query_flights'))

# Manage flights (admin only)
@app.route('/manage_flights')
def manage_flights():
    if 'user_id' not in session or session['role'] != 'admin':
        return "Unauthorized", 403
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT f.*, a.AirlineName 
            FROM Flights f 
            LEFT JOIN Airlines a ON f.AirlineID = a.AirlineID
        """)
        flights = cursor.fetchall()
        cursor.close()
        connection.close()
        return render_template('manage_flights.html', flights=flights)
    return "Database connection error", 500

# Add flight (admin only)
@app.route('/add_flight', methods=['GET', 'POST'])
def add_flight():
    if 'user_id' not in session or session['role'] != 'admin':
        return "Unauthorized", 403
    if request.method == 'POST':
        flight_number = request.form['flight_number']
        origin = request.form['origin']
        destination = request.form['destination']
        flight_date = request.form['flight_date']
        departure_time = request.form['departure_time']
        arrival_time = request.form['arrival_time']
        price = request.form['price']
        discounted_tickets = request.form['discounted_tickets']
        total_seats = request.form['total_seats']
        airline_id = request.form['airline_id'] if request.form['airline_id'] else None
        remaining_seats = total_seats
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            try:
                cursor.execute("""
                    INSERT INTO Flights (FlightNumber, Origin, Destination, FlightDate, DepartureTime, ArrivalTime, 
                                        Price, DiscountedTickets, TotalSeats, RemainingSeats, AirlineID)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (flight_number, origin, destination, flight_date, departure_time, arrival_time, price, 
                      discounted_tickets, total_seats, remaining_seats, airline_id))
                connection.commit()
                return redirect(url_for('manage_flights'))
            except mysql.connector.Error as e:
                return f"Error adding flight: {e}"
            finally:
                cursor.close()
                connection.close()
    return render_template('add_flight.html')

# Edit flight (admin only)
@app.route('/edit_flight/<int:flight_id>', methods=['GET', 'POST'])
def edit_flight(flight_id):
    if 'user_id' not in session or session['role'] != 'admin':
        return "Unauthorized", 403
    connection = get_db_connection()
    if not connection:
        return "Database connection error", 500
    if request.method == 'POST':
        flight_number = request.form['flight_number']
        origin = request.form['origin']
        destination = request.form['destination']
        flight_date = request.form['flight_date']
        departure_time = request.form['departure_time']
        arrival_time = request.form['arrival_time']
        price = request.form['price']
        discounted_tickets = request.form['discounted_tickets']
        total_seats = request.form['total_seats']
        airline_id = request.form['airline_id'] if request.form['airline_id'] else None
        cursor = connection.cursor()
        try:
            cursor.execute("""
                UPDATE Flights 
                SET FlightNumber = %s, Origin = %s, Destination = %s, FlightDate = %s, DepartureTime = %s, 
                    ArrivalTime = %s, Price = %s, DiscountedTickets = %s, TotalSeats = %s, AirlineID = %s
                WHERE FlightID = %s
            """, (flight_number, origin, destination, flight_date, departure_time, arrival_time, price, 
                  discounted_tickets, total_seats, airline_id, flight_id))
            connection.commit()
            return redirect(url_for('manage_flights'))
        except mysql.connector.Error as e:
            return f"Error updating flight: {e}"
        finally:
            cursor.close()
            connection.close()
    else:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Flights WHERE FlightID = %s", (flight_id,))
        flight = cursor.fetchone()
        cursor.close()
        connection.close()
        if flight:
            return render_template('edit_flight.html', flight=flight)
        return "Flight not found", 404

# Delete flight (admin only)
@app.route('/delete_flight/<int:flight_id>')
def delete_flight(flight_id):
    if 'user_id' not in session or session['role'] != 'admin':
        return "Unauthorized", 403
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("DELETE FROM Flights WHERE FlightID = %s", (flight_id,))
            connection.commit()
            return redirect(url_for('manage_flights'))
        except mysql.connector.Error as e:
            return f"Error deleting flight: {e}"
        finally:
            cursor.close()
            connection.close()
    return "Database connection error", 500

# Query flights (all users, no login required)
@app.route('/query_flights', methods=['GET'])
def query_flights():
    # 移除登录检查，允许所有用户查询航班
    origin = request.args.get('origin', '')
    destination = request.args.get('destination', '')
    flight_date = request.args.get('flight_date', '')
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT f.*, a.AirlineName 
            FROM Flights f 
            LEFT JOIN Airlines a ON f.AirlineID = a.AirlineID
            WHERE 1=1
        """
        params = []
        if origin:
            query += " AND f.Origin LIKE %s"
            params.append(f"%{origin}%")
        if destination:
            query += " AND f.Destination LIKE %s"
            params.append(f"%{destination}%")
        if flight_date:
            query += " AND f.FlightDate = %s"
            params.append(flight_date)
        cursor.execute(query, params)
        flights = cursor.fetchall()
        
        # 处理TIME字段，将timedelta转换为时间字符串
        for flight in flights:
            if isinstance(flight['DepartureTime'], timedelta):
                total_seconds = int(flight['DepartureTime'].total_seconds())
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                flight['DepartureTimeFormatted'] = f"{hours:02d}:{minutes:02d}"
            
            if isinstance(flight['ArrivalTime'], timedelta):
                total_seconds = int(flight['ArrivalTime'].total_seconds())
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                flight['ArrivalTimeFormatted'] = f"{hours:02d}:{minutes:02d}"
        
        cursor.close()
        connection.close()
        return render_template('query_flights.html', flights=flights)
    return "Database connection error", 500

if __name__ == '__main__':
    app.run(debug=True)