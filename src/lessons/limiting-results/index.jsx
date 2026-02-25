import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';

export default function LimitingResults() {
  return (
    <div>
      <h1>Lesson 7: Limiting Results</h1>
      <p>
        Real-world tables can contain millions of rows. Returning every single row
        at once is often unnecessary and slow. The <strong>LIMIT</strong> clause
        lets you cap the number of rows the database returns, and
        <strong> OFFSET</strong> lets you skip rows -- together they form the
        foundation of pagination in SQL.
      </p>

      <h2>LIMIT: Restricting Row Count</h2>
      <p>
        Place <code>LIMIT</code> at the end of your query to tell the database the
        maximum number of rows you want back. This is especially useful when
        exploring a large table for the first time or when your application only
        needs a fixed number of results.
      </p>
      <CodeBlock code={`-- Return only the first 5 products
SELECT name, price
FROM products
LIMIT 5;`} />

      <h2>Combining LIMIT with ORDER BY</h2>
      <p>
        LIMIT becomes far more powerful when combined with ORDER BY. For example,
        to find the three most expensive products:
      </p>
      <CodeBlock code={`SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;`} />
      <p>
        Without ORDER BY, the database returns an arbitrary set of rows. Adding
        ORDER BY ensures you get a meaningful "top N" or "bottom N" result.
      </p>

      <WarningBox title="Watch Out: OFFSET Without ORDER BY">
        <p>
          Using OFFSET without ORDER BY produces unpredictable results. Because
          the database does not guarantee row order by default, the rows you skip
          may change between executions. Always pair OFFSET with an ORDER BY
          clause so your pagination is consistent and repeatable.
        </p>
      </WarningBox>

      <h2>OFFSET: Skipping Rows</h2>
      <p>
        <code>OFFSET</code> tells the database to skip a certain number of rows
        before it starts returning results. Combined with LIMIT, this is how
        pagination works in most applications.
      </p>
      <CodeBlock code={`-- Page 1: rows 1-5
SELECT name, price
FROM products
ORDER BY name
LIMIT 5 OFFSET 0;

-- Page 2: rows 6-10
SELECT name, price
FROM products
ORDER BY name
LIMIT 5 OFFSET 5;

-- Page 3: rows 11-15
SELECT name, price
FROM products
ORDER BY name
LIMIT 5 OFFSET 10;`} />
      <p>
        The pattern is straightforward: for page number <em>N</em> with a page
        size of <em>S</em>, set <code>OFFSET</code> to <code>(N - 1) * S</code>.
      </p>

      <InfoBox title="Pagination Performance">
        <p>
          As OFFSET grows larger, the database must scan and discard more rows
          before returning results. For very large tables, high OFFSET values can
          become slow. In those cases, cursor-based pagination (using a WHERE
          clause on a unique, indexed column) is a more efficient alternative.
        </p>
      </InfoBox>

      <DialectNote>
        <p>
          The LIMIT/OFFSET syntax is supported in MySQL, PostgreSQL, and SQLite.
          The SQL standard uses a different syntax:
        </p>
        <code>FETCH FIRST 5 ROWS ONLY</code>
        <p>
          SQL Server uses the <code>TOP</code> keyword instead:
        </p>
        <code>SELECT TOP 5 name, price FROM products</code>
        <p>
          The concepts are the same across all dialects -- only the syntax differs.
        </p>
      </DialectNote>

      <h2>Practice Exercises</h2>

      <h3>Exercise 1: Top 5 Most Expensive Products</h3>
      <p>
        Write a query that returns the name and price of the five most expensive
        products in the store.
      </p>
      <SQLSandbox
        title="Find the top 5 priciest products"
        defaultQuery={`SELECT name, price
FROM products
ORDER BY price DESC`}
      />

      <h3>Exercise 2: Pagination</h3>
      <p>
        Imagine each page shows 3 products. Write a query that fetches the second
        page of products sorted alphabetically by name.
      </p>
      <SQLSandbox
        title="Get page 2 (3 products per page)"
        defaultQuery={`SELECT name, price
FROM products
ORDER BY name`}
      />

      <h3>Exercise 3: Latest Orders</h3>
      <p>
        Retrieve the 3 most recent orders, showing the order_id, order_date, and
        total_amount.
      </p>
      <SQLSandbox
        title="3 most recent orders"
        defaultQuery={`SELECT order_id, order_date, total_amount
FROM orders`}
      />
    </div>
  );
}
