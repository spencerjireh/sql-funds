import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';
import BTreeScene from '../../components/viz/BTreeScene';

export default function IndexesAndPerformance() {
  return (
    <div>
      <h1>Lesson 24: Indexes and Query Performance</h1>
      <p>
        As your tables grow from hundreds of rows to millions, query speed becomes critical. An
        index is a data structure that the database maintains alongside your table to make
        lookups dramatically faster. Without an index, the database must scan every single row
        to find what you are looking for -- a process called a full table scan. With the right
        index, the database can jump directly to the relevant rows.
      </p>

      <h2>What Is an Index?</h2>
      <p>
        Think of a book's index at the back. Instead of reading every page to find a topic, you
        look up the topic in the index, find the page number, and go directly there. A database
        index works the same way: it maps column values to the physical locations of the rows
        that contain those values.
      </p>
      <p>
        Most databases use a structure called a <strong>B-tree</strong> (balanced tree) for their
        indexes. A B-tree keeps data sorted and balanced, ensuring that lookups, insertions, and
        deletions all take roughly the same amount of time regardless of how much data the tree
        holds. The visualization below shows how a B-tree organizes values into a hierarchy of
        nodes.
      </p>

      <BTreeScene />

      <h2>CREATE INDEX Syntax</h2>
      <p>
        You create an index on one or more columns of a table using the CREATE INDEX statement:
      </p>
      <CodeBlock code={`-- Index on a single column
CREATE INDEX idx_customers_email
ON customers(email);`} />
      <p>
        You can also create a composite index that covers multiple columns. This is useful when
        queries frequently filter or sort by a combination of columns:
      </p>
      <CodeBlock code={`-- Composite index on city and state
CREATE INDEX idx_customers_city_state
ON customers(city, state);`} />
      <p>
        The database will now use these indexes automatically when it determines they would speed
        up a query. You do not need to reference the index in your SELECT statements.
      </p>

      <h2>When to Use Indexes</h2>
      <p>
        Indexes are most valuable on columns that appear frequently in WHERE clauses, JOIN
        conditions, and ORDER BY clauses. Primary key columns are indexed automatically. Good
        candidates for additional indexes include:
      </p>
      <ul>
        <li>Foreign key columns used in JOINs (e.g., orders.customer_id)</li>
        <li>Columns used in WHERE filters (e.g., products.category)</li>
        <li>Columns used in ORDER BY for large result sets</li>
      </ul>

      <h2>When NOT to Index</h2>
      <p>
        Indexes are not free. Every index consumes additional disk space and must be updated
        every time you INSERT, UPDATE, or DELETE a row. Avoid indexing:
      </p>
      <ul>
        <li>Very small tables (a full scan is already fast)</li>
        <li>Columns that are updated very frequently</li>
        <li>Columns with very low cardinality (e.g., a boolean or status column with only 2-3 distinct values)</li>
      </ul>

      <InfoBox title="The Read-Write Trade-Off">
        <p>
          Indexes speed up reads (SELECT) but slow down writes (INSERT, UPDATE, DELETE) because
          the database must keep the index in sync with the data. The more indexes a table has,
          the more work each write operation requires. Design your indexes around your most
          important and frequent queries.
        </p>
      </InfoBox>

      <h2>Understanding EXPLAIN</h2>
      <p>
        Most databases provide an EXPLAIN command that shows how the database plans to execute
        a query. This lets you see whether an index is being used and how many rows the database
        expects to examine.
      </p>
      <CodeBlock code={`-- See the query plan for a lookup
EXPLAIN QUERY PLAN
SELECT * FROM customers WHERE email = 'grace@example.com';`} />
      <p>
        The output will tell you whether the database is performing a table scan or using an
        index. After creating an index on the email column, running EXPLAIN again should show
        that the database uses the index instead.
      </p>

      <DialectNote>
        <p>
          The EXPLAIN syntax varies across databases. SQLite uses <code>EXPLAIN QUERY PLAN</code>,
          PostgreSQL and MySQL use <code>EXPLAIN</code> or <code>EXPLAIN ANALYZE</code> (which
          actually runs the query and shows real timing data). SQL Server uses
          <code> SET SHOWPLAN_ALL ON</code> or the graphical execution plan in Management Studio.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Create an Index</h3>
      <p>
        Create an index called <code>idx_orders_customer</code> on the customer_id column of
        the orders table. Then use EXPLAIN QUERY PLAN to verify it is used when looking up
        orders for a specific customer.
      </p>
      <SQLSandbox
        defaultQuery={`-- Create an index on orders.customer_id\nCREATE INDEX idx_orders_customer ON orders(customer_id);\n\n-- Check if the index is used\nEXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 1;`}
        title="Exercise: Create and Verify an Index"
      />

      <h3>Exercise 2: Composite Index</h3>
      <p>
        Create a composite index on the products table covering both category and price. Then
        run a query that filters by category and sorts by price, and use EXPLAIN QUERY PLAN to
        see if the index is utilized.
      </p>
      <SQLSandbox
        defaultQuery={`-- Create a composite index\nCREATE INDEX idx_products_cat_price ON products(category, price);\n\n-- Query that should benefit from the index\nEXPLAIN QUERY PLAN\nSELECT name, price FROM products\nWHERE category = 'Electronics'\nORDER BY price;`}
        title="Exercise: Composite Index"
      />
    </div>
  );
}
