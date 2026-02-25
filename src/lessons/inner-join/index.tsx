import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import TableDiagram from '../../components/viz/TableDiagram';
import VennDiagram from '../../components/viz/VennDiagram';

export default function InnerJoin() {
  return (
    <div>
      <h1>Lesson 11: INNER JOIN</h1>
      <p>
        An INNER JOIN is the most common type of join. It returns only the rows where the
        join condition finds a match in <em>both</em> tables. If a row in the left table has
        no corresponding row in the right table, it is excluded from the result entirely,
        and vice versa.
      </p>

      <VennDiagram type="inner" leftLabel="Table A" rightLabel="Table B" />

      <h2>Syntax</h2>
      <p>
        The general form of an INNER JOIN is straightforward. You name two tables, then
        specify the condition that links them in the <code>ON</code> clause.
      </p>

      <CodeBlock code={`SELECT columns
FROM table_a
INNER JOIN table_b
  ON table_a.key = table_b.key;`} />

      <InfoBox title="INNER JOIN is the Default">
        <p>
          Writing <code>JOIN</code> without a prefix is equivalent to <code>INNER JOIN</code>.
          Most SQL developers use the shorter form, but including the keyword <code>INNER</code>
          makes your intent explicit, which is especially helpful in queries with multiple
          join types.
        </p>
      </InfoBox>

      <h2>Matching Rows in Action</h2>
      <p>
        The diagram below shows how an INNER JOIN pairs rows. Only customers that appear in
        both the <code>customers</code> table and the <code>orders</code> table end up in
        the result. Carol, who has no orders, is left out.
      </p>

      <TableDiagram
        leftTitle="customers"
        rightTitle="orders"
        leftRows={['1 Alice', '2 Bob', '3 Carol']}
        rightRows={['#1 cust_1', '#2 cust_2', '#3 cust_1']}
        matchedLeft={[0, 1]}
        matchedRight={[0, 1, 2]}
        matchPairs={[[0, 0], [1, 1], [0, 2]]}
      />

      <h2>Example: Customers and Their Orders</h2>
      <p>
        Let us start with the most natural join in our database: connecting customers to the
        orders they have placed.
      </p>

      <CodeBlock code={`SELECT c.first_name,
       c.last_name,
       o.order_id,
       o.order_date,
       o.total_amount
FROM customers c
INNER JOIN orders o
  ON c.customer_id = o.customer_id;`} />

      <p>
        Because this is an INNER JOIN, any customer who has never placed an order will not
        appear, and any order without a valid customer_id will also be excluded.
      </p>

      <h2>Example: Orders and Their Line Items</h2>
      <p>
        Each order can contain multiple items. Joining <code>orders</code> with
        <code>order_items</code> reveals the individual products and quantities inside
        each order.
      </p>

      <CodeBlock code={`SELECT o.order_id,
       o.order_date,
       oi.product_id,
       oi.quantity,
       oi.unit_price
FROM orders o
INNER JOIN order_items oi
  ON o.order_id = oi.order_id
ORDER BY o.order_id, oi.item_id;`} />

      <h3>Exercise 1: Join Customers to Orders</h3>
      <p>
        Write a query that returns the first name, last name, and total amount for every
        order. Sort results by total amount in descending order.
      </p>

      <SQLSandbox
        title="Exercise 1: Customers and their order totals"
        defaultQuery={`SELECT c.first_name, c.last_name, o.total_amount
FROM customers c
INNER JOIN orders o
  ON c.customer_id = o.customer_id
ORDER BY o.total_amount DESC;`}
      />

      <h3>Exercise 2: Product Details on Each Order Item</h3>
      <p>
        Join <code>order_items</code> to <code>products</code> so that each line item
        includes the product name and category alongside the quantity and unit price.
      </p>

      <SQLSandbox
        title="Exercise 2: Order items with product details"
        defaultQuery={`SELECT oi.order_id,
       p.name AS product_name,
       p.category,
       oi.quantity,
       oi.unit_price
FROM order_items oi
INNER JOIN products p
  ON oi.product_id = p.product_id
ORDER BY oi.order_id;`}
      />

      <h3>Exercise 3: Products and Their Average Rating</h3>
      <p>
        Combine <code>products</code> with <code>reviews</code> to calculate each
        product's average rating. Only products that have at least one review will appear
        because INNER JOIN excludes unmatched rows.
      </p>

      <SQLSandbox
        title="Exercise 3: Average product ratings"
        defaultQuery={`SELECT p.name,
       COUNT(r.review_id) AS review_count,
       ROUND(AVG(r.rating), 1) AS avg_rating
FROM products p
INNER JOIN reviews r
  ON p.product_id = r.product_id
GROUP BY p.product_id, p.name
ORDER BY avg_rating DESC;`}
      />

      <h2>Key Takeaways</h2>
      <ul>
        <li>INNER JOIN returns only rows that have a match in both tables.</li>
        <li>Unmatched rows from either side are silently dropped.</li>
        <li><code>JOIN</code> without a keyword defaults to INNER JOIN.</li>
        <li>Always use the <code>ON</code> clause to specify which columns link the tables.</li>
      </ul>
    </div>
  );
}
