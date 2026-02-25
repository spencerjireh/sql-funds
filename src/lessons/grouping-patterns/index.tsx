import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';

export default function GroupingPatterns() {
  return (
    <div>
      <h1>Lesson 18: Grouping Patterns</h1>
      <p>
        Now that you understand GROUP BY, HAVING, and aggregate functions, it is
        time to combine them into the practical patterns you will use every day.
        Real-world queries rarely group by a single column in isolation. You will
        often group by two or more columns at once, join tables before grouping,
        and build summary reports that answer real business questions.
      </p>

      <h2>Multi-Column GROUP BY</h2>
      <p>
        When you group by multiple columns, SQL creates one group for every unique
        combination of values across those columns. This lets you break your data
        down along several dimensions at the same time.
      </p>

      <CodeBlock code={`-- Count orders by status AND customer
SELECT customer_id,
       status,
       COUNT(*) AS order_count
FROM orders
GROUP BY customer_id, status
ORDER BY customer_id, status;`} />

      <p>
        In the result, each row represents a specific customer-status pair. If
        customer 1 has three completed orders and one pending order, that produces
        two rows for customer 1.
      </p>

      <InfoBox title="Choosing Your Grouping Columns">
        <p>
          Think about the question you are trying to answer. "How many orders does
          each customer have?" requires <code>GROUP BY customer_id</code>. "How
          many orders does each customer have in each status?" requires
          <code> GROUP BY customer_id, status</code>. Adding more grouping columns
          produces more granular results with more rows.
        </p>
      </InfoBox>

      <h2>GROUP BY with JOINs</h2>
      <p>
        One of the most powerful patterns is joining two or more tables and then
        grouping the combined result. This lets you enrich your aggregates with
        data from related tables -- for example, showing customer names alongside
        their order totals instead of just a bare <code>customer_id</code>.
      </p>

      <CodeBlock code={`-- Total spending per customer, with their name
SELECT c.first_name,
       c.last_name,
       COUNT(o.order_id) AS order_count,
       SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC;`} />

      <p>
        Notice that <code>first_name</code> and <code>last_name</code> appear in
        both SELECT and GROUP BY. Because they depend on <code>customer_id</code>,
        including all three in GROUP BY is the safe and portable approach.
      </p>

      <h2>Sales Reports: Revenue by Category</h2>
      <p>
        A common business query joins products through order items to calculate
        revenue per product category. This pattern requires joining three tables.
      </p>

      <CodeBlock code={`-- Revenue by product category
SELECT p.category,
       COUNT(DISTINCT oi.order_id) AS orders_containing,
       SUM(oi.quantity) AS total_units_sold,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category
ORDER BY revenue DESC;`} />

      <h2>Customer Activity Summaries</h2>
      <p>
        Another practical pattern is summarizing customer activity across
        multiple dimensions. Here we join customers with reviews to see who
        your most active reviewers are.
      </p>

      <CodeBlock code={`-- Most active reviewers
SELECT c.first_name,
       c.last_name,
       COUNT(r.review_id) AS reviews_written,
       AVG(r.rating) AS avg_rating_given
FROM customers c
JOIN reviews r ON c.customer_id = r.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(r.review_id) >= 2
ORDER BY reviews_written DESC;`} />

      <WarningBox title="Watch Your JOINs Before Grouping">
        <p>
          When you join tables that have a one-to-many relationship, the "many"
          side multiplies rows before grouping. If a customer has 5 orders and
          each order has 3 items, joining all three tables produces 15 rows for
          that customer. Aggregating at that point can double-count values. Always
          check whether you need <code>COUNT(DISTINCT ...)</code> instead of a
          plain <code>COUNT(*)</code> to avoid inflated numbers.
        </p>
      </WarningBox>

      <h2>Exercises</h2>

      <h3>Exercise 1: Revenue by Category</h3>
      <p>
        Join the <code>order_items</code> and <code>products</code> tables. Group
        by <code>category</code> and calculate the total revenue as
        <code> SUM(quantity * unit_price)</code>. Alias it as <code>revenue</code>
        and sort by revenue descending.
      </p>
      <SQLSandbox defaultQuery="-- Revenue per product category" />

      <h3>Exercise 2: Orders per Customer with Names</h3>
      <p>
        Join <code>customers</code> with <code>orders</code>. Show each
        customer's <code>first_name</code>, <code>last_name</code>, their total
        number of orders, and the sum of <code>total_amount</code>. Order by
        total amount descending.
      </p>
      <SQLSandbox defaultQuery="-- Customer order summary with names" />

      <h3>Exercise 3: Category and Status Breakdown</h3>
      <p>
        Join <code>order_items</code>, <code>products</code>, and
        <code> orders</code>. Group by product <code>category</code> and order
        <code> status</code>. Show the count of items and total revenue for each
        combination. This gives a multi-dimensional view of your sales.
      </p>
      <SQLSandbox defaultQuery="-- Revenue by category and order status" />
    </div>
  );
}
