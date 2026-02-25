import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';

export default function SelfJoinsAndMultipleJoins() {
  return (
    <div>
      <h1>Lesson 14: Self Joins and Multi-Table Joins</h1>
      <p>
        Every join example so far has paired two different tables. But SQL is more flexible
        than that. You can join a table to itself (a <strong>self join</strong>), and you can
        chain multiple joins in a single query to pull data from three, four, or more tables
        at once. This lesson covers both techniques.
      </p>

      <h2>Self Joins</h2>
      <p>
        A self join is simply a join where the same table appears on both sides. Because the
        table name would be ambiguous, you <em>must</em> use aliases to distinguish the two
        references. Self joins are useful whenever rows within a single table have a logical
        relationship to other rows in that same table.
      </p>

      <h3>Example: Customers in the Same City</h3>
      <p>
        Suppose you want to find pairs of customers who live in the same city. You join the
        <code>customers</code> table to itself on the <code>city</code> column, then exclude
        cases where a customer is paired with themselves.
      </p>

      <CodeBlock code={`SELECT a.first_name AS customer_a,
       b.first_name AS customer_b,
       a.city
FROM customers a
JOIN customers b
  ON a.city = b.city
 AND a.customer_id < b.customer_id
ORDER BY a.city;`} />

      <p>
        The condition <code>a.customer_id &lt; b.customer_id</code> serves two purposes: it
        prevents pairing a customer with themselves, and it ensures each pair appears only
        once (Alice-Bob but not Bob-Alice).
      </p>

      <h3>Example: Products in the Same Category and Price Range</h3>
      <p>
        Self joins are also helpful for comparing products. The query below finds pairs of
        products that share a category and are priced within $10 of each other.
      </p>

      <CodeBlock code={`SELECT a.name AS product_a,
       b.name AS product_b,
       a.category,
       a.price AS price_a,
       b.price AS price_b
FROM products a
JOIN products b
  ON a.category = b.category
 AND a.product_id < b.product_id
 AND ABS(a.price - b.price) <= 10
ORDER BY a.category, a.name;`} />

      <InfoBox title="Use Meaningful Aliases">
        <p>
          When writing self joins, avoid cryptic single-letter aliases. Names like
          <code>cust_a</code> and <code>cust_b</code>, or <code>p1</code> and
          <code>p2</code>, make the query much easier to read. For short examples, single
          letters are acceptable, but in production queries clarity should come first.
        </p>
      </InfoBox>

      <h2>Multi-Table Joins</h2>
      <p>
        Real-world queries often need data from more than two tables. You chain joins by
        adding additional <code>JOIN ... ON</code> clauses. Each new join attaches another
        table to the growing result set.
      </p>

      <h3>Example: The Full Order Picture</h3>
      <p>
        One of the most common multi-table queries in an e-commerce database starts at
        <code>customers</code>, travels through <code>orders</code> and
        <code>order_items</code>, and arrives at <code>products</code>. This gives you the
        customer name, order details, and product name all in one result.
      </p>

      <CodeBlock code={`SELECT c.first_name,
       c.last_name,
       o.order_id,
       o.order_date,
       p.name AS product_name,
       oi.quantity,
       oi.unit_price
FROM customers c
JOIN orders o
  ON c.customer_id = o.customer_id
JOIN order_items oi
  ON o.order_id = oi.order_id
JOIN products p
  ON oi.product_id = p.product_id
ORDER BY o.order_date, o.order_id;`} />

      <p>
        Read the chain of joins like a path through the database: customers connect to
        orders via <code>customer_id</code>, orders connect to order_items via
        <code>order_id</code>, and order_items connect to products via
        <code>product_id</code>. Each <code>ON</code> clause specifies one link in the
        chain.
      </p>

      <WarningBox title="Watch the Row Count">
        <p>
          When you chain multiple joins, especially through one-to-many relationships, the
          result set can grow quickly. An order with 5 items generates 5 rows per order.
          Multiply that across hundreds of orders and you may end up with thousands of rows.
          Be mindful of the output size and use <code>LIMIT</code> while exploring.
        </p>
      </WarningBox>

      <h3>Exercise 1: Customers in the Same City</h3>
      <p>
        Write a self join on the <code>customers</code> table to find pairs of customers who
        live in the same city. Return both customer names and the city. Make sure each pair
        appears only once.
      </p>

      <SQLSandbox
        title="Exercise 1: Self join -- customers in the same city"
        defaultQuery={`SELECT a.first_name AS customer_a,
       b.first_name AS customer_b,
       a.city
FROM customers a
JOIN customers b
  ON a.city = b.city
 AND a.customer_id < b.customer_id
ORDER BY a.city;`}
      />

      <h3>Exercise 2: Full Order Details (4-Table Join)</h3>
      <p>
        Chain four tables together to produce a report with the customer name, order date,
        product name, quantity, and unit price for every line item in every order.
      </p>

      <SQLSandbox
        title="Exercise 2: Four-table join"
        defaultQuery={`SELECT c.first_name || ' ' || c.last_name AS customer,
       o.order_date,
       p.name AS product,
       oi.quantity,
       oi.unit_price,
       oi.quantity * oi.unit_price AS line_total
FROM customers c
JOIN orders o   ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
ORDER BY o.order_date, o.order_id;`}
      />

      <h3>Exercise 3: Customer Spending with Product Reviews</h3>
      <p>
        Build a query that joins five tables to show which reviewed products each customer
        has purchased. Include the customer name, product name, quantity ordered, and the
        rating the customer gave.
      </p>

      <SQLSandbox
        title="Exercise 3: Five-table join with reviews"
        defaultQuery={`SELECT c.first_name || ' ' || c.last_name AS customer,
       p.name AS product,
       oi.quantity,
       r.rating,
       r.comment
FROM customers c
JOIN orders o       ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p     ON oi.product_id = p.product_id
JOIN reviews r      ON r.product_id = p.product_id
                   AND r.customer_id = c.customer_id
ORDER BY c.last_name, p.name;`}
      />

      <h2>Key Takeaways</h2>
      <ul>
        <li>Self joins let you compare rows within the same table; aliases are required to avoid ambiguity.</li>
        <li>Use <code>a.id &lt; b.id</code> to prevent duplicate pairs and self-matches in self joins.</li>
        <li>Multi-table joins chain several <code>JOIN ... ON</code> clauses to traverse relationships.</li>
        <li>Each join follows a foreign key path; think of it as walking through the schema one link at a time.</li>
        <li>Keep an eye on result set size when chaining multiple one-to-many relationships.</li>
      </ul>
    </div>
  );
}
