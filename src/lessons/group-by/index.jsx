import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';

export default function GroupBy() {
  return (
    <div>
      <h1>Lesson 16: GROUP BY</h1>
      <p>
        In the previous lesson you learned how aggregate functions collapse an
        entire table into a single summary row. But what if you want a summary
        <em> per category</em>, or a count <em>per status</em>? That is the job
        of <code>GROUP BY</code>. It splits your rows into groups based on one or
        more columns and then applies an aggregate function to each group
        independently.
      </p>

      <h2>How GROUP BY Works</h2>
      <p>
        When the database processes a <code>GROUP BY</code> clause, it first
        collects all rows that share the same value in the grouping column.
        Each collection becomes its own mini-table, and the aggregate functions
        run once per group. The final result has one row per group.
      </p>

      <InfoBox title="Conceptual Model">
        <p>
          Imagine physically sorting your rows into piles by the grouping column.
          The pile labeled "Electronics" contains every product in that category.
          You then count the pile, average its prices, or sum its stock. Each pile
          produces exactly one output row.
        </p>
      </InfoBox>

      <h2>Counting Orders by Status</h2>
      <p>
        A classic use of GROUP BY is counting how many rows fall into each
        category. Here we count orders grouped by their <code>status</code>
        column.
      </p>

      <CodeBlock code={`SELECT status,
       COUNT(*) AS order_count
FROM orders
GROUP BY status;`} />

      <h2>Average Price by Category</h2>
      <p>
        You can pair GROUP BY with any aggregate. The query below finds the
        average price for each product category.
      </p>

      <CodeBlock code={`SELECT category,
       AVG(price) AS avg_price,
       COUNT(*) AS product_count
FROM products
GROUP BY category;`} />

      <h2>The Non-Aggregated Column Rule</h2>
      <p>
        This is the single most important rule to remember: every column that
        appears in your <code>SELECT</code> list must either be listed in the
        <code> GROUP BY</code> clause or be wrapped inside an aggregate function.
        If you break this rule, the database does not know which value to display
        for the group and will raise an error (or, in MySQL with default settings,
        pick an arbitrary value).
      </p>

      <CodeBlock code={`-- WRONG: name is not grouped or aggregated
SELECT category, name, AVG(price)
FROM products
GROUP BY category;

-- RIGHT: include name in GROUP BY, or remove it
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category;`} />

      <WarningBox title="Common GROUP BY Mistake">
        <p>
          If you see an error like "column must appear in the GROUP BY clause or
          be used in an aggregate function," it means your SELECT contains a column
          that is neither grouped nor aggregated. Either add it to GROUP BY, wrap it
          in an aggregate like <code>MAX(name)</code>, or remove it from SELECT.
        </p>
      </WarningBox>

      <h2>Ordering Grouped Results</h2>
      <p>
        You can combine GROUP BY with ORDER BY to sort the summary. Order by an
        aggregate to see the highest or lowest groups first.
      </p>

      <CodeBlock code={`SELECT category,
       SUM(stock_quantity) AS total_stock
FROM products
GROUP BY category
ORDER BY total_stock DESC;`} />

      <h2>Exercises</h2>

      <h3>Exercise 1: Customers per State</h3>
      <p>
        Write a query that counts how many customers are in each <code>state</code>.
        Order the results by the count in descending order.
      </p>
      <SQLSandbox defaultQuery="-- Count customers per state" />

      <h3>Exercise 2: Average Rating per Product</h3>
      <p>
        Using the <code>reviews</code> table, find the average rating for each
        <code> product_id</code>. Include the number of reviews as well. Alias
        them as <code>avg_rating</code> and <code>review_count</code>.
      </p>
      <SQLSandbox defaultQuery="-- Average rating and review count per product" />

      <h3>Exercise 3: Total Revenue by Order Status</h3>
      <p>
        Group the <code>orders</code> table by <code>status</code> and compute
        the total <code>total_amount</code> for each status. Sort by revenue
        descending.
      </p>
      <SQLSandbox defaultQuery="-- Total revenue grouped by order status" />
    </div>
  );
}
