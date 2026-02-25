import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';
import DialectNote from '../../components/DialectNote';
import SetOperationsVenn from '../../components/viz/SetOperationsVenn';

export default function UnionAndSetOperations() {
  return (
    <div>
      <h1>Lesson 21: UNION and Set Operations</h1>
      <p>
        Sometimes you need to combine the results of two or more queries into a single result
        set. SQL provides a family of set operations for exactly this purpose. These operators
        stack rows vertically -- unlike JOINs, which combine columns horizontally. The key
        requirement is that every query in the set operation must return the same number of
        columns, and the corresponding columns must have compatible data types.
      </p>

      <SetOperationsVenn />

      <h2>UNION</h2>
      <p>
        UNION combines the results of two SELECT statements and automatically removes duplicate
        rows from the final output. It is the most commonly used set operator.
      </p>
      <CodeBlock code={`-- Cities where we have customers OR orders shipped to
SELECT city AS location FROM customers
UNION
SELECT state AS location FROM customers;`} />
      <p>
        Even if the same value appears in both queries, it will appear only once in the result.
      </p>

      <h2>UNION ALL</h2>
      <p>
        UNION ALL works like UNION but keeps every row, including duplicates. Because the
        database does not need to check for and eliminate duplicates, UNION ALL is faster.
      </p>
      <CodeBlock code={`-- All customer names and product names in one list (duplicates kept)
SELECT first_name AS name FROM customers
UNION ALL
SELECT name FROM products;`} />

      <InfoBox title="Performance Tip">
        <p>
          If you know the two result sets cannot overlap, or if duplicates are acceptable, always
          prefer UNION ALL over UNION. Removing duplicates requires the database to sort or hash
          the entire result set, which can be expensive on large data.
        </p>
      </InfoBox>

      <h2>INTERSECT</h2>
      <p>
        INTERSECT returns only the rows that appear in both result sets. It is useful for finding
        commonalities between two queries.
      </p>
      <CodeBlock code={`-- Customer IDs who have BOTH placed an order AND written a review
SELECT customer_id FROM orders
INTERSECT
SELECT customer_id FROM reviews;`} />

      <h2>EXCEPT</h2>
      <p>
        EXCEPT returns rows from the first query that do not appear in the second query. It is
        the set-difference operator.
      </p>
      <CodeBlock code={`-- Customer IDs who placed an order but never left a review
SELECT customer_id FROM orders
EXCEPT
SELECT customer_id FROM reviews;`} />
      <p>
        Order matters with EXCEPT. Swapping the two queries would give you customers who left
        a review but never placed an order -- a completely different question.
      </p>

      <DialectNote>
        <p>
          INTERSECT and EXCEPT are part of the SQL standard and supported by PostgreSQL, SQLite,
          and SQL Server. Older versions of MySQL (before 8.0.31) did not support INTERSECT or
          EXCEPT natively. MySQL also uses MINUS as a synonym for EXCEPT in some contexts,
          though this varies by version. Always check your database documentation.
        </p>
      </DialectNote>

      <h2>Exercises</h2>

      <h3>Exercise 1: Combined Name List</h3>
      <p>
        Create a single list containing all customer first names and all product names. Use
        UNION to eliminate duplicates. Alias the column as <code>name</code>.
      </p>
      <SQLSandbox
        defaultQuery={`-- Combine customer first names and product names\nSELECT first_name AS name FROM customers\nUNION\nSELECT name FROM products;`}
        title="Exercise: Combined Name List"
      />

      <h3>Exercise 2: Active Reviewers</h3>
      <p>
        Find customer IDs that appear in both the orders table and the reviews table using
        INTERSECT. These are customers who have both purchased and reviewed.
      </p>
      <SQLSandbox
        defaultQuery={`-- Customers who ordered AND reviewed\nSELECT customer_id FROM orders\nINTERSECT\nSELECT customer_id FROM reviews;`}
        title="Exercise: Active Reviewers"
      />

      <h3>Exercise 3: Order-Only Customers</h3>
      <p>
        Use EXCEPT to find customer IDs who appear in the orders table but not in the reviews
        table. These customers have purchased but never left a review.
      </p>
      <SQLSandbox
        defaultQuery={`-- Customers who ordered but never reviewed\n`}
        title="Exercise: Order-Only Customers"
      />
    </div>
  );
}
