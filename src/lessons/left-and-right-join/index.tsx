import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import VennDiagram from '../../components/viz/VennDiagram';
import TableDiagram from '../../components/viz/TableDiagram';

export default function LeftAndRightJoin() {
  return (
    <div>
      <h1>Lesson 12: LEFT JOIN and RIGHT JOIN</h1>
      <p>
        INNER JOIN drops every row that does not find a match. That is fine when you only
        want paired data, but sometimes you need to keep all rows from one side of the join
        regardless of whether a match exists. That is exactly what LEFT JOIN and RIGHT JOIN
        provide.
      </p>

      <h2>LEFT JOIN</h2>
      <p>
        A LEFT JOIN (also written <code>LEFT OUTER JOIN</code>) returns every row from the
        left table. When a matching row exists in the right table, the columns from that
        table are filled in normally. When no match is found, those columns are filled with
        <code>NULL</code>.
      </p>

      <VennDiagram type="left" leftLabel="Left Table" rightLabel="Right Table" />

      <CodeBlock code={`SELECT columns
FROM left_table
LEFT JOIN right_table
  ON left_table.key = right_table.key;`} />

      <h2>RIGHT JOIN</h2>
      <p>
        A RIGHT JOIN is the mirror image of a LEFT JOIN. It keeps every row from the
        <em>right</em> table and fills in <code>NULL</code> for columns from the left table
        when no match is found. In practice, most developers rewrite RIGHT JOINs as LEFT
        JOINs by simply swapping the table order, because it tends to be easier to read.
      </p>

      <VennDiagram type="right" leftLabel="Left Table" rightLabel="Right Table" />

      <h2>Visualizing the Match</h2>
      <p>
        In the diagram below, notice that every product on the left is preserved. Products
        without a review still appear, but the review columns will be <code>NULL</code>.
      </p>

      <TableDiagram
        leftTitle="products"
        rightTitle="reviews"
        leftRows={['1 Widget', '2 Gadget', '3 Gizmo']}
        rightRows={['rev_1 prod_1', 'rev_2 prod_1', 'rev_3 prod_2']}
        matchedLeft={[0, 1]}
        matchedRight={[0, 1, 2]}
        matchPairs={[[0, 0], [0, 1], [1, 2]]}
      />
      <p>
        Gizmo (product 3) has no matching review, but it still appears in the LEFT JOIN
        result. Its review columns will contain <code>NULL</code>.
      </p>

      <h2>Finding Records with No Match</h2>
      <p>
        One of the most valuable patterns with LEFT JOIN is filtering for rows that have
        <em>no</em> match on the other side. By adding a <code>WHERE</code> clause that
        checks for <code>NULL</code> in a column from the right table, you can isolate the
        unmatched rows.
      </p>

      <CodeBlock code={`-- Products that have never been reviewed
SELECT p.product_id, p.name, p.category
FROM products p
LEFT JOIN reviews r
  ON p.product_id = r.product_id
WHERE r.review_id IS NULL;`} />

      <CodeBlock code={`-- Customers who have never placed an order
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;`} />

      <WarningBox title="NULLs in Outer Joins">
        <p>
          When a LEFT JOIN produces <code>NULL</code> values for unmatched rows, those NULLs
          can cause unexpected behavior in calculations and comparisons. For example,
          <code>SUM()</code> ignores NULLs, but a <code>WHERE amount &gt; 0</code> filter
          will exclude NULL rows silently. Always account for NULLs when working with outer
          join results, using <code>IS NULL</code>, <code>IS NOT NULL</code>, or
          <code>COALESCE()</code> as needed.
        </p>
      </WarningBox>

      <h3>Exercise 1: Products Without Reviews</h3>
      <p>
        Write a query that finds every product that has not received a single review. Return
        the product name and category.
      </p>

      <SQLSandbox
        title="Exercise 1: Unreviewed products"
        defaultQuery={`SELECT p.name, p.category
FROM products p
LEFT JOIN reviews r
  ON p.product_id = r.product_id
WHERE r.review_id IS NULL;`}
      />

      <h3>Exercise 2: All Customers with Order Counts</h3>
      <p>
        List every customer along with how many orders they have placed. Customers with
        zero orders should still appear, showing a count of 0.
      </p>

      <SQLSandbox
        title="Exercise 2: Customer order counts (including zero)"
        defaultQuery={`SELECT c.first_name,
       c.last_name,
       COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY order_count DESC;`}
      />

      <h3>Exercise 3: Products with Optional Review Averages</h3>
      <p>
        Show every product alongside its average rating. Products without reviews should
        display <code>NULL</code> for the average rather than being excluded.
      </p>

      <SQLSandbox
        title="Exercise 3: All products with optional average rating"
        defaultQuery={`SELECT p.name,
       p.category,
       ROUND(AVG(r.rating), 1) AS avg_rating,
       COUNT(r.review_id) AS review_count
FROM products p
LEFT JOIN reviews r
  ON p.product_id = r.product_id
GROUP BY p.product_id, p.name, p.category
ORDER BY avg_rating DESC;`}
      />

      <InfoBox title="LEFT JOIN vs. RIGHT JOIN in Practice">
        <p>
          You can always convert a RIGHT JOIN into a LEFT JOIN by swapping the table order.
          Most teams standardize on LEFT JOIN for consistency and readability. Use whichever
          form makes the intent of your query clearest.
        </p>
      </InfoBox>

      <h2>Key Takeaways</h2>
      <ul>
        <li>LEFT JOIN preserves all rows from the left table, filling NULLs where no match exists.</li>
        <li>RIGHT JOIN does the same for the right table.</li>
        <li>The <code>WHERE right_col IS NULL</code> pattern is the standard way to find unmatched rows.</li>
        <li>Always be deliberate about how NULLs from outer joins affect your filters and aggregations.</li>
      </ul>
    </div>
  );
}
