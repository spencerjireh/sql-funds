import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';

export default function WindowFunctionsIntro() {
  return (
    <div>
      <h1>Lesson 25: Introduction to Window Functions</h1>
      <p>
        Window functions are one of the most powerful features in SQL. They let you perform
        calculations across a set of rows that are related to the current row -- without
        collapsing those rows into a single output row the way GROUP BY does. Every original
        row is preserved in the result, with a new computed column added alongside it.
      </p>

      <h2>The OVER() Clause</h2>
      <p>
        Every window function uses the OVER() clause to define its "window" -- the set of rows
        the function should consider. An empty OVER() means the function looks at all rows in
        the result set.
      </p>
      <CodeBlock code={`-- Show each product's price alongside the overall average price
SELECT
  name,
  price,
  AVG(price) OVER() AS avg_price
FROM products;`} />
      <p>
        Notice that every row still appears in the output. The avg_price column contains the
        same value on every row because the window encompasses the entire result set.
      </p>

      <h2>ROW_NUMBER()</h2>
      <p>
        ROW_NUMBER() assigns a sequential integer to each row within the window. When combined
        with ORDER BY inside OVER(), it numbers rows according to that ordering.
      </p>
      <CodeBlock code={`-- Number all products by price (most expensive first)
SELECT
  ROW_NUMBER() OVER(ORDER BY price DESC) AS row_num,
  name,
  price
FROM products;`} />
      <p>
        Each row gets a unique number from 1 to N. If two products share the same price, the
        assignment of their row numbers is arbitrary -- ROW_NUMBER never produces ties.
      </p>

      <h2>RANK() and DENSE_RANK()</h2>
      <p>
        Unlike ROW_NUMBER, RANK() handles ties by assigning the same rank to rows with equal
        values. However, it leaves gaps after ties. DENSE_RANK() also assigns equal ranks to
        ties but does not leave gaps.
      </p>
      <CodeBlock code={`-- Compare RANK and DENSE_RANK
SELECT
  name,
  price,
  RANK() OVER(ORDER BY price DESC) AS price_rank,
  DENSE_RANK() OVER(ORDER BY price DESC) AS price_dense_rank
FROM products;`} />
      <p>
        If two products tie for rank 2, RANK() assigns 2 to both and then skips to 4 for the
        next product. DENSE_RANK() assigns 2 to both and continues with 3.
      </p>

      <h2>PARTITION BY</h2>
      <p>
        PARTITION BY divides the rows into groups (partitions), and the window function operates
        independently within each group. This is similar to GROUP BY, except all rows are kept.
      </p>
      <CodeBlock code={`-- Rank products by price within each category
SELECT
  name,
  category,
  price,
  RANK() OVER(PARTITION BY category ORDER BY price DESC) AS category_rank
FROM products;`} />
      <p>
        Each category has its own ranking. The most expensive product in each category gets
        rank 1, and the numbering restarts for the next category.
      </p>

      <InfoBox title="Window Functions vs GROUP BY">
        <p>
          GROUP BY collapses rows: if you group 100 orders by status, you get one row per
          status. Window functions keep all 100 rows and add a computed column to each. Use
          GROUP BY when you want summary rows. Use window functions when you want to annotate
          each row with context from its group without losing detail.
        </p>
      </InfoBox>

      <DialectNote>
        <p>
          Window functions are supported in PostgreSQL, SQLite (3.25+), MySQL (8.0+), SQL
          Server, and Oracle. If you are using an older version of MySQL or SQLite, window
          functions may not be available. PostgreSQL has the most complete implementation,
          including support for advanced frame clauses like ROWS BETWEEN and RANGE BETWEEN.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Rank Products by Price Within Category</h3>
      <p>
        Write a query that returns each product's name, category, price, and its rank within
        its category (most expensive first). Use DENSE_RANK().
      </p>
      <SQLSandbox
        defaultQuery={`-- Rank products within each category\nSELECT\n  name,\n  category,\n  price,\n  DENSE_RANK() OVER(PARTITION BY category ORDER BY price DESC) AS category_rank\nFROM products;`}
        title="Exercise: Category Rankings"
      />

      <h3>Exercise 2: Number Orders Per Customer</h3>
      <p>
        For each customer's orders, assign a sequential order number using ROW_NUMBER(),
        ordered by order_date. Partition by customer_id so each customer's numbering starts
        at 1. Return customer_id, order_date, total_amount, and the order number.
      </p>
      <SQLSandbox
        defaultQuery={`-- Number each customer's orders chronologically\nSELECT\n  customer_id,\n  order_date,\n  total_amount,\n  ROW_NUMBER() OVER(\n    PARTITION BY customer_id\n    ORDER BY order_date\n  ) AS order_number\nFROM orders;`}
        title="Exercise: Number Orders Per Customer"
      />

      <h3>Exercise 3: Running Total</h3>
      <p>
        Use a window function to compute a running total of order amounts, ordered by
        order_date. Return order_id, order_date, total_amount, and the cumulative sum.
      </p>
      <SQLSandbox
        defaultQuery={`-- Running total of order amounts\nSELECT\n  order_id,\n  order_date,\n  total_amount,\n  SUM(total_amount) OVER(ORDER BY order_date) AS running_total\nFROM orders;`}
        title="Exercise: Running Total"
      />
    </div>
  );
}
