import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';

export default function FilteringWithInAndBetween() {
  return (
    <div>
      <h1>Lesson 9: IN, BETWEEN, and Advanced Filtering</h1>
      <p>
        In earlier lessons you learned to filter rows with WHERE and comparison
        operators. As your queries grow more complex, you will often need to check
        a column against a list of values, test whether it falls within a range, or
        eliminate duplicates from your results. This lesson covers three powerful
        tools for these tasks: <strong>IN</strong>, <strong>BETWEEN</strong>, and
        <strong>DISTINCT</strong>.
      </p>

      <h2>The IN Operator</h2>
      <p>
        <code>IN</code> lets you check whether a value matches any item in a list.
        It replaces the need for writing multiple OR conditions and is much easier
        to read.
      </p>
      <CodeBlock code={`-- Instead of this:
SELECT first_name, last_name, state
FROM customers
WHERE state = 'CA' OR state = 'NY' OR state = 'TX';

-- Write this:
SELECT first_name, last_name, state
FROM customers
WHERE state IN ('CA', 'NY', 'TX');`} />
      <p>
        Both queries produce the same result, but the IN version is shorter, clearer,
        and easier to extend when you need to add more values.
      </p>

      <InfoBox title="IN vs. Multiple OR Conditions">
        <p>
          Use <code>IN</code> whenever you compare a single column against a list
          of values. It is functionally equivalent to chaining OR conditions but
          more concise and less error-prone. Most database engines optimize IN
          and OR identically, so the choice is about readability. If your list is
          very long, consider using a subquery or temporary table instead.
        </p>
      </InfoBox>

      <p>
        You can also negate it with <code>NOT IN</code> to exclude specific values:
      </p>
      <CodeBlock code={`SELECT name, category
FROM products
WHERE category NOT IN ('Electronics', 'Clothing');`} />

      <h2>The BETWEEN Operator</h2>
      <p>
        <code>BETWEEN</code> filters rows where a column value falls within a
        range. The range is <strong>inclusive on both ends</strong> -- the boundary
        values are included in the results.
      </p>
      <CodeBlock code={`-- Products priced from $10.00 to $50.00 (inclusive)
SELECT name, price
FROM products
WHERE price BETWEEN 10 AND 50;`} />
      <p>
        This is equivalent to <code>WHERE price &gt;= 10 AND price &lt;= 50</code>.
        BETWEEN also works with dates, making it ideal for filtering by time period:
      </p>
      <CodeBlock code={`SELECT order_id, order_date, total_amount
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-06-30';`} />

      <WarningBox title="BETWEEN is Inclusive">
        <p>
          BETWEEN includes both boundary values. <code>WHERE price BETWEEN 10 AND
          50</code> returns rows where price is exactly 10 or 50, not just values
          strictly in between. To exclude boundaries, use comparison operators
          instead: <code>WHERE price &gt; 10 AND price &lt; 50</code>.
        </p>
      </WarningBox>

      <h2>DISTINCT: Removing Duplicates</h2>
      <p>
        When a column contains repeated values, <code>DISTINCT</code> eliminates
        the duplicates and returns only unique values. Place it right after SELECT.
      </p>
      <CodeBlock code={`-- List every unique city where we have customers
SELECT DISTINCT city
FROM customers
ORDER BY city;`} />

      <DialectNote>
        <p>
          Most SQL dialects support IN, BETWEEN, and DISTINCT identically.
          However, PostgreSQL offers <code>DISTINCT ON (column)</code> which
          returns only the first row for each unique value of the specified
          column -- a feature not available in MySQL or SQL Server. It is useful
          for de-duplication queries but is not part of the SQL standard.
        </p>
      </DialectNote>

      <h2>Combining These Tools</h2>
      <p>
        All of these operators work inside the WHERE clause and can be combined
        freely with AND and OR to build precise filters:
      </p>
      <CodeBlock code={`SELECT name, category, price
FROM products
WHERE category IN ('Electronics', 'Books')
  AND price BETWEEN 15 AND 100
ORDER BY price DESC;`} />

      <h2>Practice Exercises</h2>

      <h3>Exercise 1: Filtering with IN</h3>
      <p>
        Find all customers who live in California (CA), New York (NY), or
        Washington (WA). Return their first name, last name, and state.
      </p>
      <SQLSandbox
        title="Customers in selected states"
        defaultQuery={`SELECT first_name, last_name, state
FROM customers
WHERE `}
      />

      <h3>Exercise 2: Range Filtering with BETWEEN</h3>
      <p>
        Find all products with a price between $20 and $80 (inclusive). Return the
        product name and price, sorted by price ascending.
      </p>
      <SQLSandbox
        title="Products in a price range"
        defaultQuery={`SELECT name, price
FROM products`}
      />

      <h3>Exercise 3: Unique Values</h3>
      <p>
        List all the distinct cities from the customers table, sorted
        alphabetically.
      </p>
      <SQLSandbox
        title="Distinct customer cities"
        defaultQuery={`SELECT city
FROM customers
ORDER BY city;`}
      />
    </div>
  );
}
