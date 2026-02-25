import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';

export default function SortingWithOrderBy() {
  return (
    <div>
      <h1>Lesson 6: Sorting with ORDER BY</h1>
      <p>
        When you run a SELECT query, the database does not guarantee the order of
        the rows it returns. If you want your results organized in a predictable way
        -- alphabetically, by date, by price, or any other column -- you need the
        <strong> ORDER BY</strong> clause. It tells the database exactly how to
        arrange the result set before handing it back to you.
      </p>

      <h2>Basic Sorting</h2>
      <p>
        Add <code>ORDER BY</code> at the end of your query, followed by the column
        you want to sort on. By default the sort direction is <strong>ascending</strong>
        (smallest to largest, A to Z, earliest to latest).
      </p>
      <CodeBlock code={`SELECT first_name, last_name, city
FROM customers
ORDER BY last_name;`} />
      <p>
        The query above returns every customer sorted alphabetically by their last
        name. Because ascending is the default, writing <code>ORDER BY last_name</code>
        is identical to writing <code>ORDER BY last_name ASC</code>.
      </p>

      <h2>Ascending and Descending</h2>
      <p>
        You can explicitly choose the sort direction with the keywords
        <code> ASC</code> (ascending) and <code>DESC</code> (descending).
      </p>
      <CodeBlock code={`-- Most expensive products first
SELECT name, category, price
FROM products
ORDER BY price DESC;`} />
      <CodeBlock code={`-- Oldest orders first (ascending is the default)
SELECT order_id, order_date, total_amount
FROM orders
ORDER BY order_date ASC;`} />

      <h2>Multi-Column Sorting</h2>
      <p>
        You can sort by more than one column. The database sorts by the first column
        listed, and when there are ties it uses the second column, and so on. Each
        column can have its own direction.
      </p>
      <CodeBlock code={`SELECT name, category, price
FROM products
ORDER BY category ASC, price DESC;`} />
      <p>
        This sorts products alphabetically by category first. Within each category,
        products are listed from most expensive to least expensive.
      </p>

      <InfoBox title="Tip: Column Position Shorthand">
        <p>
          Some SQL dialects let you refer to columns by their position in the
          SELECT list instead of by name. For example, <code>ORDER BY 2</code> sorts
          by the second column. This is handy in quick queries but hurts readability
          in production code. Prefer using column names for clarity.
        </p>
      </InfoBox>

      <h2>NULLs and Sort Order</h2>
      <p>
        When a column contains NULL values, the database must decide where to place
        them. In most dialects, NULLs sort as the largest possible value -- appearing
        last in ascending order and first in descending order. However, this behavior
        is not standardized and varies between systems.
      </p>

      <DialectNote>
        <p>
          PostgreSQL and Oracle support <code>NULLS FIRST</code> and <code>NULLS LAST</code> to
          explicitly control where NULLs appear:
        </p>
        <code>ORDER BY column_name ASC NULLS LAST</code>
        <p>
          MySQL and SQL Server do not support this syntax. In MySQL, NULLs are
          treated as the lowest values (appearing first in ascending order). Keep
          these differences in mind when writing cross-database queries.
        </p>
      </DialectNote>

      <h2>Practice Exercises</h2>

      <h3>Exercise 1: Sort Products by Price</h3>
      <p>
        Write a query that returns the name and price of all products, sorted from
        the most expensive to the least expensive.
      </p>
      <SQLSandbox
        title="Sort products by price (highest first)"
        defaultQuery={`SELECT name, price
FROM products
ORDER BY `}
      />

      <h3>Exercise 2: Multi-Column Sort</h3>
      <p>
        Retrieve the name, category, and price of all products. Sort them by category
        in alphabetical order, and within each category sort by price from highest to
        lowest.
      </p>
      <SQLSandbox
        title="Sort by category then price"
        defaultQuery={`SELECT name, category, price
FROM products
ORDER BY `}
      />

      <h3>Exercise 3: Sort Orders by Date</h3>
      <p>
        List all orders showing the order_id, order_date, and total_amount. Sort the
        results so the most recent orders appear first.
      </p>
      <SQLSandbox
        title="Most recent orders first"
        defaultQuery={`SELECT order_id, order_date, total_amount
FROM orders`}
      />
    </div>
  );
}
