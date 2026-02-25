import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DataTable from '../../components/DataTable';
import TableScene3D from '../../components/viz/TableScene3D';

export default function WhatIsADatabase() {
  return (
    <div>
      <h1>What Is a Database?</h1>
      <p>
        Before you can write a single query, you need to understand where the data lives.
        A database is an organized collection of data stored electronically. In this course
        we focus on <strong>relational databases</strong>, where data is arranged into tables
        that can reference one another. Think of a spreadsheet -- but with rules, structure,
        and far more power.
      </p>

      <h2>Tables, Rows, and Columns</h2>
      <p>
        Every relational database is made up of <strong>tables</strong>. A table is a
        two-dimensional structure with <strong>columns</strong> (also called fields) that
        define the kind of data stored, and <strong>rows</strong> (also called records) that
        hold the actual values. Each row represents one entity -- for example, one customer --
        and each column represents one attribute of that entity, such as their name or email.
      </p>

      <TableScene3D />

      <p>
        The interactive 3D visualization above shows how a table looks conceptually: column
        headers across the top, and data flowing downward row by row. You can click and drag
        to rotate it.
      </p>

      <h2>A Sample Table: Customers</h2>
      <p>
        Here is a small excerpt from the <code>customers</code> table we will use throughout
        this course. Notice that every row has a unique <code>id</code> value.
      </p>

      <DataTable
        headers={['id', 'first_name', 'last_name', 'email', 'city', 'state']}
        rows={[
          [1, 'Alice', 'Chen', 'alice@example.com', 'Portland', 'OR'],
          [2, 'Bob', 'Smith', 'bob@example.com', 'Austin', 'TX'],
          [3, 'Carol', 'Davis', 'carol@example.com', null, 'CA'],
        ]}
        caption="An excerpt from the customers table"
      />

      <h2>Primary Keys</h2>
      <p>
        A <strong>primary key</strong> is a column (or set of columns) whose value uniquely
        identifies each row in a table. No two rows may share the same primary key value, and
        it can never be NULL. In our schema, every table has an <code>id</code> column that
        serves as its primary key.
      </p>

      <CodeBlock code={`-- The id column is the primary key
SELECT id, first_name, last_name
FROM customers;`} />

      <h2>Foreign Keys</h2>
      <p>
        Tables do not exist in isolation. A <strong>foreign key</strong> is a column in one
        table that references the primary key of another table. This is how relationships
        between entities are expressed. For example, the <code>orders</code> table has a
        <code> customer_id</code> column that points back to <code>customers.id</code>.
      </p>

      <CodeBlock code={`-- orders.customer_id references customers.id
SELECT id, customer_id, order_date, total
FROM orders;`} />

      <InfoBox title="Why Relations Matter">
        <p>
          Foreign keys let us avoid duplicating data. Instead of copying a customer's name
          into every order, we store a small <code>customer_id</code> integer and look up
          the rest when needed. This keeps the database compact and consistent.
        </p>
      </InfoBox>

      <h2>Our E-Commerce Schema</h2>
      <p>
        Throughout this course we will work with five related tables that model a small
        online store:
      </p>
      <ul>
        <li><strong>customers</strong> -- people who shop at the store</li>
        <li><strong>products</strong> -- items available for purchase</li>
        <li><strong>orders</strong> -- a record of each purchase a customer makes</li>
        <li><strong>order_items</strong> -- individual line items within an order (links orders to products)</li>
        <li><strong>reviews</strong> -- product ratings and comments left by customers</li>
      </ul>

      <CodeBlock code={`-- Peek at the structure by selecting from each table
SELECT * FROM products LIMIT 3;
SELECT * FROM orders LIMIT 3;
SELECT * FROM order_items LIMIT 3;
SELECT * FROM reviews LIMIT 3;`} />

      <h2>Try It: Explore the Data</h2>
      <p>
        Use the interactive editor below to run your first query. The default query
        retrieves the first five customers. Feel free to modify it and explore the other
        tables too.
      </p>

      <SQLSandbox defaultQuery="SELECT * FROM customers LIMIT 5;" />

      <InfoBox title="Keyboard Shortcut">
        <p>
          You can press <strong>Ctrl+Enter</strong> (or Cmd+Enter on Mac) to run a query
          without clicking the Run button.
        </p>
      </InfoBox>
    </div>
  );
}
