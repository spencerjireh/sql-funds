import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import FlowDiagram from '../../components/viz/FlowDiagram';

export default function FilteringWithWhere() {
  return (
    <div>
      <h1>Filtering with WHERE</h1>
      <p>
        So far every query has returned every row in a table. In practice you almost always
        want a subset -- orders placed this month, products under a certain price, or a
        single customer looked up by email. The <code>WHERE</code> clause lets you describe
        conditions that each row must satisfy to appear in the results.
      </p>

      <h2>Where WHERE Fits In</h2>
      <p>
        The database evaluates <code>WHERE</code> after it reads the table but before it
        selects columns. Rows that fail the condition are discarded and never make it to
        the output.
      </p>

      <FlowDiagram
        steps={['FROM (identify the table)', 'WHERE (filter rows)', 'SELECT (choose columns)']}
        highlight={1}
      />

      <h2>Comparison Operators</h2>
      <p>
        SQL supports the standard comparison operators you already know from math class.
        Each comparison evaluates to TRUE or FALSE for every row, and only TRUE rows are
        kept.
      </p>
      <ul>
        <li><code>=</code> -- equal to</li>
        <li><code>!=</code> or <code>&lt;&gt;</code> -- not equal to</li>
        <li><code>&lt;</code> -- less than</li>
        <li><code>&gt;</code> -- greater than</li>
        <li><code>&lt;=</code> -- less than or equal to</li>
        <li><code>&gt;=</code> -- greater than or equal to</li>
      </ul>

      <CodeBlock code={`-- Products that cost more than 50
SELECT name, price
FROM products
WHERE price > 50;`} />

      <CodeBlock code={`-- A specific customer by email
SELECT first_name, last_name, email
FROM customers
WHERE email = 'alice@example.com';`} />

      <h2>Combining Conditions with AND</h2>
      <p>
        Use <code>AND</code> when <em>both</em> conditions must be true. The database
        keeps a row only if every condition joined by AND evaluates to TRUE.
      </p>

      <CodeBlock code={`-- Products priced between 20 and 100
SELECT name, price
FROM products
WHERE price >= 20
  AND price <= 100;`} />

      <h2>Combining Conditions with OR</h2>
      <p>
        Use <code>OR</code> when <em>at least one</em> condition must be true. A row passes
        the filter if any of the OR-connected conditions is TRUE.
      </p>

      <CodeBlock code={`-- Customers in Texas or California
SELECT first_name, last_name, state
FROM customers
WHERE state = 'TX'
   OR state = 'CA';`} />

      <h2>Negating with NOT</h2>
      <p>
        The <code>NOT</code> operator flips a condition: rows that would have been excluded
        are now included, and vice versa.
      </p>

      <CodeBlock code={`-- Every customer who is NOT in Oregon
SELECT first_name, last_name, state
FROM customers
WHERE NOT state = 'OR';`} />

      <WarningBox title="Operator Precedence">
        <p>
          SQL evaluates <code>NOT</code> first, then <code>AND</code>, then <code>OR</code>.
          This means <code>A OR B AND C</code> is read as <code>A OR (B AND C)</code>, which
          may not be what you intended. When mixing AND and OR, always use parentheses to
          make your intent explicit.
        </p>
      </WarningBox>

      <h2>Exercises</h2>

      <h3>Exercise 1: Filter products by price</h3>
      <p>
        Write a query that returns the name and price of all products that cost less
        than 30. Try changing the threshold and the operator to see how the results shift.
      </p>

      <SQLSandbox defaultQuery="SELECT name, price FROM products WHERE price < 30;" />

      <h3>Exercise 2: Find customers in a specific state</h3>
      <p>
        Retrieve the first name, last name, and state of customers who live in California
        (<code>'CA'</code>). Then try changing the state to see who lives elsewhere.
      </p>

      <SQLSandbox defaultQuery="SELECT first_name, last_name, state FROM customers WHERE state = 'CA';" />

      <h3>Exercise 3: Combine AND and OR</h3>
      <p>
        Find products that are either very cheap (under 10) or very expensive (over 500).
        Use the <code>OR</code> operator to combine two price conditions.
      </p>

      <SQLSandbox defaultQuery="SELECT name, price FROM products WHERE price < 10 OR price > 500;" />

      <InfoBox title="Text Comparisons">
        <p>
          When comparing text values, always wrap the value in single quotes:
          <code> WHERE state = 'TX'</code>. Double quotes are not standard SQL for string
          literals -- they are used for identifiers (column or table names) in some dialects.
        </p>
      </InfoBox>
    </div>
  );
}
