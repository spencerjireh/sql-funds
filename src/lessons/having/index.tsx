import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import FlowDiagram from '../../components/viz/FlowDiagram';

export default function Having() {
  return (
    <div>
      <h1>Lesson 17: Filtering Groups with HAVING</h1>
      <p>
        You already know how to filter individual rows with <code>WHERE</code> and
        how to create grouped summaries with <code>GROUP BY</code>. But what
        happens when you want to keep only certain groups -- for example, only
        categories that have more than five products, or only customers whose
        total spending exceeds a threshold? You cannot use <code>WHERE</code> for
        this because WHERE runs <em>before</em> grouping happens. Instead, SQL
        gives you <code>HAVING</code>, which filters groups <em>after</em> aggregation.
      </p>

      <h2>Query Execution Order</h2>
      <p>
        To understand HAVING you need to know the order in which SQL processes a
        query. It is not top-to-bottom like you might read it. The actual order is
        shown below.
      </p>

      <FlowDiagram
        steps={['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY']}
        highlight="HAVING"
      />

      <InfoBox title="Execution Order Matters">
        <p>
          Because WHERE runs at step 2 and HAVING runs at step 4, WHERE can only
          reference raw table columns. HAVING runs after GROUP BY, so it can
          reference aggregate results like <code>COUNT(*)</code> or
          <code> SUM(total_amount)</code>. Mixing them up is one of the most
          common mistakes beginners make.
        </p>
      </InfoBox>

      <h2>WHERE vs HAVING</h2>
      <p>
        The simplest way to remember the difference: <code>WHERE</code> filters
        rows, <code>HAVING</code> filters groups. Consider these two queries.
      </p>

      <CodeBlock code={`-- WHERE: filter rows before grouping
-- Only look at products priced above 20
SELECT category, COUNT(*) AS product_count
FROM products
WHERE price > 20
GROUP BY category;`} />

      <CodeBlock code={`-- HAVING: filter groups after aggregation
-- Only show categories with more than 2 products
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING COUNT(*) > 2;`} />

      <p>
        In the first query, individual rows with a price of 20 or less are
        discarded before any grouping occurs. In the second query, all products
        are grouped first, and then groups with two or fewer products are removed
        from the result.
      </p>

      <h2>Combining WHERE and HAVING</h2>
      <p>
        You can use both in the same query. WHERE narrows the rows first, then
        GROUP BY creates the groups, and finally HAVING removes groups that do
        not meet your criteria.
      </p>

      <CodeBlock code={`-- Products priced over 10, grouped by category,
-- only showing categories with 3+ qualifying products
SELECT category,
       COUNT(*) AS product_count,
       AVG(price) AS avg_price
FROM products
WHERE price > 10
GROUP BY category
HAVING COUNT(*) >= 3
ORDER BY avg_price DESC;`} />

      <WarningBox title="Do Not Use HAVING for Row-Level Filters">
        <p>
          While some databases allow you to put row-level conditions in HAVING
          instead of WHERE, doing so is poor practice. It makes your query harder
          to read and can hurt performance because the database cannot eliminate
          rows early. Always filter individual rows with WHERE and reserve HAVING
          for conditions on aggregate values.
        </p>
      </WarningBox>

      <h2>HAVING with Different Aggregates</h2>
      <p>
        HAVING is not limited to COUNT. You can filter on SUM, AVG, MIN, MAX, or
        any other aggregate expression.
      </p>

      <CodeBlock code={`-- Customers whose total order spending exceeds 500
SELECT customer_id,
       COUNT(*) AS order_count,
       SUM(total_amount) AS total_spent
FROM orders
GROUP BY customer_id
HAVING SUM(total_amount) > 500
ORDER BY total_spent DESC;`} />

      <h2>Exercises</h2>

      <h3>Exercise 1: Popular Categories</h3>
      <p>
        Find product categories that contain more than 2 products. Display the
        category name and the product count, sorted by count descending.
      </p>
      <SQLSandbox defaultQuery="-- Categories with more than 2 products" />

      <h3>Exercise 2: Big Spenders</h3>
      <p>
        Identify customers who have spent more than 500 dollars in total. Show
        <code> customer_id</code>, the number of orders, and the total amount
        spent. Order by total spent descending.
      </p>
      <SQLSandbox defaultQuery="-- Customers with total orders > 500" />

      <h3>Exercise 3: Well-Reviewed Products</h3>
      <p>
        Using the <code>reviews</code> table, find products that have received
        at least 3 reviews and have an average rating of 4 or higher. Show
        <code> product_id</code>, <code>review_count</code>, and
        <code> avg_rating</code>.
      </p>
      <SQLSandbox defaultQuery="-- Products with 3+ reviews and avg rating >= 4" />
    </div>
  );
}
