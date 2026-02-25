import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import FlowDiagram from '../../components/viz/FlowDiagram';

export default function YourFirstQuery() {
  return (
    <div>
      <h1>Your First Query</h1>
      <p>
        Every SQL journey starts with two keywords: <code>SELECT</code> and <code>FROM</code>.
        Together they form the simplest possible query -- "give me data from this table."
        By the end of this lesson you will be comfortable retrieving exactly the columns you
        need from any table in our e-commerce database.
      </p>

      <h2>How a Query Executes</h2>
      <p>
        Although you write <code>SELECT</code> first, the database actually processes the
        query in a different order. It starts by identifying the table in the
        <code> FROM</code> clause, then decides which columns to return based on the
        <code> SELECT</code> clause. Understanding this order will become increasingly
        important as queries grow more complex.
      </p>

      <FlowDiagram
        steps={['FROM (identify the table)', 'SELECT (choose columns)']}
        highlight={0}
      />

      <h2>SELECT * -- All Columns</h2>
      <p>
        The asterisk (<code>*</code>) is a wildcard that means "every column." It is
        handy for quick exploration, but in production code you should almost always list
        the columns explicitly. Fetching columns you do not need wastes memory and bandwidth.
      </p>

      <CodeBlock code={`-- Return every column from the products table
SELECT *
FROM products;`} />

      <InfoBox title="When to Use SELECT *">
        <p>
          Use <code>SELECT *</code> when exploring a table for the first time or during
          debugging. In application code and reports, always spell out the columns you need.
          This makes your queries self-documenting and protects them from breaking if a
          column is added or renamed later.
        </p>
      </InfoBox>

      <h2>Selecting Specific Columns</h2>
      <p>
        To request only certain columns, list them by name after <code>SELECT</code>,
        separated by commas. The database will return them in the order you specify, not
        the order they are stored in the table.
      </p>

      <CodeBlock code={`-- Return only the name and price of each product
SELECT name, price
FROM products;`} />

      <CodeBlock code={`-- You can reorder columns however you like
SELECT email, last_name, first_name
FROM customers;`} />

      <h2>Selecting from Different Tables</h2>
      <p>
        The <code>FROM</code> clause determines which table you are reading. You can query
        any of the five tables in our schema -- just change the table name.
      </p>

      <CodeBlock code={`-- Look at recent orders
SELECT id, customer_id, order_date, total
FROM orders;`} />

      <h2>Exercises</h2>

      <h3>Exercise 1: Browse all products</h3>
      <p>
        Run the query below to see every column of the <code>products</code> table. Look
        at the column names and data types that come back -- this will help you in future
        lessons.
      </p>

      <SQLSandbox defaultQuery="SELECT * FROM products;" />

      <h3>Exercise 2: Pick specific customer columns</h3>
      <p>
        Modify the query to return only <code>first_name</code>, <code>last_name</code>,
        and <code>email</code> from the <code>customers</code> table. Notice how the
        result set becomes narrower when you drop the columns you do not need.
      </p>

      <SQLSandbox defaultQuery="SELECT first_name, last_name, email FROM customers;" />

      <h3>Exercise 3: Explore orders</h3>
      <p>
        Write a query that returns the <code>id</code>, <code>order_date</code>, and
        <code> total</code> columns from the <code>orders</code> table. Try adding or
        removing columns to see how the output changes.
      </p>

      <SQLSandbox defaultQuery="SELECT id, order_date, total FROM orders;" />
    </div>
  );
}
