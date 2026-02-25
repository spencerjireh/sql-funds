import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';

export default function SubqueriesInFromAndSelect() {
  return (
    <div>
      <h1>Lesson 20: Subqueries in FROM and SELECT</h1>
      <p>
        In the previous lesson you saw subqueries used in the WHERE clause to filter rows. But
        subqueries are far more versatile than that. You can place them in the FROM clause to
        create temporary result sets, or in the SELECT list to compute a value for every row
        returned by the outer query. Mastering these two placements opens up a wide range of
        analytical patterns.
      </p>

      <h2>Derived Tables (Subqueries in FROM)</h2>
      <p>
        When you put a subquery in the FROM clause, the result acts like a temporary table that
        exists only for the duration of the query. This temporary table is called a
        <strong> derived table</strong>. You can select from it, join it with other tables, or
        filter it with WHERE -- just like any real table.
      </p>
      <CodeBlock code={`-- Average order total by status
SELECT sub.status, sub.avg_total
FROM (
  SELECT status, AVG(total_amount) AS avg_total
  FROM orders
  GROUP BY status
) AS sub
WHERE sub.avg_total > 50;`} />
      <p>
        The inner query groups orders by status and calculates the average total for each group.
        The outer query then treats that result as a table called <code>sub</code> and filters
        it to only show statuses with an average above 50.
      </p>

      <WarningBox title="Alias Required">
        <p>
          Every derived table must have an alias. If you omit the <code>AS sub</code> part, the
          database will return a syntax error. This is a requirement in every major SQL dialect.
        </p>
      </WarningBox>

      <h3>Joining a Derived Table</h3>
      <p>
        You can join a derived table to a regular table, which is useful for attaching summary
        statistics to individual rows.
      </p>
      <CodeBlock code={`-- Show each customer alongside the number of orders they placed
SELECT c.first_name, c.last_name, COALESCE(o_counts.cnt, 0) AS order_count
FROM customers c
LEFT JOIN (
  SELECT customer_id, COUNT(*) AS cnt
  FROM orders
  GROUP BY customer_id
) AS o_counts ON c.customer_id = o_counts.customer_id;`} />

      <h2>Scalar Subqueries in SELECT</h2>
      <p>
        A scalar subquery in the SELECT list computes one value per row of the outer query. It
        behaves like an extra calculated column. Because it runs once per outer row, it is a
        correlated subquery.
      </p>
      <CodeBlock code={`-- Each product alongside the number of reviews it has received
SELECT
  p.name,
  p.price,
  (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id) AS review_count
FROM products p;`} />
      <p>
        For every product, the subquery counts matching rows in the reviews table. The result
        appears as a new column called <code>review_count</code>.
      </p>

      <InfoBox title="When to Use Each Approach">
        <p>
          Derived tables are best when you need to aggregate data and then filter or join that
          aggregated result. Scalar subqueries in SELECT are best when you need a single
          computed value per row. For complex queries, consider whether a JOIN or a CTE would
          be clearer.
        </p>
      </InfoBox>

      <DialectNote>
        <p>
          Most modern databases support Common Table Expressions (CTEs) using the
          <code> WITH</code> clause. CTEs serve the same purpose as derived tables but are
          defined at the top of the query, making complex queries easier to read. Example:
          <code> WITH order_stats AS (SELECT ...) SELECT ... FROM order_stats</code>. CTEs are
          supported in PostgreSQL, MySQL 8+, SQLite 3.8+, and SQL Server.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: High-Value Statuses</h3>
      <p>
        Using a derived table, find each order status and its average total amount. Only show
        statuses where the average total exceeds 40.
      </p>
      <SQLSandbox
        defaultQuery={`-- Use a derived table to filter aggregated results\nSELECT sub.status, sub.avg_total\nFROM (\n  SELECT status, AVG(total_amount) AS avg_total\n  FROM orders\n  GROUP BY status\n) AS sub\nWHERE sub.avg_total > 40;`}
        title="Exercise: High-Value Statuses"
      />

      <h3>Exercise 2: Products with Review Counts</h3>
      <p>
        Write a query that lists each product name, its price, and the number of reviews it has
        received using a scalar subquery in the SELECT clause.
      </p>
      <SQLSandbox
        defaultQuery={`-- Add a review_count column via scalar subquery\nSELECT\n  p.name,\n  p.price,\n  (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id) AS review_count\nFROM products p;`}
        title="Exercise: Products with Review Counts"
      />

      <h3>Exercise 3: Customers with Order Counts</h3>
      <p>
        Join a derived table to the customers table to show each customer's first name, last
        name, and total number of orders. Include customers with zero orders.
      </p>
      <SQLSandbox
        defaultQuery={`-- Join a derived table to show order counts per customer\nSELECT c.first_name, c.last_name, COALESCE(oc.cnt, 0) AS order_count\nFROM customers c\nLEFT JOIN (\n  \n) AS oc ON c.customer_id = oc.customer_id;`}
        title="Exercise: Customers with Order Counts"
      />
    </div>
  );
}
