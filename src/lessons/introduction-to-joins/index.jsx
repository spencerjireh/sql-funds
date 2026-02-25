import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import VennDiagram from '../../components/viz/VennDiagram';
import TableDiagram from '../../components/viz/TableDiagram';

export default function IntroductionToJoins() {
  return (
    <div>
      <h1>Lesson 10: Introduction to Joins</h1>
      <p>
        So far, every query we have written has pulled data from a single table. But real
        databases almost never store everything in one place. Customer details live in the
        <code>customers</code> table, order records in the <code>orders</code> table, and
        product information in the <code>products</code> table. Joins are the mechanism SQL
        provides for combining rows from two or more tables into a single result set based
        on a related column.
      </p>

      <h2>Why Data Is Split Across Tables</h2>
      <p>
        Imagine storing the full customer name and address on every single order row. If a
        customer moved, you would need to update hundreds of rows, and any missed update
        would leave your data inconsistent. Database designers avoid this problem through a
        process called <strong>normalization</strong>: they split data into focused tables and
        link them with shared keys. Each fact is stored exactly once, and relationships are
        expressed through columns that reference other tables.
      </p>

      <InfoBox title="Why Normalization Matters">
        <p>
          Normalization reduces data duplication, prevents update anomalies, and makes your
          database easier to maintain. When a customer changes their email, you update a
          single row in the <code>customers</code> table rather than hunting through every
          related record.
        </p>
      </InfoBox>

      <h2>Foreign Keys Create Relationships</h2>
      <p>
        A <strong>foreign key</strong> is a column in one table that references the primary
        key of another. In our database, <code>orders.customer_id</code> references
        <code>customers.customer_id</code>. This link is what makes joins possible: SQL can
        follow the shared key to match each order with the customer who placed it.
      </p>

      <CodeBlock code={`-- The orders table has a customer_id column
-- that references customers.customer_id
SELECT customer_id, order_date, total_amount
FROM orders;`} />

      <h2>How Joins Combine Rows</h2>
      <p>
        At its core, a join examines rows from two tables and pairs them based on a
        condition you specify, most commonly an equality check between a foreign key and
        the primary key it references. The result is a new set of rows that contains columns
        from both tables. The diagram below illustrates how the <code>customers</code> and
        <code>orders</code> tables are linked by <code>customer_id</code>.
      </p>

      <TableDiagram
        leftTitle="customers"
        rightTitle="orders"
        leftRows={['1 Alice', '2 Bob', '3 Carol']}
        rightRows={['#1 cust_1', '#2 cust_2', '#3 cust_1']}
        matchedLeft={[0, 1, 0]}
        matchedRight={[0, 1, 2]}
        matchPairs={[[0, 0], [1, 1], [0, 2]]}
      />

      <p>
        Notice that Alice (customer 1) matches two different orders, while Bob matches one.
        Carol has no matching order in this example. Different types of joins handle
        unmatched rows differently, and we will explore each type in the lessons ahead.
      </p>

      <h2>The Venn Diagram View</h2>
      <p>
        A common way to visualize joins is with overlapping circles. The shaded region
        represents the rows returned. For an <strong>INNER JOIN</strong>, only the overlap
        -- rows that match in both tables -- is included.
      </p>

      <VennDiagram type="inner" leftLabel="customers" rightLabel="orders" />

      <h2>Your First Join</h2>
      <p>
        The basic syntax for a join looks like this:
      </p>

      <CodeBlock code={`SELECT customers.first_name,
       customers.last_name,
       orders.order_date,
       orders.total_amount
FROM customers
JOIN orders
  ON customers.customer_id = orders.customer_id;`} />

      <p>
        The <code>FROM</code> clause names the first table, <code>JOIN</code> names the
        second, and <code>ON</code> specifies which columns to match. The result set
        includes columns from both tables, giving you a complete picture that spans the
        relationship.
      </p>

      <h3>Try It Yourself</h3>
      <p>
        Run the query below to see customers paired with their orders. Experiment by adding
        a <code>WHERE</code> clause or changing which columns appear in the <code>SELECT</code>.
      </p>

      <SQLSandbox
        title="Exercise: Join customers and orders"
        defaultQuery={`SELECT c.first_name, c.last_name, o.order_date, o.total_amount
FROM customers c
JOIN orders o
  ON c.customer_id = o.customer_id
ORDER BY o.order_date;`}
      />

      <h2>Key Takeaways</h2>
      <ul>
        <li>Joins let you recombine data that normalization has separated into different tables.</li>
        <li>Foreign keys define the relationships that joins follow.</li>
        <li>The <code>ON</code> clause tells SQL which columns to match between the two tables.</li>
        <li>There are several types of joins; the next lessons cover each one in detail.</li>
      </ul>
    </div>
  );
}
