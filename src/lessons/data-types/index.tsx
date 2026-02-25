import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import WarningBox from '../../components/WarningBox';
import DialectNote from '../../components/DialectNote';
import DataTable from '../../components/DataTable';
import NullDiagram from '../../components/viz/NullDiagram';

export default function DataTypes() {
  return (
    <div>
      <h1>Data Types and NULL</h1>
      <p>
        Every column in a SQL table has a <strong>data type</strong> that determines what
        kind of values it can hold. Choosing appropriate types keeps your data accurate and
        your queries fast. Equally important is understanding <code>NULL</code> -- a special
        marker that represents missing or unknown information and behaves differently from
        every other value in SQL.
      </p>

      <h2>Common Data Types</h2>
      <p>
        Different database engines support slightly different type names, but the core
        categories are universal:
      </p>

      <DataTable
        headers={['Category', 'Typical Names', 'Example Values']}
        rows={[
          ['Whole numbers', 'INTEGER, INT, BIGINT', '1, 42, -7'],
          ['Decimal numbers', 'REAL, FLOAT, NUMERIC, DECIMAL', '3.14, 99.95'],
          ['Text', 'TEXT, VARCHAR, CHAR', "'hello', 'OR', 'alice@example.com'"],
          ['Dates and times', 'DATE, TIMESTAMP, DATETIME', "'2025-01-15', '2025-01-15 09:30:00'"],
          ['True / false', 'BOOLEAN, BOOL', 'TRUE, FALSE'],
        ]}
        caption="Common SQL data type categories"
      />

      <InfoBox title="SQLite Is Flexible">
        <p>
          SQLite, which powers our sandbox, uses a dynamic type system. It will accept
          almost any value in any column. Production databases like PostgreSQL and MySQL
          enforce types strictly, so it is good practice to always match the declared type.
        </p>
      </InfoBox>

      <h2>What Is NULL?</h2>
      <p>
        <code>NULL</code> is not zero. It is not an empty string. It is not the word
        "null." It means <strong>the value is unknown or does not exist</strong>. For
        example, a customer who never provided their city has a <code>NULL</code> city --
        not a blank one.
      </p>

      <CodeBlock code={`-- This customer has no city on file
SELECT first_name, city
FROM customers
WHERE city IS NULL;`} />

      <h2>Three-Valued Logic</h2>
      <p>
        Most programming languages use two-valued logic: conditions are either true or
        false. SQL adds a third possibility. Any comparison involving NULL yields NULL
        rather than TRUE or FALSE. The diagram below illustrates this:
      </p>

      <NullDiagram />

      <p>
        Because <code>NULL = NULL</code> evaluates to NULL (not TRUE), you cannot use the
        <code> =</code> operator to test for NULL. You must use the special syntax
        <code> IS NULL</code> and <code>IS NOT NULL</code>.
      </p>

      <WarningBox title="The Most Common NULL Mistake">
        <p>
          Writing <code>WHERE city = NULL</code> will always return zero rows, even if
          there are rows with a NULL city. The correct syntax is
          <code> WHERE city IS NULL</code>. This trips up beginners and experienced
          developers alike -- commit it to memory now.
        </p>
      </WarningBox>

      <h2>IS NULL and IS NOT NULL</h2>

      <CodeBlock code={`-- Find customers who have provided a city
SELECT first_name, last_name, city
FROM customers
WHERE city IS NOT NULL;`} />

      <CodeBlock code={`-- Find reviews that have no comment text
SELECT id, product_id, rating, comment
FROM reviews
WHERE comment IS NULL;`} />

      <h2>NULL in Arithmetic and Concatenation</h2>
      <p>
        Any arithmetic operation involving NULL produces NULL. Adding 5 to NULL gives
        NULL, not 5. Similarly, concatenating a string with NULL results in NULL in
        standard SQL. Keep this in mind when building expressions on columns that might
        contain missing data.
      </p>

      <CodeBlock code={`-- If city is NULL, this entire expression is NULL
SELECT first_name, city || ', ' || state AS location
FROM customers;`} />

      <DialectNote title="Type Differences Across Dialects">
        <p>
          PostgreSQL offers rich types like <code>UUID</code>, <code>JSONB</code>, and
          <code> ARRAY</code>. MySQL uses <code>VARCHAR(n)</code> heavily and treats
          <code> BOOLEAN</code> as a tiny integer. SQLite stores everything as one of
          five storage classes: NULL, INTEGER, REAL, TEXT, or BLOB. When moving between
          databases, always check how your types translate.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Find customers with a missing city</h3>
      <p>
        Write a query that returns the first name, last name, and city of all customers
        whose city is NULL. Remember -- use <code>IS NULL</code>, not <code>= NULL</code>.
      </p>

      <SQLSandbox defaultQuery="SELECT first_name, last_name, city FROM customers WHERE city IS NULL;" />

      <h3>Exercise 2: Find customers with a known city</h3>
      <p>
        Now reverse the filter: return customers who <em>do</em> have a city on file.
      </p>

      <SQLSandbox defaultQuery="SELECT first_name, last_name, city FROM customers WHERE city IS NOT NULL;" />

      <h3>Exercise 3: Combine NULL checks with other conditions</h3>
      <p>
        Find reviews that have a rating of 5 but no comment text. This requires combining
        a regular comparison with an IS NULL check using AND.
      </p>

      <SQLSandbox defaultQuery="SELECT id, product_id, rating, comment FROM reviews WHERE rating = 5 AND comment IS NULL;" />
    </div>
  );
}
