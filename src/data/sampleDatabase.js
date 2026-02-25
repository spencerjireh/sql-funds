export const SCHEMA_SQL = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT,
  state TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount REAL NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE reviews (
  review_id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  review_date TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
`;

export const SEED_SQL = `
INSERT INTO customers VALUES
  (1, 'Alice', 'Johnson', 'alice@example.com', 'Portland', 'OR', '2024-01-15'),
  (2, 'Bob', 'Smith', 'bob@example.com', 'Seattle', 'WA', '2024-01-20'),
  (3, 'Carol', 'Williams', 'carol@example.com', 'Portland', 'OR', '2024-02-01'),
  (4, 'David', 'Brown', 'david@example.com', NULL, NULL, '2024-02-10'),
  (5, 'Eve', 'Davis', 'eve@example.com', 'San Francisco', 'CA', '2024-02-15'),
  (6, 'Frank', 'Miller', 'frank@example.com', 'Seattle', 'WA', '2024-03-01'),
  (7, 'Grace', 'Wilson', 'grace@example.com', NULL, 'TX', '2024-03-05'),
  (8, 'Henry', 'Moore', 'henry@example.com', 'Austin', 'TX', '2024-03-10'),
  (9, 'Iris', 'Taylor', 'iris@example.com', 'Denver', 'CO', '2024-03-15'),
  (10, 'Jack', 'Anderson', 'jack@example.com', 'Portland', 'OR', '2024-03-20'),
  (11, 'Karen', 'Thomas', 'karen@example.com', NULL, NULL, '2024-04-01'),
  (12, 'Leo', 'Jackson', 'leo@example.com', 'Seattle', 'WA', '2024-04-05'),
  (13, 'Mia', 'White', 'mia@example.com', 'San Francisco', 'CA', '2024-04-10'),
  (14, 'Noah', 'Harris', 'noah@example.com', 'Austin', 'TX', '2024-04-15'),
  (15, 'Olivia', 'Martin', 'olivia@example.com', 'Denver', 'CO', '2024-04-20');

INSERT INTO products VALUES
  (1, 'Laptop Pro 15', 'Electronics', 1299.99, 45),
  (2, 'Wireless Mouse', 'Electronics', 29.99, 200),
  (3, 'USB-C Hub', 'Electronics', 49.99, 150),
  (4, 'Standing Desk', 'Furniture', 599.99, 30),
  (5, 'Ergonomic Chair', 'Furniture', 449.99, 25),
  (6, 'Desk Lamp', 'Furniture', 79.99, 100),
  (7, 'Python Cookbook', 'Books', 39.99, 80),
  (8, 'SQL Deep Dive', 'Books', 34.99, 60),
  (9, 'Data Science Handbook', 'Books', 44.99, 70),
  (10, 'Mechanical Keyboard', 'Electronics', 149.99, 90),
  (11, 'Monitor Stand', 'Furniture', 89.99, 55),
  (12, 'Notebook Pack', 'Office Supplies', 12.99, 300);

INSERT INTO orders VALUES
  (1, 1, '2024-03-01', 'delivered', 1329.98),
  (2, 2, '2024-03-05', 'delivered', 599.99),
  (3, 3, '2024-03-08', 'delivered', 79.98),
  (4, 1, '2024-03-15', 'delivered', 449.99),
  (5, 5, '2024-03-18', 'shipped', 1349.98),
  (6, 4, '2024-03-20', 'delivered', 39.99),
  (7, 6, '2024-03-22', 'delivered', 179.98),
  (8, 2, '2024-03-25', 'cancelled', 89.99),
  (9, 7, '2024-03-28', 'delivered', 599.99),
  (10, 8, '2024-04-01', 'delivered', 1299.99),
  (11, 3, '2024-04-03', 'shipped', 149.99),
  (12, 9, '2024-04-05', 'delivered', 74.98),
  (13, 10, '2024-04-08', 'delivered', 34.99),
  (14, 5, '2024-04-10', 'pending', 449.99),
  (15, 11, '2024-04-12', 'delivered', 129.98),
  (16, 12, '2024-04-14', 'shipped', 1299.99),
  (17, 1, '2024-04-16', 'delivered', 44.99),
  (18, 13, '2024-04-18', 'delivered', 679.98),
  (19, 14, '2024-04-20', 'pending', 49.99),
  (20, 6, '2024-04-22', 'delivered', 34.99),
  (21, 15, '2024-04-24', 'shipped', 89.99),
  (22, 8, '2024-04-26', 'delivered', 12.99),
  (23, 2, '2024-04-28', 'pending', 149.99),
  (24, 9, '2024-04-30', 'delivered', 539.98),
  (25, 3, '2024-05-02', 'shipped', 29.99);

INSERT INTO order_items VALUES
  (1, 1, 1, 1, 1299.99),
  (2, 1, 2, 1, 29.99),
  (3, 2, 4, 1, 599.99),
  (4, 3, 6, 1, 79.99),
  (5, 3, 12, 1, 12.99),
  (6, 4, 5, 1, 449.99),
  (7, 5, 1, 1, 1299.99),
  (8, 5, 3, 1, 49.99),
  (9, 6, 7, 1, 39.99),
  (10, 7, 10, 1, 149.99),
  (11, 7, 2, 1, 29.99),
  (12, 8, 11, 1, 89.99),
  (13, 9, 4, 1, 599.99),
  (14, 10, 1, 1, 1299.99),
  (15, 11, 10, 1, 149.99),
  (16, 12, 8, 1, 34.99),
  (17, 12, 7, 1, 39.99),
  (18, 13, 8, 1, 34.99),
  (19, 14, 5, 1, 449.99),
  (20, 15, 3, 1, 49.99),
  (21, 15, 6, 1, 79.99),
  (22, 16, 1, 1, 1299.99),
  (23, 17, 9, 1, 44.99),
  (24, 18, 4, 1, 599.99),
  (25, 18, 6, 1, 79.99),
  (26, 19, 3, 1, 49.99),
  (27, 20, 8, 1, 34.99),
  (28, 21, 11, 1, 89.99),
  (29, 22, 12, 1, 12.99),
  (30, 23, 10, 1, 149.99),
  (31, 24, 5, 1, 449.99),
  (32, 24, 11, 1, 89.99),
  (33, 25, 2, 1, 29.99),
  (34, 3, 12, 2, 12.99),
  (35, 7, 12, 3, 12.99),
  (36, 12, 12, 1, 12.99),
  (37, 15, 12, 2, 12.99),
  (38, 18, 12, 1, 12.99),
  (39, 22, 12, 2, 12.99),
  (40, 24, 12, 1, 12.99);

INSERT INTO reviews VALUES
  (1, 1, 1, 5, 'Excellent laptop, very fast!', '2024-03-10'),
  (2, 1, 10, 4, 'Great performance but heavy.', '2024-04-15'),
  (3, 2, 1, 4, 'Good mouse, comfortable grip.', '2024-03-12'),
  (4, 2, 6, 5, 'Best wireless mouse I have owned.', '2024-03-30'),
  (5, 3, 5, 3, 'Works fine but gets warm.', '2024-03-25'),
  (6, 4, 2, 5, 'Sturdy desk, easy assembly.', '2024-03-15'),
  (7, 4, 7, 4, 'Good quality standing desk.', '2024-04-01'),
  (8, 5, 1, 5, 'Most comfortable chair ever.', '2024-03-20'),
  (9, 5, 14, 4, 'Good lumbar support.', '2024-04-25'),
  (10, 6, 3, 3, 'Decent lamp, not very bright.', '2024-03-15'),
  (11, 7, 4, 5, 'Must-read for Python devs.', '2024-03-28'),
  (12, 7, 1, 4, 'Well written with good examples.', '2024-04-20'),
  (13, 8, 13, 5, 'Best SQL book available.', '2024-04-12'),
  (14, 8, 2, 4, 'Comprehensive coverage.', '2024-05-01'),
  (15, 9, 9, 4, 'Solid reference book.', '2024-04-10'),
  (16, 10, 6, 5, 'Amazing typing experience!', '2024-03-30'),
  (17, 10, 8, 4, 'Great keyboard, a bit loud.', '2024-04-05'),
  (18, 10, 3, 4, 'Good build quality.', '2024-04-20'),
  (19, 11, 15, 3, 'Simple but functional.', '2024-04-28'),
  (20, 11, 8, 4, 'Nice monitor stand, sturdy.', '2024-05-01');
`;
