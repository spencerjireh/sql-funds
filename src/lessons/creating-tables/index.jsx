import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';

export default function CreatingTables() {
  return (
    <div>
      <h1>Lesson 23: CREATE TABLE and Constraints</h1>
      <p>
        Before you can store any data, you need a table to put it in. The CREATE TABLE statement
        defines the structure of a new table: its name, its columns, the data type for each
        column, and any rules (constraints) that the data must follow. Good table design is the
        foundation of a reliable database.
      </p>

      <h2>Basic CREATE TABLE Syntax</h2>
      <p>
        At its simplest, CREATE TABLE names the table and lists each column with a data type:
      </p>
      <CodeBlock code={`CREATE TABLE departments (
  department_id INTEGER,
  name TEXT,
  location TEXT,
  budget REAL
);`} />
      <p>
        Each column has a name and a type. Common types include INTEGER for whole numbers, TEXT
        for strings, REAL for decimal numbers, and DATE or TIMESTAMP for date and time values.
      </p>

      <h2>Column Constraints</h2>
      <p>
        Constraints are rules attached to columns that the database enforces automatically. They
        prevent invalid data from being inserted or updated.
      </p>

      <h3>NOT NULL</h3>
      <p>
        Ensures a column cannot contain NULL values. Use this for fields that must always have
        a value.
      </p>
      <CodeBlock code={`CREATE TABLE employees (
  employee_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  hire_date TEXT NOT NULL
);`} />

      <h3>UNIQUE, DEFAULT, and CHECK</h3>
      <p>
        UNIQUE ensures no two rows share the same value in that column. DEFAULT provides a
        fallback value when one is not supplied. CHECK enforces a custom condition.
      </p>
      <CodeBlock code={`CREATE TABLE inventory (
  item_id INTEGER NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit_price REAL CHECK(unit_price > 0)
);`} />

      <h2>PRIMARY KEY and FOREIGN KEY</h2>
      <p>
        A PRIMARY KEY uniquely identifies each row in a table. It implicitly adds NOT NULL and
        UNIQUE constraints. A FOREIGN KEY links a column in one table to the primary key of
        another, enforcing referential integrity.
      </p>
      <CodeBlock code={`CREATE TABLE projects (
  project_id INTEGER PRIMARY KEY,
  project_name TEXT NOT NULL,
  department_id INTEGER,
  start_date TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);`} />
      <p>
        With the foreign key in place, the database will reject any INSERT into projects that
        references a department_id not found in the departments table.
      </p>

      <WarningBox title="Plan Before You Create">
        <p>
          Changing a table structure after data has been loaded (using ALTER TABLE) can be
          disruptive. Take time to choose appropriate data types, decide which columns need
          NOT NULL, and identify relationships between tables before running CREATE TABLE.
        </p>
      </WarningBox>

      <InfoBox title="Data Type Selection">
        <p>
          Choose the most specific type that fits your data. Use INTEGER for counts and IDs,
          REAL or NUMERIC for prices and measurements, TEXT for names and descriptions, and
          DATE or TIMESTAMP for time-related data. Correct types save storage and improve
          query performance.
        </p>
      </InfoBox>

      <DialectNote>
        <p>
          Auto-incrementing primary keys have different syntax across databases. MySQL uses
          <code> AUTO_INCREMENT</code>, PostgreSQL uses <code>SERIAL</code> or
          <code> GENERATED ALWAYS AS IDENTITY</code>, and SQLite uses
          <code> INTEGER PRIMARY KEY AUTOINCREMENT</code>. In SQLite, an INTEGER PRIMARY KEY
          without AUTOINCREMENT already auto-increments by default, but AUTOINCREMENT adds
          stricter guarantees about reuse of deleted IDs.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Create and Populate a Table</h3>
      <p>
        Create a table called <code>departments</code> with columns department_id (INTEGER,
        PRIMARY KEY), name (TEXT, NOT NULL), and location (TEXT). Then insert two departments
        and select all rows to verify.
      </p>
      <SQLSandbox
        defaultQuery={`-- Create the departments table\nCREATE TABLE departments (\n  department_id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  location TEXT\n);\n\n-- Insert two rows\nINSERT INTO departments VALUES (1, 'Engineering', 'Building A');\nINSERT INTO departments VALUES (2, 'Marketing', 'Building B');\n\n-- Verify\nSELECT * FROM departments;`}
        title="Exercise: Create and Populate"
      />

      <h3>Exercise 2: Constraints in Action</h3>
      <p>
        Create a table called <code>inventory</code> with an item_id (INTEGER PRIMARY KEY),
        item_name (TEXT NOT NULL), quantity (INTEGER DEFAULT 0), and unit_price (REAL with a
        CHECK that it is greater than 0). Insert a valid row and then try inserting a row with
        a negative price to see the constraint reject it.
      </p>
      <SQLSandbox
        defaultQuery={`-- Create inventory with constraints\nCREATE TABLE inventory (\n  item_id INTEGER PRIMARY KEY,\n  item_name TEXT NOT NULL,\n  quantity INTEGER DEFAULT 0,\n  unit_price REAL CHECK(unit_price > 0)\n);\n\n-- Valid insert\nINSERT INTO inventory (item_id, item_name, unit_price) VALUES (1, 'Bolt', 0.50);\n\n-- This should fail: negative price\nINSERT INTO inventory (item_id, item_name, unit_price) VALUES (2, 'Nut', -1.00);`}
        title="Exercise: Constraints in Action"
      />
    </div>
  );
}
