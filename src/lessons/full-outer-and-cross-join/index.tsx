import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';
import VennDiagram from '../../components/viz/VennDiagram';

export default function FullOuterAndCrossJoin() {
  return (
    <div>
      <h1>Lesson 13: FULL OUTER JOIN and CROSS JOIN</h1>
      <p>
        In the previous lessons we covered INNER JOIN, which keeps only matched rows, and
        LEFT/RIGHT JOIN, which preserves all rows from one side. This lesson introduces the
        remaining two join types: FULL OUTER JOIN, which preserves unmatched rows from
        <em>both</em> sides, and CROSS JOIN, which produces every possible combination of
        rows.
      </p>

      <h2>FULL OUTER JOIN</h2>
      <p>
        A FULL OUTER JOIN returns every row from both the left and right tables. Where a
        match exists, the columns from both sides are populated. Where a row has no match,
        the missing side is filled with <code>NULL</code>. Think of it as running a LEFT
        JOIN and a RIGHT JOIN simultaneously.
      </p>

      <VennDiagram type="full" leftLabel="Table A" rightLabel="Table B" />

      <CodeBlock code={`-- Standard FULL OUTER JOIN syntax
SELECT a.col1, b.col2
FROM table_a a
FULL OUTER JOIN table_b b
  ON a.key = b.key;`} />

      <p>
        This is useful when you need a complete picture of both tables, including records
        that exist only on one side. For instance, you might want a report showing all
        customers and all orders, highlighting customers with no orders and orders with
        no valid customer.
      </p>

      <DialectNote title="FULL OUTER JOIN and SQLite">
        <p>
          SQLite does not natively support <code>FULL OUTER JOIN</code>. PostgreSQL, SQL
          Server, and Oracle support it directly. In SQLite, you can simulate a FULL OUTER
          JOIN by combining a LEFT JOIN with a UNION ALL of the unmatched right-side rows:
        </p>
      </DialectNote>

      <CodeBlock label="SQLite Workaround" code={`-- Simulating FULL OUTER JOIN in SQLite
SELECT c.first_name, c.last_name, o.order_id, o.total_amount
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id

UNION ALL

SELECT c.first_name, c.last_name, o.order_id, o.total_amount
FROM orders o
LEFT JOIN customers c
  ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`} />

      <p>
        The first query gets all customers (with or without orders). The second query picks
        up any orders that have no matching customer. Together, they replicate the behavior
        of a FULL OUTER JOIN.
      </p>

      <h2>CROSS JOIN</h2>
      <p>
        A CROSS JOIN produces the <strong>Cartesian product</strong> of two tables: every
        row from the left table is paired with every row from the right table. If the left
        table has 10 rows and the right has 5, the result contains 50 rows. There is no
        <code>ON</code> clause because no matching condition is needed.
      </p>

      <VennDiagram type="cross" leftLabel="Table A" rightLabel="Table B" />

      <CodeBlock code={`-- Every combination of product and category label
SELECT p.name, c.category
FROM products p
CROSS JOIN (SELECT DISTINCT category FROM products) c;`} />

      <WarningBox title="CROSS JOIN Can Produce Enormous Results">
        <p>
          Because a CROSS JOIN multiplies the row counts of both tables, it can generate
          massive result sets very quickly. A CROSS JOIN between two tables of 1,000 rows
          each produces 1,000,000 rows. Only use CROSS JOIN when you genuinely need every
          combination, and always consider whether a more targeted join type would work.
        </p>
      </WarningBox>

      <h3>When CROSS JOIN Is Useful</h3>
      <p>
        Despite the warning, CROSS JOIN has legitimate uses. It is helpful for generating
        grids, calendars, or lookup tables. For example, if you have a list of months and a
        list of products, a CROSS JOIN creates a row for every product-month combination,
        which you can then LEFT JOIN against actual sales data to identify gaps.
      </p>

      <CodeBlock code={`-- Create a product-status grid to find missing combinations
SELECT p.name, s.status
FROM products p
CROSS JOIN (
  SELECT 'pending' AS status
  UNION ALL SELECT 'shipped'
  UNION ALL SELECT 'delivered'
) s
ORDER BY p.name, s.status;`} />

      <h3>Exercise 1: Simulate a FULL OUTER JOIN</h3>
      <p>
        Using the SQLite workaround (LEFT JOIN plus UNION ALL), write a query that shows all
        customers and all orders, including customers with no orders and orders with no valid
        customer.
      </p>

      <SQLSandbox
        title="Exercise 1: Full outer join simulation"
        defaultQuery={`-- All customers with their orders (including unmatched on both sides)
SELECT c.first_name, c.last_name, o.order_id, o.total_amount
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id

UNION ALL

SELECT c.first_name, c.last_name, o.order_id, o.total_amount
FROM orders o
LEFT JOIN customers c
  ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`}
      />

      <h3>Exercise 2: CROSS JOIN for a Product-Category Grid</h3>
      <p>
        Generate every combination of product name with the distinct set of categories in
        the products table. This kind of grid can help identify which categories a product
        might expand into.
      </p>

      <SQLSandbox
        title="Exercise 2: Product and category cross join"
        defaultQuery={`SELECT p.name AS product_name,
       cat.category AS category_label
FROM products p
CROSS JOIN (SELECT DISTINCT category FROM products) cat
ORDER BY p.name, cat.category;`}
      />

      <InfoBox title="Choosing the Right Join Type">
        <p>
          Use INNER JOIN when you only want matched data. Use LEFT JOIN when you need all
          rows from one table. Use FULL OUTER JOIN when both sides might have unmatched rows.
          Reserve CROSS JOIN for intentional combinatorial queries. Picking the right join
          type is one of the most important decisions in query design.
        </p>
      </InfoBox>

      <h2>Key Takeaways</h2>
      <ul>
        <li>FULL OUTER JOIN preserves unmatched rows from both tables, filling NULLs where needed.</li>
        <li>SQLite lacks native FULL OUTER JOIN support; use a LEFT JOIN plus UNION ALL workaround.</li>
        <li>CROSS JOIN produces the Cartesian product -- every combination of rows from both tables.</li>
        <li>Be cautious with CROSS JOIN on large tables; the result set grows multiplicatively.</li>
      </ul>
    </div>
  );
}
