import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';

export default function InsertUpdateDelete() {
  return (
    <div>
      <h1>Lesson 22: INSERT, UPDATE, DELETE</h1>
      <p>
        Up to this point, every query you have written has been a SELECT -- a read-only
        operation. Now it is time to learn how to modify data. SQL provides three fundamental
        Data Manipulation Language (DML) statements for changing the contents of a table:
        INSERT adds new rows, UPDATE changes existing rows, and DELETE removes rows. These
        operations are the backbone of any application that stores and manages data.
      </p>

      <h2>INSERT: Adding New Rows</h2>
      <p>
        The INSERT statement creates one or more new rows in a table. There are two common
        forms. The first specifies values for every column in table order:
      </p>
      <CodeBlock code={`-- Insert with all columns (order must match table definition)
INSERT INTO customers
VALUES (100, 'Grace', 'Hopper', 'grace@example.com', 'Arlington', 'VA', '2025-01-15');`} />
      <p>
        The second (and recommended) form explicitly names the columns you are filling. This is
        safer because it does not depend on column order and makes your intent clear:
      </p>
      <CodeBlock code={`-- Insert with named columns (preferred)
INSERT INTO customers (customer_id, first_name, last_name, email, city, state, created_at)
VALUES (101, 'Alan', 'Turing', 'alan@example.com', 'Princeton', 'NJ', '2025-02-20');`} />

      <h2>UPDATE: Changing Existing Rows</h2>
      <p>
        UPDATE modifies the values of one or more columns in existing rows. You specify which
        columns to change with SET and which rows to target with WHERE.
      </p>
      <CodeBlock code={`-- Increase the price of a specific product
UPDATE products
SET price = price * 1.10
WHERE product_id = 3;`} />
      <p>
        You can update multiple columns at once by separating the assignments with commas:
      </p>
      <CodeBlock code={`-- Update name and stock for a product
UPDATE products
SET name = 'Premium Widget', stock_quantity = 200
WHERE product_id = 5;`} />

      <WarningBox title="Always Use WHERE with UPDATE and DELETE">
        <p>
          If you run UPDATE or DELETE without a WHERE clause, the operation applies to
          <strong> every row in the table</strong>. This is one of the most common and
          destructive mistakes in SQL. Always double-check your WHERE condition before
          executing. A good habit is to write the WHERE clause first, then add the SET or
          DELETE keyword.
        </p>
      </WarningBox>

      <h2>DELETE: Removing Rows</h2>
      <p>
        DELETE removes rows from a table. Like UPDATE, it uses a WHERE clause to target
        specific rows.
      </p>
      <CodeBlock code={`-- Remove a specific order
DELETE FROM orders
WHERE order_id = 10;`} />
      <p>
        To remove all rows from a table while keeping the table structure intact, you can
        omit the WHERE clause -- but do this only when you genuinely intend to empty the
        entire table.
      </p>

      <InfoBox title="Use the Reset Button">
        <p>
          The sandbox below has a "Reset DB" button. Since INSERT, UPDATE, and DELETE modify the
          database, you may want to reset it to its original state after experimenting. Do not
          worry about breaking anything -- the reset restores all tables to their initial data.
        </p>
      </InfoBox>

      <h2>Exercises</h2>

      <h3>Exercise 1: Insert a New Customer</h3>
      <p>
        Add a new customer with ID 200, first name "Ada", last name "Lovelace", email
        "ada@example.com", city "London", state "UK", and created_at "2025-06-01". Then
        SELECT from customers to verify the row was added.
      </p>
      <SQLSandbox
        defaultQuery={`-- Insert a new customer, then verify\nINSERT INTO customers (customer_id, first_name, last_name, email, city, state, created_at)\nVALUES (200, 'Ada', 'Lovelace', 'ada@example.com', 'London', 'UK', '2025-06-01');\n\nSELECT * FROM customers WHERE customer_id = 200;`}
        title="Exercise: Insert a Customer"
      />

      <h3>Exercise 2: Update a Product Price</h3>
      <p>
        Increase the price of the product with product_id 1 by 15%. Then query that product
        to confirm the new price.
      </p>
      <SQLSandbox
        defaultQuery={`-- Update price, then verify\nUPDATE products\nSET price = price * 1.15\nWHERE product_id = 1;\n\nSELECT name, price FROM products WHERE product_id = 1;`}
        title="Exercise: Update a Price"
      />

      <h3>Exercise 3: Delete an Order</h3>
      <p>
        Delete the order with order_id 1 from the orders table. Then run a SELECT to confirm
        it has been removed.
      </p>
      <SQLSandbox
        defaultQuery={`-- Delete an order, then verify\nDELETE FROM orders WHERE order_id = 1;\n\nSELECT * FROM orders WHERE order_id = 1;`}
        title="Exercise: Delete an Order"
      />
    </div>
  );
}
