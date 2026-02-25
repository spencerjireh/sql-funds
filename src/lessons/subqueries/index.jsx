import CodeBlock from '../../components/CodeBlock';
import SQLSandbox from '../../components/SQLSandbox';
import InfoBox from '../../components/InfoBox';

export default function Subqueries() {
  return (
    <div>
      <h1>Lesson 19: Subqueries</h1>
      <p>
        A subquery is a query nested inside another query, enclosed in parentheses. Think of it
        as asking a preliminary question whose answer feeds into a bigger question. Instead of
        running two separate queries and manually combining the results, SQL lets you embed one
        query directly inside another.
      </p>

      <h2>Scalar Subqueries</h2>
      <p>
        A scalar subquery returns exactly one value -- a single row with a single column. This
        makes it ideal for comparisons in a WHERE clause. For example, you might want to find
        every product that costs more than the average price across all products.
      </p>
      <CodeBlock code={`SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);`} />
      <p>
        The inner query calculates the average price first. The outer query then uses that number
        to filter products. If the average price is 29.99, the WHERE clause effectively becomes
        <code>WHERE price &gt; 29.99</code>.
      </p>

      <h2>IN Subqueries</h2>
      <p>
        When a subquery returns multiple rows (but still one column), you pair it with the IN
        operator. This is useful when you need to check membership against a dynamically
        generated list.
      </p>
      <CodeBlock code={`-- Find customers who have placed at least one order
SELECT first_name, last_name, email
FROM customers
WHERE customer_id IN (
  SELECT DISTINCT customer_id
  FROM orders
);`} />
      <p>
        The subquery produces a list of all customer IDs that appear in the orders table. The
        outer query then returns only the customers whose ID is in that list.
      </p>

      <h3>NOT IN</h3>
      <p>
        You can negate the check to find rows that are absent from the subquery results.
      </p>
      <CodeBlock code={`-- Find customers who have never placed an order
SELECT first_name, last_name
FROM customers
WHERE customer_id NOT IN (
  SELECT customer_id FROM orders
);`} />

      <h2>Correlated vs Non-Correlated Subqueries</h2>
      <p>
        The examples above are <strong>non-correlated</strong> subqueries. The inner query runs
        once, produces its result, and the outer query uses that result. The inner query does not
        reference anything from the outer query.
      </p>
      <p>
        A <strong>correlated</strong> subquery references a column from the outer query. This
        means the inner query must re-execute for every row the outer query examines.
      </p>
      <CodeBlock code={`-- Find products priced above the average for their category
SELECT p.name, p.category, p.price
FROM products p
WHERE p.price > (
  SELECT AVG(p2.price)
  FROM products p2
  WHERE p2.category = p.category
);`} />
      <p>
        Notice how <code>p.category</code> inside the subquery refers to the outer row. For
        each product, SQL recalculates the average price of that product's category and checks
        whether the product exceeds it.
      </p>

      <InfoBox title="Subqueries vs Joins">
        <p>
          Many subqueries can be rewritten as JOINs, and vice versa. JOINs are often more
          readable for combining columns from multiple tables, while subqueries shine when you
          need a single computed value or a membership check. Use whichever reads more clearly
          for the problem at hand -- the database optimizer often produces the same execution
          plan either way.
        </p>
      </InfoBox>

      <h2>Exercises</h2>

      <h3>Exercise 1: Above-Average Products</h3>
      <p>
        Write a query that returns the name and price of every product whose price is strictly
        greater than the overall average product price.
      </p>
      <SQLSandbox
        defaultQuery={`-- Find products priced above the average\nSELECT name, price\nFROM products\nWHERE price > (\n  \n);`}
        title="Exercise: Above-Average Products"
      />

      <h3>Exercise 2: Customers with Orders</h3>
      <p>
        Use an IN subquery to list the first name, last name, and city of every customer who
        has placed at least one order.
      </p>
      <SQLSandbox
        defaultQuery={`-- List customers who have placed orders\nSELECT first_name, last_name, city\nFROM customers\nWHERE customer_id IN (\n  \n);`}
        title="Exercise: Customers with Orders"
      />

      <h3>Exercise 3: Category Leaders</h3>
      <p>
        Write a correlated subquery to find products that are priced above the average price in
        their own category. Return the product name, category, and price.
      </p>
      <SQLSandbox
        defaultQuery={`-- Products priced above their category average\nSELECT name, category, price\nFROM products p\nWHERE price > (\n  \n);`}
        title="Exercise: Category Leaders"
      />
    </div>
  );
}
