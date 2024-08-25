# Driver Salary API

This is a backend test for Seryu Cargo, creating a driver salary API.

## Prerequisites

1. Node.js
2. Express.js
3. TypeScript
4. NPM or Yarn
5. PostgreSQL

## Project Installation

1. clone the repository

   ```
   - git clone https://github.com/MBambangSumantri/seryu-cargo-backend-test.git

   - cd seryu-cargo-backend-test
   ```

2. install dependencies

   ```bash
   npm install
   # if using Yarn
   yarn install
   ```

3. create a `.env` file and follow the contents of the `.env example` file then fill it in according to your needs

   ```
   DB_NAME=
   DB_USERNAME=
   DB_PASS=
   DB_HOST=

   PORT=
   ```

4. migrate all database files in the seryu_backend_test_database_data folder into your postgresql database

## Running the Server

1. Run the server in development mode:

   ```bash
   npm run dev
   # if using yarn
   yarn dev
   ```

## Endpoint

### Retrieve Driver Salary for a Specific Month and Year

**GET** `/v1/salary/driver/list`

### Query Parameters

- `month` (required): The month for which the salary data is requested (1-12).
- `year` (required): The year for which the salary data is requested (e.g., 2024).
- `current` (optional): The current page number for pagination (default: 1).
- `page_size` (optional): The number of records per page (default: 10).

### Example Request

```http
GET http://localhost:8000/v1/salary/driver/list?month=3&year=2024&current=1&page_size=10
```

### Example Response

```
{
	"data": [
		{
			"driver_code": "DRIVER001",
			"name": "Driver Name 1",
			"total_pending": 72700000,
			"total_confirmed": 31200000,
			"total_paid": 42700000,
			"total_attendance_salary": 450000,
			"total_salary": 147050000,
			"count_shipment": 22
		},
		{
			"driver_code": "DRIVER002",
			"name": "Driver Name 2",
			"total_pending": 24600000,
			"total_confirmed": 8300000,
			"total_paid": 29700000,
			"total_attendance_salary": 600000,
			"total_salary": 63200000,
			"count_shipment": 17
		},
		{
			"driver_code": "DRIVER003",
			"name": "Driver Name 3",
			"total_pending": 31400000,
			"total_confirmed": 28700000,
			"total_paid": 14000000,
			"total_attendance_salary": 850000,
			"total_salary": 74950000,
			"count_shipment": 15
		},
		{
			"driver_code": "DRIVER004",
			"name": "Driver Name 4",
			"total_pending": 45300000,
			"total_confirmed": 11700000,
			"total_paid": 30900000,
			"total_attendance_salary": 550000,
			"total_salary": 88450000,
			"count_shipment": 17
		},
		{
			"driver_code": "DRIVER005",
			"name": "Driver Name 5",
			"total_pending": 49100000,
			"total_confirmed": 56700000,
			"total_paid": 20400000,
			"total_attendance_salary": 650000,
			"total_salary": 126850000,
			"count_shipment": 25
		},
		{
			"driver_code": "DRIVER006",
			"name": "Driver Name 6",
			"total_pending": 28700000,
			"total_confirmed": 22900000,
			"total_paid": 17700000,
			"total_attendance_salary": 600000,
			"total_salary": 69900000,
			"count_shipment": 15
		},
		{
			"driver_code": "DRIVER007",
			"name": "Driver Name 7",
			"total_pending": 51200000,
			"total_confirmed": 9800000,
			"total_paid": 31400000,
			"total_attendance_salary": 600000,
			"total_salary": 93000000,
			"count_shipment": 18
		},
		{
			"driver_code": "DRIVER008",
			"name": "Driver Name 8",
			"total_pending": 29500000,
			"total_confirmed": 16200000,
			"total_paid": 44900000,
			"total_attendance_salary": 650000,
			"total_salary": 91250000,
			"count_shipment": 18
		},
		{
			"driver_code": "DRIVER009",
			"name": "Driver Name 9",
			"total_pending": 17600000,
			"total_confirmed": 34400000,
			"total_paid": 22900000,
			"total_attendance_salary": 600000,
			"total_salary": 75500000,
			"count_shipment": 14
		},
		{
			"driver_code": "DRIVER010",
			"name": "Driver Name 10",
			"total_pending": 24900000,
			"total_confirmed": 44400000,
			"total_paid": 42300000,
			"total_attendance_salary": 500000,
			"total_salary": 112100000,
			"count_shipment": 21
		}
	],
	"total_row": 35,
	"current": 1,
	"page_size": 10
}
```
