export type PostgresFaq = {
  question: string;
  answer: string;
};

export type QueryResult = {
  fields?: { name: string }[];
  rows?: Record<string, unknown>[];
  affectedRows?: number;
};

export type PostgresChapter = {
  title: string;
  group: string;
  time: string;
  introduction: string;
  context: string;
  objective: string;
  concepts: { title: string; description: string }[];
  example: string;
  starter: string;
  parameters?: string;
  mission: string;
  /** What a correct sandbox result should look like for this chapter. */
  expectedResult: string;
  /** Short reminder of tables/columns relevant to the exercise. */
  schemaNote: string;
  check: (result: QueryResult) => boolean;
  successMessage: string;
  faqSource: string;
  faq: PostgresFaq[];
};

export const postgresChapters: PostgresChapter[] = [
  {
    title: "What PostgreSQL is, and why SQL matters",
    group: "Start here",
    time: "8 min",
    introduction:
      "PostgreSQL is a relational database: it stores data in tables and lets you ask precise questions with SQL. This chapter orients you before you write anything fancy.",
    context:
      "Apps need a durable place for users, orders, posts, and settings. Spreadsheets work until many people write at once, rules must be enforced, or questions get complex. SQL is the shared language for describing data and asking for it back. Here you run your first query against a tiny Reading Room library so the rest of the course has a concrete world to explore.",
    objective:
      "Run a simple SELECT and recognize that the result is a table of rows and columns.",
    concepts: [
      {
        title: "Database",
        description:
          "A managed store for structured data with rules, not just a file you open.",
      },
      {
        title: "SQL",
        description:
          "Structured Query Language — the text you send to read or change data.",
      },
      {
        title: "Result set",
        description:
          "The table PostgreSQL returns after a query: columns across, rows down.",
      },
    ],
    example: "SELECT 1 AS hello;\nSELECT current_database();",
    starter:
      "SELECT 'Reading Room' AS course,\n       current_database() AS database_name;",
    mission:
      "Run the starter query (or your own SELECT). Confirm you get one row back with readable column names. Then try SELECT 2 + 2 AS four; and notice how expressions become columns.",
    expectedResult:
      "One row. Columns such as course and database_name (or four if you try the extra query). No error banner.",
    schemaNote:
      "No tables required yet — you can SELECT expressions and database facts directly.",
    check: (result) => {
      return Array.isArray(result.rows) && (result.rows?.length ?? 0) >= 1;
    },
    successMessage:
      "You spoke SQL and got a result set back. That loop—write a question, read a table—is the whole course in miniature.",
    faqSource: "https://www.postgresql.org/docs/current/tutorial-sql.html",
    faq: [
      {
        question: "Is PostgreSQL the same as SQL?",
        answer:
          "SQL is the language. PostgreSQL is one database product that implements SQL (with useful extensions).",
      },
      {
        question: "Do I need to install Postgres for this course?",
        answer:
          "No. The lab runs a real PostgreSQL-compatible engine in your browser with sample tables.",
      },
      {
        question: "What is a result set?",
        answer:
          "The grid of columns and rows returned by a query. Even SELECT 1 returns a one-column, one-row result set.",
      },
    ],
  },
  {
    title: "Tables, rows, columns, and keys",
    group: "Foundations",
    time: "10 min",
    introduction:
      "Relational data lives in tables. Each table has a fixed set of columns (the shape) and any number of rows (the facts). Keys tell you how rows identify themselves and how tables point at each other.",
    context:
      "Before joins and filters, you need the vocabulary of the model. In the Reading Room, authors and books are separate tables on purpose: one author can write many books, and we should not copy the author name into every book row. Primary keys identify a row; foreign keys reference a primary key in another table.",
    objective:
      "Inspect the sample tables and explain what a primary key and foreign key are doing.",
    concepts: [
      {
        title: "Table",
        description:
          "A named grid: columns define the fields; rows hold one record each.",
      },
      {
        title: "Primary key",
        description:
          "A column (or set of columns) that uniquely identifies each row — often id.",
      },
      {
        title: "Foreign key",
        description:
          "A column that points at a primary key in another table, forming a relationship.",
      },
    ],
    example:
      "SELECT table_name\nFROM information_schema.tables\nWHERE table_schema = 'public'\nORDER BY table_name;\n\nSELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_name = 'books'\nORDER BY ordinal_position;",
    starter:
      "-- List the sample tables\nSELECT table_name\nFROM information_schema.tables\nWHERE table_schema = 'public'\nORDER BY table_name;\n\n-- Peek at books\nSELECT id, title, author_id, genre, rating\nFROM books\nORDER BY id;",
    mission:
      "List the public tables, then SELECT a few columns from books. Note that author_id is a number pointing at authors.id — not the author name itself.",
    expectedResult:
      "Tables include authors, books, and reviews. The books preview shows integer author_id values such as 1, 2, 3…",
    schemaNote:
      "authors(id, name, country) · books(id, title, author_id → authors.id, genre, …) · reviews(book_id → books.id, …)",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = new Set(Object.keys(rows[0] ?? {}));
      if (keys.has("table_name")) {
        const names = rows.map((r) => String(r.table_name));
        return names.includes("books") && names.includes("authors");
      }
      return keys.has("title") || keys.has("author_id") || keys.has("id");
    },
    successMessage:
      "You can see the shape of the library: tables for entities, and author_id as a bridge instead of duplicated names.",
    faqSource: "https://www.postgresql.org/docs/current/ddl-basics.html",
    faq: [
      {
        question: "Why not put author name on every book?",
        answer:
          "Duplication goes stale. If an author renames, you would update many rows. A foreign key keeps one source of truth.",
      },
      {
        question: "Must primary keys be integers?",
        answer:
          "No. They must be unique and stable. Integers and UUIDs are common; natural keys are possible but harder to change.",
      },
      {
        question: "What is a schema?",
        answer:
          "A nested namespace inside a database. This course uses the default public schema.",
      },
    ],
  },
  {
    title: "SELECT: choose the columns you need",
    group: "Read data",
    time: "8 min",
    introduction:
      "SELECT builds a result set. You choose which columns appear, optionally rename them with AS, and can compute simple expressions. Reading well is the foundation of every later skill.",
    context:
      "Production tables often have many columns. Queries should return only what the screen or report needs—faster to read, safer to expose, easier to reason about. Aliases make output names match the language of your app.",
    objective:
      "Write a SELECT that returns a small, clearly named set of columns from books.",
    concepts: [
      {
        title: "SELECT list",
        description: "The comma-separated columns or expressions after SELECT.",
      },
      {
        title: "AS alias",
        description:
          "A display name for a column in the result (AS is optional but clear).",
      },
      {
        title: "FROM",
        description: "Which table supplies the rows (before any joins).",
      },
    ],
    example:
      "SELECT title AS book_title,\n       published_year AS year_published,\n       pages\nFROM books;",
    starter:
      "SELECT title,\n       genre,\n       published_year AS year\nFROM books;",
    mission:
      "Return each book's title, genre, and published year. Give the year column a clear alias such as year.",
    expectedResult:
      "One row per book. Columns include title, genre, and a year (or similar) alias — not every column on the table.",
    schemaNote:
      "books(title, genre, published_year, pages, rating, is_read, author_id)",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 3) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const hasTitle = keys.some((k) => k === "title" || k.includes("title"));
      const hasGenre = keys.some((k) => k === "genre");
      const hasYear = keys.some(
        (k) => k.includes("year") || k === "published_year",
      );
      return hasTitle && hasGenre && hasYear;
    },
    successMessage:
      "You shaped the result on purpose instead of dumping the whole table. That habit scales.",
    faqSource: "https://www.postgresql.org/docs/current/sql-select.html",
    faq: [
      {
        question: "Is SELECT * bad?",
        answer:
          "Fine for exploring. In apps and reports, name the columns so renames and extra columns do not surprise you.",
      },
      {
        question: "Does AS change the stored column?",
        answer: "No. Aliases only rename output in that query's result set.",
      },
      {
        question: "Can I SELECT without FROM?",
        answer:
          "Yes for expressions (SELECT 1 + 1). Row data still needs FROM (or a function that returns rows).",
      },
    ],
  },
  {
    title: "Filter rows with WHERE",
    group: "Read data",
    time: "10 min",
    introduction:
      "WHERE keeps only the rows that match a condition. Comparisons, AND/OR, and parentheses turn a full table into the slice you care about.",
    context:
      "Almost every app screen is a filter: unread books, orders this week, users in one country. Filtering in SQL is usually better than loading everything and filtering in code—less data moves, and the database can use indexes later.",
    objective:
      "Write WHERE conditions that correctly narrow books by genre, rating, or flags.",
    concepts: [
      {
        title: "WHERE",
        description:
          "A row-level true/false test applied before you see the result.",
      },
      {
        title: "Comparisons",
        description: "=, <>, <, >, <=, >= compare values of the same kind.",
      },
      {
        title: "AND / OR",
        description:
          "Combine conditions. Use parentheses when mixing AND with OR.",
      },
    ],
    example:
      "SELECT title, rating, is_read\nFROM books\nWHERE genre = 'Fantasy'\n  AND rating >= 4.5;",
    starter:
      "SELECT title, genre, rating, is_read\nFROM books\nWHERE genre = 'Science fiction';",
    mission:
      "List science fiction books. Then tighten or extend the filter (for example rating >= 4.6 or is_read = true) and re-run until the result matches only what you intend.",
    expectedResult:
      "Only Science fiction rows. Titles such as Kindred and Parable of the Sower appear; pure Fantasy titles do not.",
    schemaNote:
      "books.genre text · books.rating numeric · books.is_read boolean",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      return (
        rows.every((r) => {
          const g = String(r.genre ?? r.Genre ?? "").toLowerCase();
          if (g) return g.includes("science");
          const title = String(r.title ?? "").toLowerCase();
          return (
            title.includes("kindred") ||
            title.includes("parable") ||
            title.includes("left hand") ||
            title.includes("darkness")
          );
        }) && rows.length <= 4
      );
    },
    successMessage:
      "You asked for a subset and got only matching rows. Filters are how SQL becomes useful day to day.",
    faqSource:
      "https://www.postgresql.org/docs/current/sql-select.html#SQL-WHERE",
    faq: [
      {
        question: "Where does WHERE run in the query order?",
        answer:
          "Logically after FROM/JOIN and before GROUP BY. It filters rows, not groups (HAVING filters groups).",
      },
      {
        question: "How do I match text safely?",
        answer:
          "Use = for exact values. For patterns, LIKE or ILIKE. Beware of case: 'Fantasy' and 'fantasy' differ unless you normalize.",
      },
      {
        question: "Can I filter on an alias from SELECT?",
        answer:
          "Not in WHERE. WHERE sees original columns; repeat the expression or use a subquery/CTE.",
      },
    ],
  },
  {
    title: "NULL, IN, BETWEEN, and LIKE",
    group: "Read data",
    time: "10 min",
    introduction:
      "Real data has gaps and ranges. NULL means unknown or missing—and it does not equal anything. IN, BETWEEN, and LIKE express membership, ranges, and patterns cleanly.",
    context:
      "Beginners often write country = NULL and wonder why nothing matches. In SQL you must use IS NULL / IS NOT NULL. Membership lists and patterns keep WHERE clauses readable when the rule is 'one of these' or 'starts with…'.",
    objective:
      "Filter with IS NULL, IN, BETWEEN, or LIKE and explain why = NULL never works.",
    concepts: [
      {
        title: "NULL",
        description:
          "Missing/unknown. Use IS NULL / IS NOT NULL — never = NULL.",
      },
      {
        title: "IN / BETWEEN",
        description:
          "IN lists allowed values; BETWEEN is inclusive range syntax.",
      },
      {
        title: "LIKE",
        description:
          "Pattern match with % (any run of characters) and _ (one character).",
      },
    ],
    example:
      "SELECT name, country\nFROM authors\nWHERE country IS NOT NULL;\n\nSELECT title, published_year\nFROM books\nWHERE published_year BETWEEN 1970 AND 2000\n  AND title LIKE 'P%';",
    starter:
      "-- Try each idea; leave one successful query selected when you check the goal\nSELECT name, country\nFROM authors\nWHERE country IS NOT NULL;\n\nSELECT title, published_year, pages\nFROM books\nWHERE published_year BETWEEN 1970 AND 2000;",
    mission:
      "Run a query that uses at least one of: IS NULL / IS NOT NULL, IN (...), BETWEEN, or LIKE. Confirm the rows match the rule you wrote (for example years 1970–2000 inclusive).",
    expectedResult:
      "A filtered list you can justify. Example: books with published_year from 1970 through 2000, or authors whose country is present.",
    schemaNote:
      "authors.country may be filled in the sample; books.published_year and books.title are ideal for BETWEEN and LIKE.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      return keys.some((k) =>
        [
          "name",
          "country",
          "title",
          "published_year",
          "pages",
          "genre",
        ].includes(k),
      );
    },
    successMessage:
      "You handled missing values and richer predicates—the difference between toy filters and production WHERE clauses.",
    faqSource:
      "https://www.postgresql.org/docs/current/functions-comparison.html",
    faq: [
      {
        question: "Why does = NULL return nothing?",
        answer:
          "NULL means unknown. Unknown = unknown is not true. Only IS NULL tests for NULL.",
      },
      {
        question: "Is BETWEEN inclusive?",
        answer: "Yes: BETWEEN 1970 AND 2000 includes both endpoints.",
      },
      {
        question: "LIKE vs ILIKE?",
        answer:
          "LIKE is case-sensitive in PostgreSQL. ILIKE matches case-insensitively.",
      },
    ],
  },
  {
    title: "Sort and limit with ORDER BY and LIMIT",
    group: "Read data",
    time: "8 min",
    introduction:
      "ORDER BY controls row sequence. LIMIT (and OFFSET) bounds how many rows you return. Together they power leaderboards, 'latest N', and pagination.",
    context:
      "Without ORDER BY, row order is not something you should rely on. When you need 'top rated' or 'newest', say so explicitly. LIMIT protects the client from accidental full-table downloads while you explore.",
    objective: "Return a predictable top-N list with a clear sort order.",
    concepts: [
      {
        title: "ORDER BY",
        description:
          "Sort by one or more columns; ASC default, DESC for reverse.",
      },
      {
        title: "Ties",
        description:
          "Add a second sort key (for example title) so ties are stable and readable.",
      },
      {
        title: "LIMIT",
        description: "Cap how many rows come back after sorting.",
      },
    ],
    example:
      "SELECT title, rating\nFROM books\nORDER BY rating DESC, title ASC\nLIMIT 3;",
    starter:
      "SELECT title, rating, published_year\nFROM books\nORDER BY rating DESC, title ASC\nLIMIT 3;",
    mission:
      "Show the three highest-rated books. Break ties by title so the order is stable. Use LIMIT 3.",
    expectedResult:
      "Exactly three rows, highest rating first. If two share a rating, alphabetical title order decides the tie.",
    schemaNote: "books(title, rating, published_year)",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length !== 3) return false;
      const ratings = rows.map((r) => Number(r.rating));
      if (ratings.some((n) => Number.isNaN(n))) return false;
      for (let i = 1; i < ratings.length; i += 1) {
        if (ratings[i] > ratings[i - 1]) return false;
      }
      return true;
    },
    successMessage:
      "You produced a bounded, ordered list—the shape of every 'top N' widget.",
    faqSource: "https://www.postgresql.org/docs/current/queries-limit.html",
    faq: [
      {
        question: "Does LIMIT speed up the query automatically?",
        answer:
          "It can, especially with a matching ORDER BY and index, but it is not a substitute for good filters.",
      },
      {
        question: "How does pagination work?",
        answer:
          "Common pattern: ORDER BY something stable, then LIMIT + OFFSET — or keyset pagination with WHERE on the last seen value.",
      },
      {
        question: "Can I order by a column not in SELECT?",
        answer:
          "Yes. ORDER BY can use columns from FROM/JOIN even if they are not projected.",
      },
    ],
  },
  {
    title: "INSERT: add new rows",
    group: "Change data",
    time: "9 min",
    introduction:
      "INSERT adds rows. You list target columns and values in matching order. Defaults and generated identity columns fill in what you omit when the table allows it.",
    context:
      "Every signup, new order, or saved document is an insert. Naming columns explicitly protects you when the table gains fields later. After inserting, SELECT the row back—never assume a write worked without checking.",
    objective:
      "Insert a book row with required fields and verify it with SELECT.",
    concepts: [
      {
        title: "INSERT INTO … VALUES",
        description:
          "Add one or more rows; column list should match value list.",
      },
      {
        title: "DEFAULT / identity",
        description:
          "Omit columns that have defaults or generated IDs when appropriate.",
      },
      {
        title: "Verify",
        description:
          "Read the row back with WHERE or ORDER BY id DESC LIMIT 1.",
      },
    ],
    example:
      "INSERT INTO books (title, author_id, genre, published_year, pages, rating, is_read)\nVALUES ('The Dispossessed', 1, 'Science fiction', 1974, 387, 4.7, false);\n\nSELECT id, title, author_id, genre\nFROM books\nWHERE title = 'The Dispossessed';",
    starter:
      "INSERT INTO books (title, author_id, genre, published_year, pages, rating, is_read)\nVALUES ('The Dispossessed', 1, 'Science fiction', 1974, 387, 4.7, false);\n\nSELECT id, title, author_id, genre, published_year\nFROM books\nWHERE title = 'The Dispossessed';",
    mission:
      "Insert a new book for an existing author_id (1–4). Then SELECT it back by title or id so you can see the saved row including its new id.",
    expectedResult:
      "The final SELECT shows your new book. author_id references a real authors.id. You should see a generated id.",
    schemaNote:
      "books requires title, author_id, genre; published_year/pages/rating have CHECKs; is_read defaults to false if omitted in some setups — this lab starter sets it explicitly.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      if (!keys.includes("title")) return false;
      return rows.some((r) => String(r.title ?? "").length > 0);
    },
    successMessage:
      "You wrote data and read it back. That write-then-verify habit prevents silent mistakes.",
    faqSource: "https://www.postgresql.org/docs/current/sql-insert.html",
    faq: [
      {
        question: "What if author_id does not exist?",
        answer:
          "The foreign key rejects the insert. Create the author first or use a valid id.",
      },
      {
        question: "Can I insert multiple rows?",
        answer: "Yes: VALUES (...), (...); or INSERT … SELECT …",
      },
      {
        question: "How do I get the new id back?",
        answer: "In PostgreSQL, INSERT … RETURNING id is the cleanest pattern.",
      },
    ],
  },
  {
    title: "UPDATE and DELETE — change rows safely",
    group: "Change data",
    time: "10 min",
    introduction:
      "UPDATE changes existing rows; DELETE removes them. Both are dangerous without a precise WHERE. Always preview with SELECT, then write, then verify.",
    context:
      "A missing WHERE on UPDATE or DELETE can modify the entire table. In this sandbox you can reset, but in production that is an incident. Build a ritual: select the target rows, update/delete with the same predicate, select again.",
    objective:
      "Update one book with a tight WHERE, verify the change, and understand why unbounded writes are unsafe.",
    concepts: [
      {
        title: "UPDATE … SET … WHERE",
        description: "Change columns only on matching rows.",
      },
      {
        title: "DELETE FROM … WHERE",
        description:
          "Remove matching rows; prefer soft-delete flags when history matters.",
      },
      {
        title: "Preview",
        description:
          "Run the same WHERE as a SELECT first to count what will be affected.",
      },
    ],
    example:
      "SELECT id, title, is_read FROM books WHERE title = 'The Left Hand of Darkness';\n\nUPDATE books\nSET is_read = true\nWHERE title = 'The Left Hand of Darkness';\n\nSELECT id, title, is_read FROM books WHERE title = 'The Left Hand of Darkness';",
    starter:
      "-- Preview\nSELECT id, title, is_read\nFROM books\nWHERE title = 'The Left Hand of Darkness';\n\n-- Change one row\nUPDATE books\nSET is_read = true\nWHERE title = 'The Left Hand of Darkness';\n\n-- Verify\nSELECT id, title, is_read\nFROM books\nWHERE title = 'The Left Hand of Darkness';",
    mission:
      "Mark The Left Hand of Darkness as read (is_read = true) using a WHERE that matches only that book. Your last SELECT should show is_read true for that title.",
    expectedResult:
      "One targeted book with is_read = true. Other books unchanged. Prefer WHERE on id or a unique title.",
    schemaNote: "books.is_read boolean · identify rows by id or unique title",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      return rows.some((r) => {
        const title = String(r.title ?? "").toLowerCase();
        const read =
          r.is_read === true ||
          r.is_read === "t" ||
          r.is_read === "true" ||
          r.is_read === 1;
        return title.includes("left hand") && read;
      });
    },
    successMessage:
      "You changed data on purpose with a narrow WHERE—the core safety rule for writes.",
    faqSource: "https://www.postgresql.org/docs/current/sql-update.html",
    faq: [
      {
        question: "What if I omit WHERE?",
        answer:
          "UPDATE or DELETE applies to every row. In many tools that is a single terrifying confirmation away.",
      },
      {
        question: "UPDATE vs INSERT?",
        answer:
          "UPDATE changes existing rows; INSERT adds new ones. Upsert (ON CONFLICT) combines both patterns.",
      },
      {
        question: "Can triggers fire on UPDATE?",
        answer:
          "Yes in full PostgreSQL. This browser lab focuses on the SQL you write, not custom triggers.",
      },
    ],
  },
  {
    title: "Data types and constraints as guardrails",
    group: "Model data",
    time: "11 min",
    introduction:
      "Types say what a column can hold. Constraints reject invalid rows: NOT NULL, UNIQUE, CHECK, primary keys, and foreign keys. Good models make illegal data hard to store.",
    context:
      "If the database accepts nonsense, every app becomes responsible for the same checks—and one bug lets bad data in. Push essential rules into the schema. In this chapter you create a small table with constraints and watch invalid inserts fail.",
    objective:
      "Create a constrained table and prove that invalid data is rejected while valid data saves.",
    concepts: [
      {
        title: "Types",
        description:
          "integer, text, boolean, numeric, date, and friends — storage and comparison rules.",
      },
      {
        title: "CHECK / NOT NULL / UNIQUE",
        description: "Row and table rules evaluated on write.",
      },
      {
        title: "FOREIGN KEY",
        description: "Values must match a parent row (or be NULL if allowed).",
      },
    ],
    example:
      "CREATE TABLE shelves (\n  id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE,\n  capacity integer NOT NULL CHECK (capacity > 0)\n);\n\nINSERT INTO shelves (name, capacity) VALUES ('Desk', 20);\n-- This should fail:\n-- INSERT INTO shelves (name, capacity) VALUES ('Bad', 0);",
    starter:
      "CREATE TABLE IF NOT EXISTS shelves (\n  id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE,\n  capacity integer NOT NULL CHECK (capacity > 0)\n);\n\nINSERT INTO shelves (name, capacity)\nVALUES ('Desk', 20)\nON CONFLICT (name) DO NOTHING;\n\nSELECT id, name, capacity FROM shelves ORDER BY id;",
    mission:
      "Create a shelves table with NOT NULL, UNIQUE, and a CHECK on capacity. Insert a valid row and SELECT it. Optionally try capacity 0 and read the error—then fix it.",
    expectedResult:
      "At least one shelves row with positive capacity. Invalid inserts should error instead of saving.",
    schemaNote:
      "You are adding shelves alongside the seeded authors/books/reviews tables.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      if (!(keys.includes("name") || keys.includes("capacity"))) return false;
      return rows.some(
        (r) => Number(r.capacity ?? 1) > 0 || String(r.name ?? "").length > 0,
      );
    },
    successMessage:
      "You let the database defend data quality—constraints are product rules, not bureaucracy.",
    faqSource: "https://www.postgresql.org/docs/current/ddl-constraints.html",
    faq: [
      {
        question: "CHECK vs app validation?",
        answer:
          "Do both for UX, but constraints are the last line of defense every client must pass.",
      },
      {
        question: "What is GENERATED … IDENTITY?",
        answer: "PostgreSQL's modern auto-increment style for primary keys.",
      },
      {
        question: "IF NOT EXISTS?",
        answer:
          "Makes reruns safer in a lab. In migrations you usually version changes instead.",
      },
    ],
  },
  {
    title: "How tables relate: one-to-many thinking",
    group: "Joins",
    time: "9 min",
    introduction:
      "Joins exist because related facts live in different tables. One author has many books; one book has many reviews. Foreign keys encode those links; joins follow them.",
    context:
      "If you store author names on every book, updates and spelling drift hurt. If you only store author_id, you need a join to print the name. This chapter builds the mental model before the join syntax chapters that follow.",
    objective:
      "Trace author_id to authors.id and explain the one-to-many relationship in the sample data.",
    concepts: [
      {
        title: "One-to-many",
        description:
          "One parent row links to many child rows (author → books).",
      },
      {
        title: "Link column",
        description:
          "The foreign key on the many side points at the parent's primary key.",
      },
      {
        title: "Join idea",
        description:
          "Match rows where child.fk = parent.pk to reassemble a wider answer.",
      },
    ],
    example:
      "SELECT b.title, b.author_id, a.name AS author_name\nFROM books AS b\nJOIN authors AS a ON a.id = b.author_id\nORDER BY a.name, b.title;",
    starter:
      "-- See the link values\nSELECT id, title, author_id FROM books ORDER BY id;\n\nSELECT id, name FROM authors ORDER BY id;\n\n-- Follow the link with a join (preview of next chapters)\nSELECT b.title, a.name AS author\nFROM books AS b\nINNER JOIN authors AS a ON a.id = b.author_id\nORDER BY a.name, b.title;",
    mission:
      "Run queries that show books.author_id beside authors.id/name. Complete a simple INNER JOIN that prints title with author name.",
    expectedResult:
      "Each book title paired with a human-readable author name. No duplicate author tables pasted into books.",
    schemaNote: "books.author_id → authors.id · reviews.book_id → books.id",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 3) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const hasTitle = keys.some((k) => k.includes("title"));
      const hasAuthor = keys.some((k) => k.includes("author") || k === "name");
      return hasTitle && hasAuthor;
    },
    successMessage:
      "You can see relationships as links between tables—the reason join syntax is worth learning next.",
    faqSource: "https://www.postgresql.org/docs/current/tutorial-fk.html",
    faq: [
      {
        question: "Where does the foreign key live?",
        answer:
          "Usually on the many side: books hold author_id, not authors holding a list of book ids.",
      },
      {
        question: "What about many-to-many?",
        answer:
          "Use a junction table (two foreign keys), for example book_tags(book_id, tag_id).",
      },
      {
        question: "Is JOIN the only way?",
        answer:
          "Subqueries can work, but joins are the standard way to combine related rows set-wise.",
      },
    ],
  },
  {
    title: "INNER JOIN: matching rows only",
    group: "Joins",
    time: "10 min",
    introduction:
      "INNER JOIN returns a row only when the join condition finds a match in both tables. Unmatched rows on either side are dropped from the result.",
    context:
      "Use inner joins when you need complete pairs: a book that has an author row, an order that has a customer. If a child row points at a missing parent (or you want parents without children), inner join is the wrong tool—that is what outer joins are for.",
    objective:
      "Join books to authors with INNER JOIN and read only matched pairs.",
    concepts: [
      {
        title: "INNER JOIN",
        description: "Keep rows that satisfy the ON condition in both inputs.",
      },
      {
        title: "ON condition",
        description:
          "Usually child.fk = parent.pk. Be explicit; avoid accidental cross joins.",
      },
      {
        title: "Table aliases",
        description: "Short names like b and a keep multi-table SQL readable.",
      },
    ],
    example:
      "SELECT b.title,\n       a.name AS author,\n       b.genre\nFROM books AS b\nINNER JOIN authors AS a ON a.id = b.author_id\nORDER BY b.title;",
    starter:
      "SELECT b.title,\n       a.name AS author,\n       a.country,\n       b.genre\nFROM books AS b\nINNER JOIN authors AS a ON a.id = b.author_id\nORDER BY a.name, b.title;",
    mission:
      "Write an INNER JOIN from books to authors on author_id. Return title, author name, and at least one more column. Order the result for readability.",
    expectedResult:
      "One result row per book that has a matching author (all seeded books should). Columns include book title and author name.",
    schemaNote: "FROM books b INNER JOIN authors a ON a.id = b.author_id",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 4) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      return (
        keys.some((k) => k.includes("title")) &&
        keys.some(
          (k) => k.includes("author") || k === "name" || k === "country",
        )
      );
    },
    successMessage:
      "Inner join is your default pairing tool: only complete matches survive.",
    faqSource:
      "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-FROM",
    faq: [
      {
        question: "JOIN vs INNER JOIN?",
        answer: "In PostgreSQL, plain JOIN means INNER JOIN.",
      },
      {
        question: "What is a cross join?",
        answer:
          "Every row paired with every row (cartesian product). Happens if you FROM a, b with no condition—usually a bug.",
      },
      {
        question: "Can I join on something other than keys?",
        answer:
          "Yes, any boolean condition, but keys are the common, index-friendly case.",
      },
    ],
  },
  {
    title: "LEFT JOIN: keep the left table",
    group: "Joins",
    time: "12 min",
    introduction:
      "LEFT JOIN (LEFT OUTER JOIN) keeps every row from the left table. When the right table has no match, right-side columns are NULL. This is how you find parents without children—or preserve all books even without reviews.",
    context:
      "Business questions are often outer joins: all customers, including those with zero orders; all books, including those with no reviews yet. Inner join would hide the zeros. Learn to read NULL padding as 'no match' rather than as an error.",
    objective:
      "Use LEFT JOIN so every book appears even when it has no reviews, and spot NULL review fields.",
    concepts: [
      {
        title: "LEFT JOIN",
        description:
          "All left rows survive; right columns are NULL when unmatched.",
      },
      {
        title: "NULL means no match",
        description:
          "After a left join, NULL on the right side usually signals absence.",
      },
      {
        title: "Counting children",
        description:
          "LEFT JOIN + GROUP BY COUNT(child.id) yields zeros for parents with no kids.",
      },
    ],
    example:
      "SELECT b.title,\n       r.reviewer,\n       r.rating AS review_rating\nFROM books AS b\nLEFT JOIN reviews AS r ON r.book_id = b.id\nORDER BY b.title, r.reviewer;",
    starter:
      "SELECT b.id,\n       b.title,\n       r.reviewer,\n       r.rating AS review_rating,\n       r.comment\nFROM books AS b\nLEFT JOIN reviews AS r ON r.book_id = b.id\nORDER BY b.title, r.reviewer;",
    mission:
      "Left join books to reviews. Confirm titles with no reviews still appear, with reviewer/rating/comment as NULL. Name one book that has reviews and one that does not.",
    expectedResult:
      "At least as many rows as books (more if some books have multiple reviews). Some reviewer values are NULL for books without reviews.",
    schemaNote:
      "FROM books b LEFT JOIN reviews r ON r.book_id = b.id — books is the left table that must be preserved.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 6) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const hasBook = keys.some((k) => k.includes("title") || k === "id");
      const hasReviewCol = keys.some(
        (k) => k.includes("review") || k === "comment" || k === "reviewer",
      );
      const hasNullReview = rows.some(
        (r) =>
          r.reviewer == null ||
          r.comment == null ||
          r.review_rating == null ||
          r.rating == null,
      );
      return hasBook && hasReviewCol && hasNullReview;
    },
    successMessage:
      "You preserved the left table and learned to read NULL as 'no matching right row'—the heart of outer joins.",
    faqSource:
      "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN",
    faq: [
      {
        question: "LEFT JOIN vs RIGHT JOIN?",
        answer:
          "The same idea from the other side. Most teams write LEFT JOIN and put the must-keep table on the left.",
      },
      {
        question: "Why more rows than books?",
        answer:
          "If one book has three reviews, left join yields three rows for that book (plus one NULL-padded row for books with zero).",
      },
      {
        question: "How do I find books with no reviews?",
        answer:
          "LEFT JOIN reviews, then WHERE r.id IS NULL (anti-join pattern).",
      },
    ],
  },
  {
    title: "RIGHT JOIN and FULL OUTER JOIN",
    group: "Joins",
    time: "10 min",
    introduction:
      "RIGHT JOIN keeps every row from the right table, padding the left with NULL when needed. FULL OUTER JOIN keeps rows from both sides. In practice, RIGHT JOIN is uncommon—people flip the tables and write LEFT JOIN—but you should recognize it.",
    context:
      "Reading other people's SQL means knowing all outer join shapes. FULL OUTER JOIN is useful for reconciliations: rows only in A, only in B, or in both. This chapter uses a small demo so you can see unmatched sides clearly.",
    objective:
      "Write a RIGHT JOIN (or equivalent LEFT JOIN) and explain which table is preserved.",
    concepts: [
      {
        title: "RIGHT JOIN",
        description: "All right rows survive; left columns NULL if unmatched.",
      },
      {
        title: "Prefer LEFT",
        description:
          "Same result as RIGHT if you swap table order—teams standardize on LEFT.",
      },
      {
        title: "FULL OUTER JOIN",
        description:
          "Keep unmatched rows from both inputs; match where possible.",
      },
    ],
    example:
      "-- RIGHT JOIN: keep all reviews, even if a book row were missing\nSELECT r.reviewer, r.rating, b.title\nFROM books AS b\nRIGHT JOIN reviews AS r ON r.book_id = b.id\nORDER BY r.reviewer;\n\n-- Equivalent LEFT JOIN style (preferred)\nSELECT r.reviewer, r.rating, b.title\nFROM reviews AS r\nLEFT JOIN books AS b ON b.id = r.book_id;",
    starter:
      "SELECT r.id AS review_id,\n       r.reviewer,\n       r.rating,\n       b.title AS book_title\nFROM books AS b\nRIGHT JOIN reviews AS r ON r.book_id = b.id\nORDER BY r.id;\n\n-- Same idea with LEFT JOIN (clearer for many teams)\nSELECT r.id AS review_id,\n       r.reviewer,\n       r.rating,\n       b.title AS book_title\nFROM reviews AS r\nLEFT JOIN books AS b ON b.id = r.book_id\nORDER BY r.id;",
    mission:
      "Run a RIGHT JOIN that preserves reviews, then rewrite it as a LEFT JOIN with reviews on the left. Confirm both return the same review ids and book titles.",
    expectedResult:
      "One row per review with reviewer, rating, and the matched book title. Both formulations should agree.",
    schemaNote:
      "reviews are the 'must keep' set in this exercise; books supply the title.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 3) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      return (
        keys.some((k) => k.includes("review")) &&
        keys.some((k) => k.includes("title") || k.includes("book"))
      );
    },
    successMessage:
      "You can read and rewrite outer joins without changing the meaning—clarity over cleverness.",
    faqSource:
      "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN",
    faq: [
      {
        question: "Why do style guides ban RIGHT JOIN?",
        answer:
          "Not because it is wrong—because mixing LEFT and RIGHT in one codebase confuses readers. Pick left-preserve and stick to it.",
      },
      {
        question: "When is FULL OUTER JOIN useful?",
        answer:
          "Comparing two lists (legacy vs new ids, two imports) where either side may have orphans.",
      },
      {
        question: "Do NULL keys match?",
        answer:
          "Join conditions using = do not match NULL to NULL. Treat missing keys carefully.",
      },
    ],
  },
  {
    title: "Join three tables and shape the answer",
    group: "Joins",
    time: "11 min",
    introduction:
      "Real answers often need more than two tables: book → author and book → reviews, or order → customer → address. Join step by step, alias clearly, and SELECT only the columns the question needs.",
    context:
      "Once multi-table joins click, you can answer product questions without denormalizing everything into one wide table. Watch row multiplication: joining a one-to-many twice can explode rows—aggregate or careful filters may be needed.",
    objective:
      "Join authors, books, and reviews into one readable result for books that have reviews.",
    concepts: [
      {
        title: "Join chains",
        description:
          "FROM a JOIN b ON … JOIN c ON … builds a wider row step by step.",
      },
      {
        title: "Grain",
        description: "Know what one result row represents (a review? a book?).",
      },
      {
        title: "Projection",
        description:
          "Pick columns that answer the question; drop noisy ids if unneeded.",
      },
    ],
    example:
      "SELECT a.name AS author,\n       b.title,\n       r.reviewer,\n       r.rating AS review_rating\nFROM authors AS a\nINNER JOIN books AS b ON b.author_id = a.id\nINNER JOIN reviews AS r ON r.book_id = b.id\nORDER BY a.name, b.title, r.reviewer;",
    starter:
      "SELECT a.name AS author,\n       b.title AS book,\n       r.reviewer,\n       r.rating AS review_rating,\n       r.comment\nFROM authors AS a\nINNER JOIN books AS b ON b.author_id = a.id\nINNER JOIN reviews AS r ON r.book_id = b.id\nORDER BY a.name, b.title, r.reviewer;",
    mission:
      "Connect authors → books → reviews with joins. Return author name, book title, reviewer, and review rating. Only books that actually have reviews should appear if you use INNER JOIN to reviews.",
    expectedResult:
      "Several rows (one per review) with author, book, reviewer, and rating filled in—not NULL.",
    schemaNote: "authors.id ← books.author_id · books.id ← reviews.book_id",
    check: (result) => {
      const rows = result.rows ?? [];
      if (rows.length < 3) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const need = [
        keys.some((k) => k.includes("author") || k === "name"),
        keys.some((k) => k.includes("title") || k.includes("book")),
        keys.some(
          (k) => k.includes("review") || k === "rating" || k === "comment",
        ),
      ];
      return need.every(Boolean);
    },
    successMessage:
      "You assembled a three-table answer—the everyday shape of application SQL.",
    faqSource: "https://www.postgresql.org/docs/current/tutorial-join.html",
    faq: [
      {
        question: "Why did my row count explode?",
        answer:
          "Joining two one-to-many paths without aggregating multiplies combinations. Know the grain of each table.",
      },
      {
        question: "INNER vs LEFT to reviews?",
        answer:
          "INNER only keeps books that have at least one review. LEFT keeps books with zero reviews (NULL review columns).",
      },
      {
        question: "Should I always join from the 'top' parent?",
        answer:
          "Start FROM the table that defines the grain of the answer, then join outward.",
      },
    ],
  },
  {
    title: "Aggregate with GROUP BY and HAVING",
    group: "Summaries",
    time: "11 min",
    introduction:
      "Aggregates turn many rows into summaries: COUNT, SUM, AVG, MIN, MAX. GROUP BY splits the work into buckets. HAVING filters those buckets after aggregation.",
    context:
      "Dashboards are mostly group queries: books per genre, average rating per author, reviews per book. WHERE filters rows before grouping; HAVING filters groups after. Mixing them up is a classic bug.",
    objective:
      "Produce a grouped report (count or average) and optionally filter groups with HAVING.",
    concepts: [
      {
        title: "Aggregate functions",
        description: "Collapse a set of values into one number per group.",
      },
      {
        title: "GROUP BY",
        description:
          "The columns that define each bucket; other selected columns must be aggregated.",
      },
      {
        title: "HAVING",
        description:
          "Filter groups (for example COUNT(*) >= 2), not individual rows.",
      },
    ],
    example:
      "SELECT genre,\n       COUNT(*) AS book_count,\n       ROUND(AVG(rating), 2) AS avg_rating\nFROM books\nGROUP BY genre\nHAVING COUNT(*) >= 1\nORDER BY book_count DESC;",
    starter:
      "SELECT a.name AS author,\n       COUNT(b.id) AS book_count,\n       ROUND(AVG(b.rating), 2) AS avg_rating\nFROM authors AS a\nINNER JOIN books AS b ON b.author_id = a.id\nGROUP BY a.id, a.name\nORDER BY book_count DESC, a.name;",
    mission:
      "Write a GROUP BY report—by genre or by author—with COUNT and AVG. Optional stretch: HAVING COUNT(*) >= 2 to keep only groups with at least two books.",
    expectedResult:
      "One row per group (genre or author) with a count and an average rating. Counts should look plausible for the sample data.",
    schemaNote:
      "Join authors to books first if you group by author name; group by genre can stay on books alone.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const hasAgg = keys.some(
        (k) =>
          k.includes("count") ||
          k.includes("avg") ||
          k.includes("sum") ||
          k.includes("rating"),
      );
      return hasAgg && rows.length >= 1;
    },
    successMessage:
      "You summarized many rows into a report—SQL's superpower beyond single-record lookups.",
    faqSource: "https://www.postgresql.org/docs/current/tutorial-agg.html",
    faq: [
      {
        question: "Why must non-aggregated columns appear in GROUP BY?",
        answer:
          "Each result row is one group. A column outside the group key would be ambiguous across members.",
      },
      {
        question: "COUNT(*) vs COUNT(column)?",
        answer:
          "COUNT(*) counts rows. COUNT(column) skips NULL in that column—useful after LEFT JOIN.",
      },
      {
        question: "WHERE vs HAVING?",
        answer:
          "WHERE filters rows before grouping. HAVING filters aggregate results after GROUP BY.",
      },
    ],
  },
  {
    title: "Subqueries and common table expressions",
    group: "Summaries",
    time: "11 min",
    introduction:
      "Subqueries nest a query inside another. CTEs (WITH …) name intermediate results so multi-step logic stays readable. Both let you build answers in layers.",
    context:
      "Sometimes you need 'books above the average rating' or 'authors who have at least one fantasy title'. Rather than cramming everything into one join soup, compute an intermediate set, then use it. Prefer CTEs when the steps help a human reader.",
    objective:
      "Use a subquery or WITH clause to answer a question that needs an intermediate set.",
    concepts: [
      {
        title: "Scalar subquery",
        description:
          "A subquery that returns one value, often in WHERE or SELECT.",
      },
      {
        title: "IN (subquery)",
        description: "Keep rows whose key appears in another result set.",
      },
      {
        title: "WITH (CTE)",
        description: "Name a temporary result and SELECT from it like a table.",
      },
    ],
    example:
      "SELECT title, rating\nFROM books\nWHERE rating >= (SELECT AVG(rating) FROM books)\nORDER BY rating DESC;\n\nWITH fantasy_books AS (\n  SELECT id, title, author_id, rating\n  FROM books\n  WHERE genre = 'Fantasy'\n)\nSELECT a.name AS author, f.title, f.rating\nFROM fantasy_books AS f\nJOIN authors AS a ON a.id = f.author_id\nORDER BY f.rating DESC;",
    starter:
      "SELECT title, rating\nFROM books\nWHERE rating >= (SELECT AVG(rating) FROM books)\nORDER BY rating DESC;\n\nWITH fantasy_books AS (\n  SELECT id, title, author_id, rating\n  FROM books\n  WHERE genre = 'Fantasy'\n)\nSELECT a.name AS author,\n       f.title,\n       f.rating\nFROM fantasy_books AS f\nINNER JOIN authors AS a ON a.id = f.author_id\nORDER BY f.rating DESC;",
    mission:
      "Run either (or both): books at or above average rating via a scalar subquery, or a WITH fantasy_books CTE joined to authors. Leave a successful result visible when you mark the goal.",
    expectedResult:
      "A sensible subset: high-rated books relative to AVG, or fantasy titles with author names from a CTE.",
    schemaNote:
      "Subqueries and CTEs still read the same base tables: books and authors.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      return keys.some(
        (k) =>
          k.includes("title") || k.includes("author") || k.includes("rating"),
      );
    },
    successMessage:
      "You composed SQL in steps—subqueries and CTEs keep complex questions honest and readable.",
    faqSource: "https://www.postgresql.org/docs/current/queries-with.html",
    faq: [
      {
        question: "CTE vs subquery — which is faster?",
        answer:
          "Often similar. Choose the form that a teammate can maintain. PostgreSQL may inline CTEs depending on version and hints.",
      },
      {
        question: "Can CTEs update data?",
        answer:
          "Yes: WITH … UPDATE/INSERT/DELETE is supported for advanced pipelines.",
      },
      {
        question: "Are correlated subqueries OK?",
        answer:
          "Yes, but they can be slower; joins or window functions sometimes replace them cleanly.",
      },
    ],
  },
  {
    title: "Transactions: commit or roll back as a unit",
    group: "Operations",
    time: "10 min",
    introduction:
      "A transaction groups statements so they all commit together or all roll back. Use them when partial updates would leave data inconsistent.",
    context:
      "Transferring a shelf assignment, placing an order with lines, or updating two related rows should not stop halfway. BEGIN starts a unit of work; COMMIT makes it permanent; ROLLBACK undoes it. In this lab you will change a row inside a transaction and roll back to prove the safety net.",
    objective:
      "Open a transaction, change a row, verify inside the transaction, then ROLLBACK and confirm the change disappeared.",
    concepts: [
      { title: "BEGIN", description: "Start a transaction block." },
      {
        title: "COMMIT",
        description: "Permanently apply all statements in the block.",
      },
      { title: "ROLLBACK", description: "Discard the block's changes." },
    ],
    example:
      "BEGIN;\nUPDATE books SET rating = 5.0 WHERE title = 'Kindred';\nSELECT title, rating FROM books WHERE title = 'Kindred';\nROLLBACK;\nSELECT title, rating FROM books WHERE title = 'Kindred';",
    starter:
      "BEGIN;\n\nUPDATE books\nSET rating = 5.0\nWHERE title = 'Kindred';\n\nSELECT title, rating\nFROM books\nWHERE title = 'Kindred';\n\nROLLBACK;\n\nSELECT title, rating\nFROM books\nWHERE title = 'Kindred';",
    mission:
      "Inside BEGIN … ROLLBACK, temporarily set Kindred's rating to 5.0 and SELECT it. After ROLLBACK, SELECT again and confirm the original rating returned (sample starts at 4.8).",
    expectedResult:
      "Final SELECT after ROLLBACK shows rating back near the original (4.8), not 5.0. If you COMMIT by mistake, use Reset database.",
    schemaNote:
      "Transactions apply to writes on books in this browser database the same way they do on a server.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      return rows.some((r) => {
        const title = String(r.title ?? "").toLowerCase();
        const rating = Number(r.rating);
        return (
          title.includes("kindred") && !Number.isNaN(rating) && rating <= 4.85
        );
      });
    },
    successMessage:
      "You saw temporary writes disappear on ROLLBACK—transactions are undoable units of work until commit.",
    faqSource:
      "https://www.postgresql.org/docs/current/tutorial-transactions.html",
    faq: [
      {
        question: "What auto-commits?",
        answer:
          "Outside an explicit transaction, each statement typically commits on its own.",
      },
      {
        question: "Can I nest transactions?",
        answer:
          "PostgreSQL uses savepoints for nested partial rollbacks rather than true nested transactions.",
      },
      {
        question: "Why did my lab look locked?",
        answer:
          "Long open transactions hold locks. Commit or roll back when finished.",
      },
    ],
  },
  {
    title: "Indexes and EXPLAIN at a glance",
    group: "Operations",
    time: "10 min",
    introduction:
      "Indexes are side structures that help PostgreSQL find rows faster—especially for WHERE and JOIN keys—at the cost of storage and slower writes. EXPLAIN shows the plan the planner chose.",
    context:
      "You do not index every column. Start with primary keys (already indexed), foreign keys you join on, and filters you run constantly. In this chapter you create a helpful index and read EXPLAIN output at a high level.",
    objective:
      "Create an index on a filter/join column and run EXPLAIN on a query that can use it.",
    concepts: [
      {
        title: "Index",
        description:
          "A lookup structure (often a B-tree) mapping key values to row locations.",
      },
      {
        title: "Tradeoff",
        description:
          "Faster reads for that pattern; extra work on INSERT/UPDATE/DELETE.",
      },
      {
        title: "EXPLAIN",
        description:
          "Shows the plan—seq scan vs index scan—without focusing on micro-benchmarks here.",
      },
    ],
    example:
      "CREATE INDEX IF NOT EXISTS books_genre_idx ON books (genre);\n\nEXPLAIN\nSELECT title, genre\nFROM books\nWHERE genre = 'Fantasy';",
    starter:
      "CREATE INDEX IF NOT EXISTS books_genre_idx ON books (genre);\n\nEXPLAIN\nSELECT title, rating\nFROM books\nWHERE genre = 'Fantasy'\nORDER BY rating DESC;",
    mission:
      "Create an index on books(genre). Run EXPLAIN on a genre filter query. Read whether the plan mentions the index or a sequential scan—and remember small tables may still seq-scan because they are tiny.",
    expectedResult:
      "Index created (or already present). EXPLAIN returns plan rows (TEXT). On small sample data, a seq scan can still be normal.",
    schemaNote:
      "Indexes live on tables; they are not separate result tables you SELECT from day to day.",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const blob = JSON.stringify(rows).toLowerCase();
      return (
        blob.includes("scan") ||
        blob.includes("index") ||
        blob.includes("result") ||
        blob.includes("plan") ||
        Object.keys(rows[0] ?? {}).length >= 1
      );
    },
    successMessage:
      "You treated performance as a plan you can inspect—not a mystery—while keeping indexes intentional.",
    faqSource: "https://www.postgresql.org/docs/current/using-explain.html",
    faq: [
      {
        question: "Why seq scan on a tiny table?",
        answer:
          "Reading the whole heap can be cheaper than index lookups when almost all rows fit in a page or two.",
      },
      {
        question: "Does an index always exist for PRIMARY KEY?",
        answer: "Yes—PostgreSQL creates one unique index to enforce the key.",
      },
      {
        question: "What should I index first?",
        answer:
          "Foreign keys you join on and columns you filter and sort on constantly.",
      },
    ],
  },
  {
    title: "Pass values safely with parameters",
    group: "Operations",
    time: "9 min",
    introduction:
      "Application SQL should not glue user text into the query string. Parameter placeholders keep data separate from code and prevent SQL injection. This lab's parameter box feeds values alongside your SQL.",
    context:
      "If you build WHERE name = ' + userInput, a hostile input can close the quote and append destructive SQL. Databases support bound parameters ($1, $2 in PostgreSQL). Treat them as the default for any value that did not come from your own trusted constants.",
    objective:
      "Run a query that uses $1 (and the parameters field) so the filter value is not embedded in the SQL text.",
    concepts: [
      {
        title: "Parameter placeholder",
        description: "$1, $2, … in PostgreSQL text sent to the server.",
      },
      {
        title: "Bound values",
        description: "Passed separately—never trusted as SQL syntax.",
      },
      {
        title: "Injection",
        description:
          "Attack pattern when untrusted input is concatenated into SQL.",
      },
    ],
    example:
      '-- SQL\nSELECT title, genre, rating\nFROM books\nWHERE genre = $1\nORDER BY title;\n\n-- parameters JSON\n["Fantasy"]',
    starter:
      "SELECT title, genre, rating\nFROM books\nWHERE genre = $1\nORDER BY rating DESC, title;",
    parameters: '["Fantasy"]',
    mission:
      'Keep $1 in the SQL and set the parameters JSON to a genre such as "Fantasy" or "Science fiction". Run and confirm only that genre returns. Try changing the parameter without rewriting the SQL string.',
    expectedResult:
      "Rows whose genre matches the bound parameter only. SQL text still shows $1, not a quoted literal genre.",
    schemaNote: "Parameters panel accepts a JSON array aligned with $1, $2, …",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      if (!keys.includes("genre") && !keys.includes("title")) return false;
      if (keys.includes("genre")) {
        const genres = new Set(rows.map((r) => String(r.genre)));
        return genres.size === 1;
      }
      return true;
    },
    successMessage:
      "You kept data out of the SQL string—the essential habit for safe application queries.",
    faqSource:
      "https://www.postgresql.org/docs/current/sql-expressions.html#SQL-EXPRESSIONS-PARAMETERS-POSITIONAL",
    faq: [
      {
        question: "Does a parameter work inside identifiers?",
        answer:
          "No. $1 substitutes values, not table/column names. Whitelist identifiers in app code if they must be dynamic.",
      },
      {
        question: "What about LIKE with parameters?",
        answer:
          "Bind the whole pattern: WHERE title LIKE $1 with value %earth%.",
      },
      {
        question: "Is this lab's box how production works?",
        answer:
          "Conceptually yes: drivers send SQL + params. Real apps use client libraries, not a JSON textarea.",
      },
    ],
  },
  {
    title: "Final lab: Reading Room report",
    group: "Final lab",
    time: "15 min",
    introduction:
      "Combine modeling, safe writes, joins, and aggregates into one small report. You will ensure shelf data exists, assign books, and summarize each shelf.",
    context:
      "Capstones mirror real tickets: several SQL skills, one outcome. Define shelves if needed, attach books through a foreign key, then produce a per-shelf count and average rating. Prefer clear SQL you can explain over clever one-liners.",
    objective:
      "Produce a per-shelf summary with shelf name, book count, and average rating.",
    concepts: [
      {
        title: "Schema + data",
        description:
          "Create or reuse shelves; link books with a foreign key column.",
      },
      {
        title: "Safe assignment",
        description: "UPDATE books with an intentional WHERE; verify.",
      },
      {
        title: "Report",
        description: "JOIN + GROUP BY + ORDER BY for a readable summary.",
      },
    ],
    example:
      "CREATE TABLE IF NOT EXISTS shelves (\n  id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\nINSERT INTO shelves (name) VALUES ('Read next'), ('Favorites')\nON CONFLICT (name) DO NOTHING;\nALTER TABLE books ADD COLUMN IF NOT EXISTS shelf_id integer REFERENCES shelves(id);\nUPDATE books SET shelf_id = (SELECT id FROM shelves WHERE name = 'Read next') WHERE is_read = false;\nUPDATE books SET shelf_id = (SELECT id FROM shelves WHERE name = 'Favorites') WHERE is_read = true AND shelf_id IS NULL;\nSELECT s.name AS shelf,\n       COUNT(b.id) AS book_count,\n       ROUND(AVG(b.rating), 2) AS avg_rating\nFROM shelves AS s\nLEFT JOIN books AS b ON b.shelf_id = s.id\nGROUP BY s.id, s.name\nORDER BY s.name;",
    starter:
      "CREATE TABLE IF NOT EXISTS shelves (\n  id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nINSERT INTO shelves (name) VALUES ('Read next'), ('Favorites')\nON CONFLICT (name) DO NOTHING;\n\nALTER TABLE books\n  ADD COLUMN IF NOT EXISTS shelf_id integer REFERENCES shelves(id);\n\nUPDATE books\nSET shelf_id = (SELECT id FROM shelves WHERE name = 'Read next')\nWHERE is_read = false;\n\nUPDATE books\nSET shelf_id = (SELECT id FROM shelves WHERE name = 'Favorites')\nWHERE is_read = true AND shelf_id IS NULL;\n\nSELECT s.name AS shelf,\n       COUNT(b.id) AS book_count,\n       ROUND(AVG(b.rating), 2) AS avg_rating\nFROM shelves AS s\nLEFT JOIN books AS b ON b.shelf_id = s.id\nGROUP BY s.id, s.name\nORDER BY s.name;",
    mission:
      "Build (or reuse) shelves, assign books to them, and return a LEFT JOIN summary: each shelf name, how many books, and the average rating. Empty shelves should still appear with count 0 if you use LEFT JOIN correctly.",
    expectedResult:
      "One row per shelf with shelf name, book_count, and avg_rating. LEFT JOIN keeps shelves even when no books are assigned.",
    schemaNote: "shelves(id, name) · books.shelf_id → shelves.id",
    check: (result) => {
      const rows = result.rows ?? [];
      if (!rows.length) return false;
      const keys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
      const hasShelf = keys.some((k) => k.includes("shelf") || k === "name");
      const hasCount = keys.some(
        (k) => k.includes("count") || k.includes("book"),
      );
      return hasShelf && hasCount;
    },
    successMessage:
      "You shipped a small end-to-end SQL feature: model, write, join, and summarize. That is the Reading Room course in one lab.",
    faqSource: "https://www.postgresql.org/docs/current/tutorial.html",
    faq: [
      {
        question: "Why LEFT JOIN shelves to books?",
        answer:
          "So shelves with zero books still show up with COUNT 0—inner join would hide them.",
      },
      {
        question: "ADD COLUMN IF NOT EXISTS?",
        answer:
          "Convenient in labs when re-running. Team migrations usually track each change once.",
      },
      {
        question: "What next after this course?",
        answer:
          "Views, window functions, more CTEs, migrations tooling, and indexing strategy for larger data.",
      },
    ],
  },
];
