import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';

export default function PatternMatching() {
  return (
    <div>
      <h1>Lesson 8: Pattern Matching with LIKE</h1>
      <p>
        Sometimes you need to search for text that matches a pattern rather than an
        exact value. Maybe you want all customers whose name starts with "J", or
        every product that contains the word "pro" somewhere in its name. The
        <strong> LIKE</strong> operator, combined with wildcard characters, makes
        this possible.
      </p>

      <h2>The LIKE Operator</h2>
      <p>
        <code>LIKE</code> is used in a WHERE clause to compare a column against a
        text pattern. It supports two special wildcard characters that let you
        describe the shape of the text you are looking for.
      </p>

      <h2>The % Wildcard</h2>
      <p>
        The percent sign (<code>%</code>) matches <strong>any sequence of zero or
        more characters</strong>. It is the most commonly used wildcard.
      </p>
      <CodeBlock code={`-- Products whose name starts with 'S'
SELECT name, price
FROM products
WHERE name LIKE 'S%';`} />
      <CodeBlock code={`-- Customers whose email ends with 'gmail.com'
SELECT first_name, last_name, email
FROM customers
WHERE email LIKE '%gmail.com';`} />
      <CodeBlock code={`-- Products with 'pro' anywhere in the name
SELECT name, category
FROM products
WHERE name LIKE '%pro%';`} />

      <h2>The _ Wildcard</h2>
      <p>
        The underscore (<code>_</code>) matches <strong>exactly one character</strong>.
        Use it when you know the length of a pattern but not the specific characters.
      </p>
      <CodeBlock code={`-- Cities that are exactly 6 characters long
SELECT first_name, city
FROM customers
WHERE city LIKE '______';

-- Names where the second letter is 'a'
SELECT first_name
FROM customers
WHERE first_name LIKE '_a%';`} />

      <h2>Combining Wildcards</h2>
      <p>
        You can mix <code>%</code> and <code>_</code> in the same pattern to
        express more specific matching rules.
      </p>
      <CodeBlock code={`-- Products starting with any character, followed by 'a',
-- then anything else
SELECT name
FROM products
WHERE name LIKE '_a%';`} />

      <InfoBox title="LIKE is Case-Sensitive (in most dialects)">
        <p>
          In MySQL, LIKE comparisons are case-insensitive by default because of
          its collation settings. In PostgreSQL and many other databases, LIKE is
          case-sensitive. If you need to do a case-insensitive search in
          PostgreSQL, use <code>ILIKE</code> or convert both sides to the same
          case with <code>LOWER()</code>.
        </p>
      </InfoBox>

      <DialectNote>
        <p>
          PostgreSQL provides the <code>ILIKE</code> keyword for case-insensitive
          pattern matching:
        </p>
        <code>SELECT * FROM products WHERE name ILIKE '%phone%';</code>
        <p>
          This is a PostgreSQL extension. In MySQL, standard LIKE is already
          case-insensitive. In SQL Server, case sensitivity depends on the
          database collation. For portable SQL, wrap the column and pattern in
          <code> LOWER()</code>:
        </p>
        <code>WHERE LOWER(name) LIKE LOWER('%Phone%')</code>
      </DialectNote>

      <h2>Practice Exercises</h2>

      <h3>Exercise 1: Products Starting with a Letter</h3>
      <p>
        Find all products whose name starts with the letter "S". Return the product
        name and price.
      </p>
      <SQLSandbox
        title="Products starting with S"
        defaultQuery={`SELECT name, price
FROM products
WHERE `}
      />

      <h3>Exercise 2: Customer Names Containing a Pattern</h3>
      <p>
        Find all customers whose last name contains the letters "son" anywhere in
        it. Return their first name, last name, and city.
      </p>
      <SQLSandbox
        title="Last names containing 'son'"
        defaultQuery={`SELECT first_name, last_name, city
FROM customers
WHERE `}
      />

      <h3>Exercise 3: Email Domain Search</h3>
      <p>
        List all customers whose email address ends with ".com". Display their
        first name, last name, and email, sorted alphabetically by last name.
      </p>
      <SQLSandbox
        title="Emails ending in .com"
        defaultQuery={`SELECT first_name, last_name, email
FROM customers`}
      />
    </div>
  );
}
