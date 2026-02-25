import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';
import DataTable from '../../components/DataTable';

export default function AliasingAndExpressions() {
  return (
    <div>
      <h1>Aliases and Expressions</h1>
      <p>
        Up to this point every column in your results has carried the name it was given
        when the table was created. But SQL lets you rename columns on the fly with
        <strong> aliases</strong> and even create brand-new computed columns using
        arithmetic and string expressions. These two techniques make your output more
        readable and your queries far more powerful.
      </p>

      <h2>Column Aliases with AS</h2>
      <p>
        The <code>AS</code> keyword lets you give a column a temporary name in the result
        set. The original table is not changed -- the alias exists only for the duration
        of the query. This is especially useful when column names are cryptic or when you
        compute a value that has no natural name.
      </p>

      <CodeBlock code={`-- Rename columns for a cleaner report
SELECT
  first_name AS "First Name",
  last_name  AS "Last Name",
  email      AS "Email Address"
FROM customers;`} />

      <InfoBox title="Quoting Alias Names">
        <p>
          If your alias is a single word with no spaces, quotes are optional:
          <code> SELECT price AS cost</code> works fine. If the alias contains spaces or
          special characters, wrap it in double quotes:
          <code> SELECT price AS "Unit Cost"</code>. Some dialects accept backticks or
          square brackets instead.
        </p>
      </InfoBox>

      <h2>Table Aliases</h2>
      <p>
        You can also alias table names. This is mostly a convenience for now, but it
        becomes essential when you start joining multiple tables in later lessons. A table
        alias shortens the table reference to one or two letters.
      </p>

      <CodeBlock code={`-- "c" is an alias for the customers table
SELECT c.first_name, c.last_name, c.email
FROM customers AS c;`} />

      <p>
        In most dialects the <code>AS</code> keyword is optional for table aliases, so
        you will often see <code>FROM customers c</code> without it. Both forms are valid.
      </p>

      <h2>Arithmetic Expressions</h2>
      <p>
        SQL supports standard arithmetic in the <code>SELECT</code> clause. You can add,
        subtract, multiply, and divide column values or literal numbers. The result appears
        as a new column in the output.
      </p>

      <CodeBlock code={`-- Calculate line item totals
SELECT
  id,
  product_id,
  quantity,
  unit_price,
  quantity * unit_price AS line_total
FROM order_items;`} />

      <DataTable
        headers={['id', 'product_id', 'quantity', 'unit_price', 'line_total']}
        rows={[
          [1, 101, 2, 29.99, 59.98],
          [2, 204, 1, 149.00, 149.00],
          [3, 101, 3, 29.99, 89.97],
        ]}
        caption="Example output showing a computed line_total column"
      />

      <p>
        Without the alias, the computed column would show a generated name like
        <code> quantity * unit_price</code>. Giving it a clear alias makes the output
        self-explanatory. You can use any arithmetic -- addition, subtraction, division,
        and multiplication -- in the same way.
      </p>

      <h2>String Concatenation</h2>
      <p>
        Sometimes you want to combine text from multiple columns into one. Standard SQL
        uses the <code>||</code> operator for this, but MySQL uses the
        <code> CONCAT()</code> function instead.
      </p>

      <CodeBlock code={`-- Combine first and last name (standard SQL / SQLite / PostgreSQL)
SELECT
  first_name || ' ' || last_name AS full_name,
  email
FROM customers;`} />

      <DialectNote title="Concatenation Differences">
        <p>
          In <strong>PostgreSQL</strong> and <strong>SQLite</strong>, use the
          <code> ||</code> operator: <code>first_name || ' ' || last_name</code>. In
          <strong> MySQL</strong>, use the <code>CONCAT()</code> function:
          <code> CONCAT(first_name, ' ', last_name)</code>. SQL Server uses the
          <code> +</code> operator. Always check which syntax your database expects.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Rename columns with aliases</h3>
      <p>
        Select the <code>name</code> and <code>price</code> columns from
        <code> products</code>, but rename them to <code>Product</code> and
        <code> "Retail Price"</code> using aliases.
      </p>

      <SQLSandbox defaultQuery={'SELECT name AS Product, price AS "Retail Price" FROM products;'} />

      <h3>Exercise 2: Compute line totals</h3>
      <p>
        Query the <code>order_items</code> table and add a computed column that multiplies
        <code> quantity</code> by <code>unit_price</code>. Give it the alias
        <code> line_total</code>.
      </p>

      <SQLSandbox defaultQuery="SELECT id, product_id, quantity, unit_price, quantity * unit_price AS line_total FROM order_items;" />

      <h3>Exercise 3: Build a full name</h3>
      <p>
        Concatenate <code>first_name</code> and <code>last_name</code> from the
        <code> customers</code> table into a single <code>full_name</code> column. Our
        sandbox uses SQLite, so use the <code>||</code> operator.
      </p>

      <SQLSandbox defaultQuery="SELECT first_name || ' ' || last_name AS full_name, email FROM customers;" />
    </div>
  );
}
