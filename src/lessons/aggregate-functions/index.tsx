import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import AggregateScene from '../../components/viz/AggregateScene';

export default function AggregateFunctions() {
  return (
    <div>
      <h1>Lesson 15: Aggregate Functions</h1>
      <p>
        So far every query you have written returns individual rows from your tables.
        But what if you want to know <em>how many</em> customers you have, or the
        <em> average</em> price of your products? That is where <strong>aggregate
        functions</strong> come in. They take a set of rows and collapse them down
        into a single summary value.
      </p>

      <AggregateScene />

      <h2>COUNT -- Counting Rows</h2>
      <p>
        The most common aggregate is <code>COUNT</code>. It comes in two flavors.
        <code>COUNT(*)</code> counts every row in the result set, regardless of
        NULL values. <code>COUNT(column)</code> counts only those rows where the
        specified column is not NULL.
      </p>

      <CodeBlock code={`-- Count all customers
SELECT COUNT(*) AS total_customers
FROM customers;`} />

      <CodeBlock code={`-- Count only customers that have a city recorded
SELECT COUNT(city) AS customers_with_city
FROM customers;`} />

      <InfoBox title="COUNT(*) vs COUNT(column)">
        <p>
          <code>COUNT(*)</code> always returns the total number of rows.
          <code> COUNT(column)</code> skips rows where that column is NULL.
          If every row has a value for the column, the two return the same number.
          When they differ, the gap tells you exactly how many NULLs exist.
        </p>
      </InfoBox>

      <h2>SUM and AVG -- Totals and Averages</h2>
      <p>
        <code>SUM</code> adds up all the values in a numeric column, and
        <code> AVG</code> computes the arithmetic mean. Both ignore NULLs
        automatically.
      </p>

      <CodeBlock code={`-- Total revenue across all orders
SELECT SUM(total_amount) AS total_revenue
FROM orders;

-- Average product price
SELECT AVG(price) AS avg_price
FROM products;`} />

      <h2>MIN and MAX -- Finding Extremes</h2>
      <p>
        <code>MIN</code> returns the smallest value and <code>MAX</code> returns
        the largest. They work on numbers, dates, and even text (alphabetical order).
      </p>

      <CodeBlock code={`-- Cheapest and most expensive product
SELECT MIN(price) AS cheapest,
       MAX(price) AS most_expensive
FROM products;

-- Earliest and latest order dates
SELECT MIN(order_date) AS first_order,
       MAX(order_date) AS last_order
FROM orders;`} />

      <WarningBox title="NULLs and Aggregates">
        <p>
          All aggregate functions except <code>COUNT(*)</code> ignore NULL values.
          This means <code>AVG</code> divides the sum by the count of non-NULL
          values, not by the total number of rows. If five rows exist but only
          three have a value, the average is calculated over those three. This
          can produce unexpected results if you are not careful.
        </p>
      </WarningBox>

      <h2>Combining Multiple Aggregates</h2>
      <p>
        You can use several aggregate functions in a single SELECT statement
        to build a compact summary of your data.
      </p>

      <CodeBlock code={`SELECT COUNT(*) AS total_products,
       AVG(price) AS avg_price,
       MIN(price) AS min_price,
       MAX(price) AS max_price,
       SUM(stock_quantity) AS total_stock
FROM products;`} />

      <h2>Exercises</h2>

      <h3>Exercise 1: Count Your Customers</h3>
      <p>
        Write a query that returns the total number of customers in the
        <code> customers</code> table. Alias the result as
        <code> customer_count</code>.
      </p>
      <SQLSandbox defaultQuery="-- Count all customers" />

      <h3>Exercise 2: Average Product Price</h3>
      <p>
        Find the average price of all products. Also include the minimum and
        maximum price in your result. Use the aliases <code>avg_price</code>,
        <code> min_price</code>, and <code>max_price</code>.
      </p>
      <SQLSandbox defaultQuery="-- Average, min, and max product prices" />

      <h3>Exercise 3: Total Order Revenue</h3>
      <p>
        Calculate the total revenue from the <code>orders</code> table by summing
        <code> total_amount</code>. Also count how many orders exist. Alias them as
        <code> total_revenue</code> and <code>order_count</code>.
      </p>
      <SQLSandbox defaultQuery="-- Total revenue and order count" />
    </div>
  );
}
