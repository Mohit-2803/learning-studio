const lessons = [
  {
    title: "Meet GraphQL",
    kicker: "LESSON 01 · THE IDEA",
    time: "3 min read",
    body: "GraphQL is a way for an app to ask a server for data. The server publishes a schema: a typed description of the information and actions the API makes available. An app sends a query naming the data it needs, and the server returns a JSON response with a matching shape. GraphQL is often used by web and mobile apps whose screens need different combinations of connected data.",
    extra:
      "A common problem it helps with: a fixed endpoint can send fields a screen does not use, or a screen may need several requests to gather related data. With GraphQL, the screen describes the fields and relationships it needs in one request. GraphQL is an API approach, not a database: the server can read from databases or other services.",
    query: `{
  hello
}`,
    variables: "",
    explainTitle: "Your first request",
    explain:
      "A query is a read request. The curly braces hold the fields you want. Here, hello is a field the API knows how to answer.",
  },
  {
    title: "Ask for specific fields",
    kicker: "LESSON 02 · FIELDS",
    time: "3 min read",
    body: "A field is a named piece of information the API can return, such as a book’s title or year. The outer braces contain your selection set: the fields you want the server to include. You can ask for multiple fields together, and the JSON response mirrors that selection. If you leave a field out, it is left out of this response too.",
    extra:
      "Notice that you must name the fields inside books. GraphQL does not guess which book details you want. Try removing author, then run the query and compare the response.",
    query: `{
  books {
    title
    author
    year
  }
}`,
    variables: "",
    explainTitle: "The response follows your selection",
    explain:
      "The response includes title, author, and year because those are the fields you selected. Add genre or remove author and run it again.",
  },
  {
    title: "Follow nested data",
    kicker: "LESSON 03 · RELATIONSHIPS",
    time: "3 min read",
    body: "Some fields return an object or a list of objects instead of a single value. Those fields need a nested selection set so you can say which details you want from each object. Here viewer returns a user, and readingList returns books. The inner title and author selections apply to each book in that list.",
    extra:
      "The nesting follows the data relationship: viewer → readingList → each book → its fields. You cannot request an object by itself; tell GraphQL which fields to return from it. The schema defines which paths are available.",
    query: `{
  viewer {
    name
    favoriteGenres
    readingList {
      title
      author
    }
  }
}`,
    variables: "",
    explainTitle: "One request, connected data",
    explain:
      "The viewer field returns an object. Inside it you select name and readingList; each book in the list has its own title and author fields.",
  },
  {
    title: "Use arguments to find data",
    kicker: "LESSON 04 · ARGUMENTS",
    time: "3 min read",
    body: 'Arguments are inputs you pass to a field. They let a field return a particular item or a filtered result. In book(id: "2"), id is the argument name and "2" is its value. The schema says that id is required and has the ID type. Arguments are useful for lookups, search terms, filters, and pagination.',
    extra:
      'Try changing the id to "1". The server returns null if no book has that ID. A nullable result can be missing, so your app should be ready to handle null.',
    query: `{
  book(id: "2") {
    title
    author
    genre
    rating
  }
}`,
    variables: "",
    explainTitle: "Arguments shape the result",
    explain:
      "The id argument tells the book field which record to look up. The nested fields still decide which details come back.",
  },
  {
    title: "Keep changing values in variables",
    kicker: "LESSON 05 · VARIABLES",
    time: "4 min read",
    body: "A variable lets you reuse the same query with different input. Declare it after the operation name, include its GraphQL type, then refer to it with a dollar sign. The JSON Variables panel supplies the value separately. This avoids rebuilding query text for every search, and GraphQL checks that the value matches the declared type.",
    extra:
      'String is text, and the exclamation mark in String! means the value is required. Try changing the JSON value from "science" to "fantasy" and run the same query. The query text stays unchanged while the result changes.',
    query: `query FindBooks($term: String!) {
  searchBooks(text: $term) {
    title
    author
    genre
  }
}`,
    variables: `{
  "term": "science"
}`,
    explainTitle: "Query text and values are separate",
    explain:
      "$term is declared as a required String and passed to searchBooks. The Variables panel supplies its value as JSON.",
  },
  {
    title: "Make a change with a mutation",
    kicker: "LESSON 06 · MUTATIONS",
    time: "4 min read",
    body: "A query is for reading data. A mutation is for requesting a change, such as adding a record or updating a setting. The word mutation declares the operation type. Like a query, a mutation can select fields from the result, so the server can confirm what changed in its response. Here addBook receives title and author and returns the new book.",
    extra:
      "The addBook example changes the in-memory list. Restarting the server resets the sample data. Mutations change server state, so apps typically run them in response to a user action such as pressing Save.",
    query: `mutation AddOne {
  addBook(title: "A Wizard of Earthsea", author: "Ursula K. Le Guin") {
    id
    title
    author
    read
  }
}`,
    variables: "",
    explainTitle: "Mutations write, then return data",
    explain:
      "Run the same mutation twice to see the new ID increase. Then select the Browse books lesson to see the updated list.",
  },
  {
    title: "Read the error, improve the query",
    kicker: "LESSON 07 · SCHEMA & ERRORS",
    time: "4 min read",
    body: "The schema is the API contract. It lists the types (like Book), fields (like title), arguments, and value types. For example, String! means a required text value, while Book can be null if a lookup finds nothing. Before resolving a request, GraphQL validates that fields exist, required arguments are present, and object fields have selections. A validation error explains what needs fixing.",
    extra:
      "Try changing “titel” below to “title”. The server response should point out the unknown field and suggest valid ones. Then try book { title } to see the error for the missing required id argument.",
    query: `{
  book(id: "1") {
    titel
  }
}`,
    variables: "",
    explainTitle: "Errors are part of learning",
    explain:
      "The server should explain that titel is not a field on Book and suggest a valid field. Fixing it gives the query a valid shape.",
  },
  {
    title: "Explore the whole collection",
    kicker: "LESSON 08 · YOUR TURN",
    time: "3 min read",
    body: "You have the building blocks: queries read data, fields choose which values come back, nested selections follow relationships, arguments shape a lookup, variables carry reusable inputs, and mutations request changes. Combine them to answer a question about this tiny library. In a real app, a frontend sends the operation and variables to a GraphQL server, which validates them against its schema and resolves the requested data.",
    extra:
      'Try searchBooks(text: "Fantasy") or mark a book read with markBookRead(id: "2", read: true). GraphQL is especially handy when multiple screens need different connected data; a simpler API may be enough for a small service with a few fixed endpoints.',
    query: `{
  books {
    title
    genre
    read
    rating
  }
}`,
    variables: "",
    explainTitle: "Your turn",
    explain:
      "Pick a field or argument to experiment with. After a mutation, come back here and run this query to see the changed data.",
  },
];
const chapterDetails = [
  {
    lead: "A GraphQL API is a typed menu of data. A client asks for fields by name, and the server returns a JSON object with that same shape.",
    why: "This first example asks for one simple value. It lets us see the full request path before adding books, search, or relationships.",
    query: `{\n  hello\n}`,
    client: `const response = await fetch("/graphql", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ query: "{ hello }" })\n});\nconst result = await response.json();`,
    resolver: `hello: () => "Hello from your GraphQL server! 👋",`,
    backend:
      "The server receives the request, checks that hello exists in the Query type, then calls the hello resolver. This resolver returns a text value directly, so no database is needed for this example.",
    data: "A resolver is the function that supplies a field’s value. In this case the value is hard-coded. In a larger app, a resolver might call a database or another API.",
  },
  {
    lead: "Fields are the exact pieces of information you select. A selection set is the group of fields inside braces. The server uses your selection to shape the response.",
    why: "Compare this request with the full book objects in the sample data: only the selected fields are included in the response.",
    query: `{\n  books {\n    title\n    author\n    year\n  }\n}`,
    client: `const result = await request({\n  query: "{ books { title author year } }"\n});\nconsole.log(result.data.books);`,
    resolver: `books: () => books,`,
    backend:
      "The books resolver returns the available book records. GraphQL then reads title, author, and year from each returned book and includes only those selected fields in the JSON response.",
    data: "This project keeps its sample books in a JavaScript array in server.js. A production resolver could instead run a database query such as SELECT title, author, year FROM books. The GraphQL selection is the API request; the resolver decides how to fetch the data.",
  },
  {
    lead: "Nested selections follow relationships. A viewer is a user object; their readingList is a list of book objects. Each object needs its own selection set.",
    why: "The response mirrors the path in the query: viewer, then readingList, then the chosen fields for each book.",
    query: `{\n  viewer {\n    name\n    readingList {\n      title\n      author\n    }\n  }\n}`,
    client: `const result = await request({\n  query: "{ viewer { name readingList { title author } } }"\n});\nconsole.log(result.data.viewer);`,
    resolver: `viewer: () => ({\n  name: "Alex",\n  readingList: () => books.filter(book => !book.read)\n}),`,
    backend:
      "The Query resolver returns the viewer object. GraphQL then resolves readingList on that object and fetches the unread books. It follows the nested fields and assembles one response.",
    data: "The readingList resolver filters the same in-memory books array. With a database, this relationship might be fetched with a user ID and a query against a user_books table. GraphQL does not decide the storage model; the resolver does.",
  },
  {
    lead: "Arguments are inputs to fields. They help a resolver look up a particular record or filter a collection. The schema defines which arguments are accepted and their types.",
    why: 'Change the ID to "1" and run this example in the workbench below. If there is no matching book, the nullable book field returns null.',
    query: `{\n  book(id: "3") {\n    title\n    genre\n    rating\n  }\n}`,
    client: `const result = await request({\n  query: "{ book(id: \\\"3\\\") { title genre rating } }"\n});\nconsole.log(result.data.book);`,
    resolver: `book: ({ id }) =>\n  books.find(book => book.id === id) || null,`,
    backend:
      "GraphQL validates the required ID argument, then passes it to the book resolver. The resolver searches the sample array and returns one matching object or null.",
    data: "The sample uses Array.find. A database backed version would typically use a parameterized query such as SELECT * FROM books WHERE id = ?. Parameterized database queries help keep user input separate from SQL text.",
  },
  {
    lead: "Variables keep a query reusable while its input changes. Declare a variable and type in the operation, use $term where needed, and send the value as JSON alongside the query.",
    why: 'Change only the variable value from "fantasy" to "science". The operation stays the same while the server returns a different set of books.',
    query: `query Search($term: String!) {\n  searchBooks(text: $term) {\n    title\n    genre\n  }\n}`,
    client:
      `const query = ` +
      "`" +
      `query Search($term: String!) { searchBooks(text: $term) { title genre } }` +
      "`" +
      `;\nconst variables = { term: "fantasy" };\nconst result = await request({ query, variables });\nconsole.log(result.data.searchBooks);`,
    resolver: `searchBooks: ({ text }) =>\n  books.filter(book =>\n    (book.title + " " + book.author + " " + book.genre)\n      .toLowerCase().includes(text.toLowerCase())\n  ),`,
    backend:
      "The GraphQL server checks that term is provided as a String, then passes its value to the searchBooks resolver. The resolver filters the available records and returns the matching books.",
    data: "This demo searches an in-memory array. A database could use a parameterized search query or a full-text index. Variables are a safe, structured way to pass values to GraphQL; they do not automatically make every database resolver secure, so database inputs should also be parameterized.",
  },
  {
    lead: "Queries read information. Mutations request a change. A mutation can also select fields from the updated object, so the client sees what the server changed.",
    why: "Run the example more than once and notice the new ID. Then return to the book list query to see the new record in this server session.",
    query: `mutation AddBook {\n  addBook(title: "A Wizard of Earthsea", author: "Ursula K. Le Guin") {\n    id\n    title\n    author\n    read\n  }\n}`,
    client:
      `const result = await request({\n  query: ` +
      "`" +
      `mutation { addBook(title: "A Wizard of Earthsea", author: "Ursula K. Le Guin") { id title read } }` +
      "`" +
      `\n});\nconsole.log(result.data.addBook);`,
    resolver: `addBook: ({ title, author }) => {\n  const id = String(Math.max(0, ...books.map(book => Number(book.id))) + 1);\n  const book = {\n    id, title, author, year: new Date().getFullYear(),\n    genre: "Unsorted", read: false, rating: null,\n    summary: "A newly added book."\n  };\n  books = [...books, book];\n  return book;\n}`,
    backend:
      "The server validates the mutation arguments, calls addBook, updates its book list, and then resolves the selected fields from the returned book.",
    data: "For teaching, the mutation changes an in-memory array. That means the data resets when the server restarts. A real app would usually validate the change, write it to a database in a transaction, then return the saved record.",
  },
  {
    lead: "The schema is the API contract: it lists types, fields, arguments, and whether values may be missing. GraphQL validates the operation before running its data resolvers.",
    why: "This query deliberately asks for titel, which does not exist on Book. The response points out the invalid field. Fix it to title and run it again.",
    query: `{\n  book(id: "1") {\n    titel\n  }\n}`,
    client: `const result = await request({\n  query: "{ book(id: \\\"1\\\") { titel } }"\n});\nif (result.errors) {\n  console.error(result.errors[0].message);\n}`,
    resolver: `type Book {\n  id: ID!\n  title: String!\n  author: String!\n}\n\ntype Query {\n  book(id: ID!): Book\n}`,
    backend:
      "Validation happens before the book resolver runs. Because titel is not in the Book type, GraphQL returns an error and can suggest title. A missing required ID argument is also caught from the schema.",
    data: "Types communicate expectations: String! means a required string, while Book without ! may be null. This schema validation is useful for clients and server developers. It does not replace authorization checks inside resolvers.",
  },
  {
    lead: "Now combine the ideas: use a variable to search books, select a few fields, and request the viewer’s related reading list in the same operation.",
    why: "This chapter brings the pieces together. Below are the runnable query and JavaScript labs, followed by all practice challenges. Use the examples from earlier chapters as starting points.",
    query: `query ExploreLibrary($term: String!) {\n  searchBooks(text: $term) {\n    title\n    author\n    genre\n    read\n  }\n  viewer {\n    name\n    readingList {\n      title\n    }\n  }\n}`,
    client:
      `const query = ` +
      "`" +
      `query ExploreLibrary($term: String!) { searchBooks(text: $term) { title author genre read } viewer { name readingList { title } } }` +
      "`" +
      `;\nconst variables = { term: "fantasy" };\nconst result = await request({ query, variables });\nconsole.log(result.data);`,
    resolver: `searchBooks: ({ text }) => filterBooks(text),\nviewer: () => getCurrentViewer(),\nreadingList: (viewer) =>\n  findUnreadBooks(viewer.id),`,
    backend:
      "The server validates the full operation, then resolves each requested root field. Nested fields are resolved from their parent objects. The response combines the selected results under data, keeping the same shape as the query.",
    data: "The example API uses small resolver functions over in-memory sample data. In production, resolvers commonly call service functions that query a database. Data loaders or batching can help avoid making one database request per item when resolving large nested lists.",
  },
];
const chapterBreakdowns = [
  {
    steps: [
      [
        "query BookTitles",
        "Give the operation a name so it is easier to recognize in tools and logs.",
      ],
      ["books", "Ask the API for its collection of books."],
      [
        "title, author",
        "Select only these fields; GraphQL leaves other book fields out of the response.",
      ],
      [
        "Same shape",
        "The JSON response follows the fields and nesting requested by the client.",
      ],
    ],
    response: `{\n  "data": {\n    "books": [\n      { "title": "The Hobbit", "author": "J.R.R. Tolkien" },\n      { "title": "Kindred", "author": "Octavia E. Butler" },\n      { "title": "Piranesi", "author": "Susanna Clarke" },\n      { "title": "The Left Hand of Darkness", "author": "Ursula K. Le Guin" }\n    ]\n  }\n}`,
  },
  {
    steps: [
      ["books", "Ask the API for the collection of books."],
      ["{ ... }", "Open a selection set because books returns book objects."],
      [
        "title, author, year",
        "Choose only these three fields for every book in the list.",
      ],
    ],
    response: `{\n  "data": {\n    "books": [\n      { "title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937 },\n      { "title": "Kindred", "author": "Octavia E. Butler", "year": 1979 },\n      { "title": "Piranesi", "author": "Susanna Clarke", "year": 2020 },\n      { "title": "The Left Hand of Darkness", "author": "Ursula K. Le Guin", "year": 1969 }\n    ]\n  }\n}`,
  },
  {
    steps: [
      ["viewer", "Start at the current user object."],
      ["readingList", "Move to the related list of unread books."],
      ["title, author", "For each book, request only its title and author."],
    ],
    response: `{\n  "data": {\n    "viewer": {\n      "name": "Alex",\n      "readingList": [\n        { "title": "Kindred", "author": "Octavia E. Butler" },\n        { "title": "Piranesi", "author": "Susanna Clarke" }\n      ]\n    }\n  }\n}`,
  },
  {
    steps: [
      ["book(...)", "Call the single-book field."],
      [
        'id: "3"',
        "Pass the ID as an argument so the resolver knows what to look up.",
      ],
      [
        "title, genre, rating",
        "Select the details to return from the matching book.",
      ],
    ],
    response: `{\n  "data": {\n    "book": {\n      "title": "Piranesi",\n      "genre": "Fantasy",\n      "rating": 4.5\n    }\n  }\n}`,
  },
  {
    steps: [
      [
        "$term: String!",
        "Declare a variable named term. String! means required text.",
      ],
      ["text: $term", "Pass that variable into the search field."],
      [
        "Variables JSON",
        'The separate Variables panel supplies { "term": "fantasy" }.',
      ],
    ],
    response: `{\n  "data": {\n    "searchBooks": [\n      { "title": "The Hobbit", "genre": "Fantasy" },\n      { "title": "Piranesi", "genre": "Fantasy" }\n    ]\n  }\n}`,
  },
  {
    steps: [
      [
        "mutation AddBook",
        "Declare a write operation. The optional name helps people recognize it.",
      ],
      ["title, author", "Send the values the server needs to create a book."],
      [
        "{ id, title, author, read }",
        "Choose the fields GraphQL should return after the change.",
      ],
    ],
    response: `{\n  "data": {\n    "addBook": {\n      "id": "5",\n      "title": "A Wizard of Earthsea",\n      "author": "Ursula K. Le Guin",\n      "read": false\n    }\n  }\n}`,
  },
  {
    steps: [
      [
        'book(id: "1")',
        "This lookup has its required ID, so that part is valid.",
      ],
      ["titel", "This field is misspelled. Book has title, not titel."],
      [
        "Validation first",
        "GraphQL rejects the operation before calling the book resolver.",
      ],
    ],
    response: `{\n  "errors": [\n    {\n      "message": "Cannot query field \\"titel\\" on type \\"Book\\". Did you mean \\"title\\"?"\n    }\n  ]\n}`,
  },
  {
    steps: [
      [
        "ExploreLibrary($term: String!)",
        "Name the operation and declare its required search input.",
      ],
      [
        "searchBooks + viewer",
        "Request two related root fields in a single operation.",
      ],
      [
        "Nested readingList",
        "Follow the viewer relationship and select each book title.",
      ],
      [
        "Same-shape response",
        "The returned JSON mirrors the fields and nesting in this query.",
      ],
    ],
    response: `{\n  "data": {\n    "searchBooks": [\n      { "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "read": true },\n      { "title": "Piranesi", "author": "Susanna Clarke", "genre": "Fantasy", "read": false }\n    ],\n    "viewer": {\n      "name": "Alex",\n      "readingList": [\n        { "title": "Kindred" },\n        { "title": "Piranesi" }\n      ]\n    }\n  }\n}`,
  },
];
lessons.splice(1, 0, {
  title: "Build the backend schema",
  kicker: "LESSON 02 · SERVER CONTRACT",
  time: "4 min read",
  body: "To offer GraphQL, the backend must expose a GraphQL endpoint and define a schema. The schema is the contract shared by the client and server: it describes object types, fields, inputs, and operations. A React client cannot make an existing REST server understand GraphQL by itself.",
  extra:
    "You can keep your existing database and tables. The GraphQL server sits in front of them and its resolvers call the data layer. A team can also keep REST endpoints while adding GraphQL alongside them.",
  query: `{\n  books {\n    id\n    title\n    author\n  }\n}`,
  variables: "",
  explainTitle: "The schema describes the API",
  explain:
    "The schema says what clients are allowed to ask for. Resolver functions, which we will study next, supply the actual values.",
});
chapterDetails.splice(1, 0, {
  lead: "GraphQL must be implemented on the server as well as used by the client. The server publishes a schema that describes the API operations and data types clients may request.",
  why: "This is GraphQL SDL (Schema Definition Language). It describes API types and operations; it does not create database tables or store records by itself.",
  query: `{\n  books {\n    id\n    title\n    author\n  }\n}`,
  client: `const query = "{ books { id title author } }";\nconst result = await request({ query });\nconsole.log(result.data.books);`,
  resolver: `type Book {\n  id: ID!\n  title: String!\n  author: String!\n  year: Int!\n}\n\ntype Query {\n  books: [Book!]!\n  book(id: ID!): Book\n}\n\ntype Mutation {\n  addBook(title: String!, author: String!): Book!\n}`,
  backend:
    "In this project, server.js passes this schema to buildSchema from the graphql package. The schema tells GraphQL which operations and fields exist and which arguments are required. The backend must also provide resolver functions for fields that need data.",
  data: "Type punctuation carries meaning: ID! is a required ID, [Book!]! means a required list with no null book entries, and Book without ! may be null. The schema is independent from your database design. Resolvers can use the same tables, services, and business rules your REST routes already use.",
});
chapterBreakdowns.splice(1, 0, {
  steps: [
    ["type Book", "Define the shape and fields of a book returned by the API."],
    ["type Query", "List the read operations clients can request."],
    [
      "books: [Book!]!",
      "Return a required list of books; each list item must be a Book.",
    ],
    ["type Mutation", "Describe write operations, such as adding a book."],
  ],
  response: `{
  "data": {
    "books": [
      { "id": "1", "title": "The Hobbit", "author": "J.R.R. Tolkien" },
      { "id": "2", "title": "Kindred", "author": "Octavia E. Butler" }
    ]
  }
}`,
});
Object.assign(lessons[0], {
  title: "GraphQL has two sides",
  kicker: "LESSON 01 · CLIENT + SERVER",
  time: "4 min read",
  body: "GraphQL is a way for a client and a server to agree on how data is requested. React is commonly the frontend; Node.js is commonly the backend. React sends a query to a GraphQL endpoint. The Node server checks it against a schema, runs resolver functions, and returns JSON. Both sides matter: a React app can send GraphQL requests, but a backend must implement GraphQL for that endpoint to answer them.",
  extra:
    "If a backend only exposes REST routes, a GraphQL query sent to it will not work automatically. Add a GraphQL server or gateway that translates GraphQL operations into calls to existing services. Your database usually does not need to be replaced.",
  explainTitle: "Think of GraphQL as a full request path",
  explain:
    "The client describes the data it needs. The server owns the schema and resolvers that make the request work. This project uses a Node.js server and a browser client.",
});
Object.assign(chapterDetails[0], {
  lead: "GraphQL is a contract and request flow shared by a client and a server. The client asks for data; the backend must define and implement the GraphQL API that answers it.",
  why: "The same operation touches both sides: the React client sends a query, and the Node.js server validates it, resolves the requested fields, and returns JSON.",
  query: `query BookTitles {\n  books {\n    title\n    author\n  }\n}`,
  client: `const result = await request({\n  query: "{ books { title author } }"\n});\nrenderBooks(result.data.books);`,
  resolver: `const result = await graphql({\n  schema,\n  source: query,\n  rootValue: root,\n  variableValues: variables\n});`,
  backend:
    "This project runs a Node.js HTTP server with a POST /graphql endpoint. The browser sends its operation there. The graphql library validates and executes it using the schema and resolver functions provided by the backend.",
  data: "A GraphQL request does not go straight from React to the database. It goes to the GraphQL server. Resolvers call the data source—an array in this practice project, or database/service functions in a real app—then GraphQL shapes the JSON response. If you already have a REST backend, you need to add a GraphQL endpoint or gateway; the React client change alone is not enough. You can usually reuse your existing database and business logic behind the new resolvers.",
});
Object.assign(lessons[7], {
  title: "Connect React to a Node server",
  kicker: "LESSON 08 · FULL-STACK FLOW",
  time: "4 min read",
  body: "A React component can send a GraphQL operation with fetch (or a client library such as Apollo Client). The Node server receives it at /graphql, validates it against the schema, runs resolvers, and returns JSON. The component then puts the returned data into its state and renders the screen.",
  extra:
    "The code below shows the two sides together. This project’s working page uses browser JavaScript rather than React, but the Node GraphQL endpoint is the same one a React app can call.",
  query: `{\n  books {\n    id\n    title\n    author\n  }\n}`,
  variables: "",
  explainTitle: "One endpoint connects the two apps",
  explain:
    "React sends an HTTP POST to /graphql. Node executes the operation and returns JSON. Apollo Client is optional; fetch is enough to understand the basic request.",
});
Object.assign(chapterDetails[7], {
  lead: "Here is the client-to-server connection: React sends a query to a Node.js GraphQL endpoint, then renders the data returned by the resolver.",
  why: "The client and server are separate pieces of the project. The React component does not fetch the database directly; it calls the API endpoint and receives the server’s response.",
  query: `{\n  books {\n    id\n    title\n    author\n  }\n}`,
  client: `import { useEffect, useState } from "react";\n\nfunction BookList() {\n  const [books, setBooks] = useState([]);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("/graphql", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({\n        query: "{ books { id title author } }"\n      })\n    })\n      .then(response => response.json())\n      .then(result => {\n        if (result.errors) throw new Error(result.errors[0].message);\n        setBooks(result.data.books);\n      })\n      .catch(error => setError(error.message));\n  }, []);\n\n  if (error) return <p>{error}</p>;\n  return books.map(book =>\n    <p key={book.id}>{book.title} — {book.author}</p>\n  );\n}`,
  resolver: `const result = await graphql({\n  schema,\n  source: query,\n  rootValue: root,\n  variableValues: variables\n});\nresponse.end(JSON.stringify(result));`,
  backend:
    "The Node route reads the posted query and variables, then calls graphql() with the schema and root resolvers. The library validates and runs the operation. The route serializes the result as JSON and sends it back to React.",
  data: "React is the frontend component; Node.js is the backend server. useEffect starts the request when the component appears, setBooks stores returned data in React state, and React re-renders the list. This sample also handles a GraphQL error. If the frontend and backend run on different origins, use the server’s full URL and configure CORS on the server. The resolver uses this project’s in-memory array; it could call a database service without changing the query shape.",
});
chapterBreakdowns[7] = {
  steps: [
    ["useEffect", "Start the request after React mounts the component."],
    ["fetch('/graphql')", "Send an HTTP POST to the Node GraphQL endpoint."],
    [
      "result.data.books",
      "Read the selected field from GraphQL’s JSON response.",
    ],
    [
      "setBooks(...) ",
      "Store the result in React state so the component re-renders.",
    ],
  ],
  response: `{
  "data": {
    "books": [
      { "id": "1", "title": "The Hobbit", "author": "J.R.R. Tolkien" },
      { "id": "2", "title": "Kindred", "author": "Octavia E. Butler" },
      { "id": "3", "title": "Piranesi", "author": "Susanna Clarke" },
      { "id": "4", "title": "The Left Hand of Darkness", "author": "Ursula K. Le Guin" }
    ]
  }
}`,
};
lessons.splice(
  8,
  0,
  {
    title: "Filter, sort, and shape lists",
    kicker: "LESSON 09 · FILTERING + PAGINATION",
    time: "4 min read",
    body: "Collection fields can accept arguments that filter, sort, and limit results. Aliases let you request the same field more than once with different arguments and give each result a clear response key.",
    extra:
      "Try changing the genre, sortBy value, or limit. The schema accepts genre, read, minRating, limit, and sortBy. Keep result sets small when a screen only needs a few records.",
    query: `query BrowseLibrary {\n  topFantasy: books(genre: "Fantasy", sortBy: "rating", limit: 2) { title rating }\n  unread: books(read: false, limit: 3) { title read }\n}`,
    variables: "",
    explainTitle: "Arguments shape the list",
    explain:
      "Aliases label two calls to books with different arguments in the same response.",
  },
  {
    title: "Reuse selections with fragments",
    kicker: "LESSON 10 · FRAGMENTS",
    time: "3 min read",
    body: "A fragment is a reusable selection set for a particular type. It helps keep repeated fields consistent when an operation asks for several related lists or objects.",
    extra:
      "Fragments are useful as operations grow. A fragment can be shared between fields of the same type, but it must match the object type where it is spread.",
    query: `query LibraryCards {\n  books(limit: 3) {\n    ...BookCard\n  }\n}\nfragment BookCard on Book { title author genre read }`,
    variables: "",
    explainTitle: "Reuse a type's field set",
    explain:
      "The BookCard fragment selects the same Book fields for every result.",
  },
  {
    title: "Add reviews and follow relationships",
    kicker: "LESSON 11 · MUTATIONS + RELATIONSHIPS",
    time: "5 min read",
    body: "Mutations can create related records. This API lets you add a review to a book, then query that book's reviews and review count. The mutation returns the created review so a client can update its screen immediately.",
    extra:
      "Run the mutation once, then use a read query to inspect the updated relationship. The demo server keeps changes in memory; use Reset sample data to restore the starter library.",
    query: `mutation AddReview {\n  addReview(bookId: "3", reviewer: "You", rating: 5, comment: "A thoughtful read.") { id bookTitle reviewer rating comment }\n}`,
    variables: "",
    explainTitle: "Write, then read related data",
    explain:
      'After adding a review, query book(id: "3") { reviews { reviewer rating comment } reviewCount }.',
  },
);
chapterDetails.splice(
  8,
  0,
  {
    lead: "Arguments let a collection field filter and order its results. Aliases let one operation request the same field with different inputs.",
    why: "Run the example and compare the two response keys. Change sortBy to title or year and observe how the list changes.",
    query: `query BrowseLibrary {\n  topFantasy: books(genre: "Fantasy", sortBy: "rating", limit: 2) { title rating }\n  unread: books(read: false, limit: 3) { title read }\n}`,
    client: `const result = await request({ query: "{ topFantasy: books(genre: \\\"Fantasy\\\", limit: 2) { title rating } }" });\nconsole.log(result.data.topFantasy);`,
    resolver: `books: ({ genre, read, minRating, limit, sortBy }) => {\n  let results = filterBooks({ genre, read, minRating });\n  results = sortBooks(results, sortBy);\n  return results.slice(0, limit);\n}`,
    backend:
      "The schema declares optional arguments, and the root resolver applies requested filters before GraphQL resolves fields for each book.",
    data: "Use limit for small screens. This sample uses offset-style limiting rather than cursor pagination; cursors are often better when lists change frequently or grow large.",
  },
  {
    lead: "Fragments name a reusable set of fields on a GraphQL type. Spreading the fragment into a selection set keeps repeated object shapes consistent.",
    why: "The BookCard fragment is applied to every book. Add a field to it and it appears in each result.",
    query: `query LibraryCards {\n  books(limit: 3) { ...BookCard }\n}\nfragment BookCard on Book { title author genre read }`,
    client: `const query = "query LibraryCards { books(limit: 3) { ...BookCard } } fragment BookCard on Book { title author genre read }";\nconst result = await request({ query });\nconsole.log(result.data.books);`,
    resolver: `fragment BookCard on Book {\n  title\n  author\n  genre\n  read\n}`,
    backend:
      "Fragments are validated and expanded by GraphQL during execution. They do not create extra API calls.",
    data: "Fragments can be shared across client operations to keep selections aligned. Avoid requesting fields a screen does not need.",
  },
  {
    lead: "A mutation can create a related record and return it. The review's bookId links it to a book, so a later query can traverse from the book to its reviews.",
    why: "Run the mutation, then query the book again. The sample server adds the review to in-memory state until reset or restart.",
    query: `mutation AddReview {\n  addReview(bookId: "3", reviewer: "You", rating: 5, comment: "A thoughtful read.") { id bookTitle reviewer rating comment }\n}`,
    client: `const result = await request({ query: "mutation { addReview(bookId: \\\"3\\\", reviewer: \\\"You\\\", rating: 5, comment: \\\"A thoughtful read.\\\") { id bookTitle rating } }" });\nconsole.log(result.data.addReview);`,
    resolver: `addReview: ({ bookId, reviewer, rating, comment }) => {\n  const review = { id: nextId(), bookId, reviewer, rating, comment };\n  store.reviews.push(review);\n  return review;\n}`,
    backend:
      "The addReview resolver validates the target book, creates the record, and appends it to the in-memory store.",
    data: "A production resolver should validate permissions and rating bounds and persist the record. The sample demonstrates operation shape, not authentication or durable storage.",
  },
);
chapterBreakdowns.splice(
  8,
  0,
  {
    steps: [
      ["genre / read", "Filter collection results with field arguments."],
      ["sortBy + limit", "Choose an order and keep only a small result set."],
      [
        "topFantasy / unread",
        "Aliases label two calls to books in one response.",
      ],
    ],
    response: `{"data":{"topFantasy":[{"title":"Piranesi","rating":4.5}],"unread":[{"title":"Kindred","read":false}]}}`,
  },
  {
    steps: [
      ["fragment BookCard", "Name a reusable field set on Book."],
      ["...BookCard", "Spread the fragment into books."],
      ["Same shape", "GraphQL returns those selected fields for each object."],
    ],
    response: `{"data":{"books":[{"title":"The Hobbit","author":"J.R.R. Tolkien","genre":"Fantasy","read":true}]}}`,
  },
  {
    steps: [
      ["addReview", "Create a review linked to a book ID."],
      ["return fields", "Select details from the new review."],
      ["book.reviews", "Query the relationship after the mutation."],
    ],
    response: `{"data":{"addReview":{"id":"4","bookTitle":"Piranesi","reviewer":"You","rating":5,"comment":"A thoughtful read."}}}`,
  },
);
Object.assign(lessons[11], {
  title: "Final lab: bring both sides together",
  kicker: "LESSON 18 · FINAL LAB · PRACTICE + PLAYGROUND",
  time: "Explore at your pace",
  body: "You have now seen both sides: the client operation and the server schema, resolvers, and data source. Use the lab to run queries and mutations, inspect real JSON responses, and complete the practice questions.",
  extra:
    "Try an earlier chapter’s query here, change its fields or variables, then compare the result. The examples use an in-memory library, so mutations reset when the Node server restarts.",
  query: `query ExploreLibrary($term: String!) {\n  searchBooks(text: $term) {\n    title\n    author\n    genre\n    read\n  }\n  viewer {\n    name\n    readingList {\n      title\n    }\n  }\n}`,
  variables: `{"term":"fantasy"}`,
});
const practices = [
  {
    title: "Say hello",
    skill: "Your first query",
    prompt: "Ask the API for its hello field.",
    starter: `{
  
}`,
    hint: "Start with curly braces and put hello inside.",
    answer: `{\n  hello\n}`,
    check: (r) => r?.data?.hello === "Hello from your GraphQL server! 👋",
  },
  {
    title: "List book titles",
    skill: "Fields",
    prompt: "Get all books, but ask for only their titles.",
    starter: `{
  books {
    
  }
}`,
    hint: "books is a list, so select its fields inside another pair of braces.",
    answer: `{\n  books {\n    title\n  }\n}`,
    check: (r) =>
      Array.isArray(r?.data?.books) &&
      r.data.books.length > 0 &&
      r.data.books.every(
        (b) => typeof b.title === "string" && Object.keys(b).length === 1,
      ),
  },
  {
    title: "Find one book",
    skill: "Arguments",
    prompt: 'Look up the book with ID "3" and return its title and genre.',
    starter: `{
  book(id: "3") {
    
  }
}`,
    hint: 'Use book(id: "3") and select title and genre.',
    answer: `{\n  book(id: "3") {\n    title\n    genre\n  }\n}`,
    check: (r) =>
      r?.data?.book?.title === "Piranesi" &&
      typeof r.data.book.genre === "string" &&
      Object.keys(r.data.book).length === 2,
  },
  {
    title: "Search with a variable",
    skill: "Variables",
    prompt:
      "Search for books matching “fantasy”. Use a $term variable and return each matching title.",
    starter: `query Search($term: String!) {
  searchBooks(text: $term) {
    
  }
}`,
    hint: 'Declare $term as String!, pass it into searchBooks(text: $term), then supply { "term": "fantasy" } in Variables.',
    answer: `query Search($term: String!) {\n  searchBooks(text: $term) {\n    title\n  }\n}`,
    variables: `{\n  "term": "fantasy"\n}`,
    check: (r) =>
      Array.isArray(r?.data?.searchBooks) &&
      r.data.searchBooks.length > 0 &&
      r.data.searchBooks.every(
        (b) => typeof b.title === "string" && Object.keys(b).length === 1,
      ),
  },
  {
    title: "Follow a relationship",
    skill: "Nested fields",
    prompt: "Ask for the viewer’s name and the titles in their reading list.",
    starter: `{
  viewer {
    
    readingList {
      
    }
  }
}`,
    hint: "Select viewer, then name and readingList. Inside readingList, select title.",
    answer: `{\n  viewer {\n    name\n    readingList {\n      title\n    }\n  }\n}`,
    check: (r) =>
      typeof r?.data?.viewer?.name === "string" &&
      Array.isArray(r.data.viewer.readingList) &&
      r.data.viewer.readingList.every(
        (b) => typeof b.title === "string" && Object.keys(b).length === 1,
      ),
  },
  {
    title: "Change a book’s read status",
    skill: "Mutation",
    prompt:
      'Mark book ID "2" as read. Return the book’s title and read status.',
    starter: `mutation {
  markBookRead(id: "2", read: true) {
    
  }
}`,
    hint: 'Use mutation and call markBookRead(id: "2", read: true).',
    answer: `mutation {\n  markBookRead(id: "2", read: true) {\n    title\n    read\n  }\n}`,
    check: (r) =>
      r?.data?.markBookRead?.read === true &&
      typeof r.data.markBookRead.title === "string" &&
      Object.keys(r.data.markBookRead).length === 2,
  },
  {
    title: "Use aliases to compare lists",
    skill: "Arguments + aliases",
    prompt:
      "Request the top two fantasy books and the first two unread books in one operation.",
    starter: `query Compare {
  topFantasy: books(genre: "Fantasy", limit: 2) {  }
  unread: books(read: false, limit: 2) {  }
}`,
    hint: "Call books twice with different arguments and name the results topFantasy and unread.",
    answer: `query Compare {\n  topFantasy: books(genre: "Fantasy", limit: 2) { title }\n  unread: books(read: false, limit: 2) { title }\n}`,
    check: (r) =>
      Array.isArray(r?.data?.topFantasy) && Array.isArray(r?.data?.unread),
  },
  {
    title: "Reuse a fragment",
    skill: "Fragments",
    prompt:
      "Return book cards with title, author, and genre using a BookCard fragment.",
    starter: `query Cards {
  books(limit: 2) { ...BookCard }
}
fragment BookCard on Book {  }`,
    hint: "Declare fragment BookCard on Book, then spread it inside books.",
    answer: `query Cards { books(limit: 2) { ...BookCard } }\nfragment BookCard on Book { title author genre }`,
    check: (r) =>
      Array.isArray(r?.data?.books) &&
      r.data.books.length > 0 &&
      r.data.books.every((b) => b.title && b.author && b.genre),
  },
  {
    title: "Post a review",
    skill: "Related mutation",
    prompt: "Add a five-star review to book 3 and return its ID and rating.",
    starter: `mutation {
  addReview(bookId: "3", reviewer: "Learner", rating: 5, comment: "Great book") {
    
  }
}`,
    hint: "Use addReview with bookId, reviewer, rating, and comment arguments.",
    answer: `mutation { addReview(bookId: "3", reviewer: "Learner", rating: 5, comment: "Great book") { id rating } }`,
    check: (r) =>
      Boolean(r?.data?.addReview?.id) && r.data.addReview.rating === 5,
  },
  {
    title: "Inspect nested reviews",
    skill: "Relationships",
    prompt: "Fetch book 3 with its title, review count, and review authors.",
    starter: `query {
  book(id: "3") {
    
    reviews {
      
    }
  }
}`,
    hint: 'Use book(id: "3") and select reviewCount plus reviews { reviewer }.',
    answer: `query { book(id: "3") { title reviewCount reviews { reviewer } } }`,
    check: (r) =>
      typeof r?.data?.book?.title === "string" &&
      typeof r.data.book.reviewCount === "number" &&
      Array.isArray(r.data.book.reviews),
  },
  {
    title: "Fetch the next cursor page",
    skill: "Cursor pagination",
    level: "INTERVIEW",
    prompt: "Return two books and report the cursor needed to continue.",
    starter: `query BrowsePage {\n  bookConnection(first: 2) {\n    edges { node { title } }\n    pageInfo {  }\n  }\n}`,
    hint: "Select hasNextPage and endCursor from pageInfo.",
    answer: `query BrowsePage { bookConnection(first: 2) { edges { cursor node { id title } } pageInfo { hasNextPage endCursor } } }`,
    check: (r) =>
      r?.data?.bookConnection?.edges?.length === 2 &&
      typeof r.data.bookConnection.pageInfo.endCursor === "string" &&
      r.data.bookConnection.pageInfo.hasNextPage === true,
  },
  {
    title: "Recognize an execution error",
    skill: "Errors + nullability",
    level: "INTERVIEW",
    prompt:
      "Run a valid mutation with an invalid rating and inspect both data and errors.",
    starter: `mutation {\n  updateBookRating(id: "1", rating: 9) {\n    id\n    rating\n  }\n}`,
    hint: "This operation is syntactically valid. The resolver rejects ratings above 5, so check errors and the field under data.",
    answer: `mutation { updateBookRating(id: "1", rating: 9) { id rating } }`,
    check: (r) =>
      Array.isArray(r?.errors) &&
      r.errors.length > 0 &&
      r.errors[0].path?.[0] === "updateBookRating",
  },
  {
    title: "Use resolver traces to find repeated work",
    skill: "N+1 performance",
    level: "INTERVIEW",
    prompt:
      "Fetch authors and their books, then inspect the resolver trace for repeated relationship resolvers.",
    starter: `query AuthorBooks {\n  authors {\n    name\n    books { title }\n  }\n}`,
    hint: "A nested field may run once for every parent object. Inspect extensions.trace and count Author(...).books steps.",
    answer: `query AuthorBooks { authors { name books { title } } }`,
    check: (r) =>
      (r?.extensions?.trace || []).filter((step) =>
        step.resolver.endsWith(".books"),
      ).length >= 2,
  },
  {
    title: "Explain a subscription trade-off",
    skill: "Real-time system design",
    level: "INTERVIEW",
    prompt:
      "Read a review snapshot, then explain whether polling or a long-lived subscription best fits the update pattern.",
    starter: `query ReviewSnapshot { reviews { bookTitle reviewer rating } }`,
    hint: "Use the result as current state. Consider event frequency, acceptable delay, reconnect behavior, and server connection cost.",
    answer: `query ReviewSnapshot { reviews { bookTitle reviewer rating createdAt } }`,
    check: (r) => Array.isArray(r?.data?.reviews),
  },
];

const chapterTryouts = [
  {
    task: "Prove that the response follows the query shape.",
    presets: [
      ["First request", `{ hello }`, ""],
      ["Two root fields", `{ hello\n  libraryStats { totalBooks }\n}`, ""],
      ["Cause a field error", `{ greeting }`, ""],
    ],
  },
  {
    task: "Explore the schema contract by selecting valid and invalid Book fields.",
    presets: [
      ["Book identity", `{ books(limit: 2) { id title } }`, ""],
      ["Add optional fields", `{ books(limit: 2) { title genre pages } }`, ""],
      ["Invalid field", `{ books { title price } }`, ""],
    ],
  },
  {
    task: "Change the selection set and watch the JSON shape change.",
    presets: [
      ["Titles only", `{ books(limit: 3) { title } }`, ""],
      ["Reading cards", `{ books(limit: 3) { title author read rating } }`, ""],
      ["No child selection", `{ books }`, ""],
    ],
  },
  {
    task: "Follow one relationship at a time and inspect which nested resolvers run.",
    presets: [
      ["Viewer list", `{ viewer { name readingList { title } } }`, ""],
      [
        "Book author",
        `{ book(id: "3") { title authorProfile { name country } } }`,
        "",
      ],
      [
        "Book reviews",
        `{ book(id: "3") { title reviews { reviewer rating } } }`,
        "",
      ],
    ],
  },
  {
    task: "Change an argument and learn how nullable lookup results behave.",
    presets: [
      ["Find book 2", `{ book(id: "2") { title genre } }`, ""],
      ["Missing book", `{ book(id: "999") { title } }`, ""],
      ["Missing argument", `{ book { title } }`, ""],
    ],
  },
  {
    task: "Keep the operation fixed while changing the JSON variable value.",
    presets: [
      [
        "Search fantasy",
        `query Search($term: String!) { searchBooks(text: $term) { title genre } }`,
        `{"term":"fantasy"}`,
      ],
      [
        "Search time",
        `query Search($term: String!) { searchBooks(text: $term) { title genre } }`,
        `{"term":"time"}`,
      ],
      [
        "Wrong variable type",
        `query Search($term: String!) { searchBooks(text: $term) { title } }`,
        `{"term":42}`,
      ],
    ],
  },
  {
    task: "Run a mutation, then query the changed record in the same sandbox.",
    presets: [
      [
        "Add a book",
        `mutation { addBook(title:"The Dispossessed", author:"Ursula K. Le Guin", genre:"Science fiction") { id title read } }`,
        "",
      ],
      [
        "Mark book read",
        `mutation { markBookRead(id:"2", read:true) { id title read } }`,
        "",
      ],
      ["Read current state", `{ books(sortBy:"title") { id title read } }`, ""],
    ],
  },
  {
    task: "Read validation feedback and repair the operation yourself.",
    presets: [
      ["Unknown field", `{ book(id:"1") { titel } }`, ""],
      ["Wrong argument", `{ book(bookId:"1") { title } }`, ""],
      ["Valid repair", `{ book(id:"1") { title } }`, ""],
    ],
  },
  {
    task: "Compare two filtered collections in one request.",
    presets: [
      [
        "Aliases",
        `{ fantasy: books(genre:"Fantasy") { title }\n  unread: books(read:false) { title } }`,
        "",
      ],
      [
        "Rating filter",
        `{ books(minRating:4.8, sortBy:"rating") { title rating } }`,
        "",
      ],
      ["Limit result", `{ books(sortBy:"year", limit:2) { title year } }`, ""],
    ],
  },
  {
    task: "Edit one fragment and see every place that spreads it update.",
    presets: [
      [
        "Book card",
        `query { books(limit:2) { ...Card } }\nfragment Card on Book { title author genre }`,
        "",
      ],
      [
        "Two uses",
        `query { books(limit:2) { ...Card } viewer { readingList { ...Card } } }\nfragment Card on Book { title read }`,
        "",
      ],
      [
        "Wrong type",
        `query { viewer { ...Card } }\nfragment Card on Book { title }`,
        "",
      ],
    ],
  },
  {
    task: "Create a related record and verify it through a nested query.",
    presets: [
      [
        "Add review",
        `mutation { addReview(bookId:"3", reviewer:"Learner", rating:5, comment:"Worth rereading") { id bookTitle rating } }`,
        "",
      ],
      [
        "Inspect reviews",
        `{ book(id:"3") { title reviewCount reviews { reviewer rating comment } } }`,
        "",
      ],
      [
        "Invalid rating",
        `mutation { addReview(bookId:"3", reviewer:"Learner", rating:8, comment:"Too high") { id } }`,
        "",
      ],
    ],
  },
];

const finalGraphQLLesson = lessons.pop();
const finalGraphQLDetails = chapterDetails.pop();
const finalGraphQLBreakdown = chapterBreakdowns.pop();
lessons.push(...window.graphqlAdvancedCurriculum.lessons, finalGraphQLLesson);
chapterDetails.push(
  ...window.graphqlAdvancedCurriculum.details,
  finalGraphQLDetails,
);
chapterBreakdowns.push(
  ...window.graphqlAdvancedCurriculum.breakdowns,
  finalGraphQLBreakdown,
);
chapterTryouts.push(...window.graphqlAdvancedCurriculum.tryouts);
finalGraphQLLesson.kicker = `CHAPTER ${String(lessons.length).padStart(2, "0")} · FINAL LAB · PRACTICE + PLAYGROUND`;
lessons.unshift({
  title: "What GraphQL is—and what it isn’t",
  kicker: "CHAPTER 00 · START HERE",
  time: "10 min read",
  body: "GraphQL is a language for describing the data an application needs and a server-side execution system for answering that request. The server publishes a schema: a typed contract describing available objects, fields, arguments, and operations. A client sends an operation selecting fields. The server validates that selection, calls resolver functions to obtain values, and returns JSON following the requested shape. GraphQL is an API layer, not a database and not a frontend framework. A resolver can read an in-memory example, a database, or another service.",
  extra: "Imagine a book app. A small book card may need only a title and cover; a detail screen may also need the author, reviews, and reading status. Both screens can use the same GraphQL API and request different fields. In this course, the browser playground sends operations to a small Node.js server. You will follow the request from the client, through the schema and resolvers, to its JSON response, then make the API answer new questions.",
  query: `{
  hello
}`,
  variables: "",
  explainTitle: "A complete request in miniature",
  explain: "The client asks for hello, the schema confirms that field exists, its resolver supplies a value, and the server returns that value as JSON.",
});
chapterDetails.unshift({
  lead: "GraphQL connects a client’s data request to server code that can answer it. The client chooses fields from a typed schema; the server validates the request, resolves those fields, and returns JSON in the requested shape.",
  why: "The small greeting example introduces the full lifecycle before we ask for book objects: an operation is sent, checked against the schema, executed by a resolver, and returned as data. The response has the field name the client selected.",
  query: `{
  hello
}`,
  client: `const result = await request({ query: "{ hello }" });
console.log(result.data.hello);`,
  resolver: `hello: () => "Hello from your GraphQL server! 👋",`,
  backend: "The Node.js server exposes a /graphql endpoint. It receives the operation, checks the Query type in the schema, calls the hello resolver, and sends the result back as JSON. This resolver returns a fixed string, so the example needs no database.",
  data: "The request does not go directly from the browser to a database. The browser sends an operation to the GraphQL endpoint. The server checks field names, argument types, and required values against the schema; resolver functions then provide the requested values. Those resolvers may read this course’s in-memory book list, call a database, or use another service. GraphQL describes the API contract and execution path; the server code decides how data is obtained and what access rules apply.",
});
chapterBreakdowns.unshift({
  steps: [
    ["The outer braces", "Mark this operation as a query, the read path for asking the API for data."],
    ["hello", "Names one field the Query type says the server can answer."],
    ["The resolver", "Supplies the field’s value; here it returns a fixed greeting."],
    ["The JSON response", "Places the returned value under data. The response follows the field path requested by the client."],
  ],
  response: `{
  "data": {
    "hello": "Hello from your GraphQL server! 👋"
  }
}`,
});
chapterTryouts.unshift({
  task: "Run a read request, ask for two supported fields, then request an unknown field and use the validation message to repair it.",
  presets: [
    ["First request", `{ hello }`, ""],
    ["Two root fields", `{ hello\n  libraryStats { totalBooks }\n}`, ""],
    ["Cause a field error", `{ greeting }`, ""],
  ],
});
lessons[1].kicker = "CHAPTER 01 · CLIENT + SERVER";
lessons[1].time = "4 min read";
lessons[1].title = "See how a GraphQL request travels";
const graphqlCourseVersion = 2;
let active = 0;
const nav = document.querySelector("#lessonNav");
const lessonStages = [
  { title: "Start here", start: 0, end: 1 },
  { title: "Foundations", start: 1, end: 4 },
  { title: "Applied practice", start: 4, end: 12 },
  { title: "Interview & operations", start: 12, end: lessons.length - 1 },
  {
    title: "Final integration",
    start: lessons.length - 1,
    end: lessons.length,
  },
];
const stageGroups = lessonStages.map((stage) => {
  const group = document.createElement("details");
  group.className = "lesson-stage";
  group.name = "graphql-course-stage";
  group.dataset.start = String(stage.start);
  group.dataset.end = String(stage.end);
  const summary = document.createElement("summary");
  const stageTitle = document.createElement("span");
  stageTitle.className = "stage-title";
  stageTitle.textContent = stage.title;
  const stageCount = document.createElement("span");
  stageCount.className = "stage-count";
  const lessonCount = stage.end - stage.start;
  stageCount.textContent = `${lessonCount} ${lessonCount === 1 ? "lesson" : "lessons"}`;
  summary.append(stageTitle, stageCount);
  group.append(summary);
  nav.append(group);
  return group;
});
lessons.forEach((lesson, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "nav-item";
  b.innerHTML = `<span class="nav-num">${String(i).padStart(2, "0")}</span><span>${lesson.title}</span>`;
  b.addEventListener("click", () => {
    selectLesson(i);
    document.querySelector(".lesson-card").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
  const stage = lessonStages.findIndex(
    ({ start, end }) => i >= start && i < end,
  );
  stageGroups[stage].append(b);
});
function highlightGraphQL(source) {
  const tokenPattern =
    /#\s*[^\n]*|"(?:\\.|[^"\\])*"|\$[A-Za-z_]\w*|\b(?:query|mutation)\b|\b[A-Z][A-Za-z0-9_]*\b|\b[a-z_][A-Za-z0-9_]*\b|[{}()[\]!:,]/g;
  let html = "",
    cursor = 0;
  for (const match of source.matchAll(tokenPattern)) {
    const token = match[0],
      index = match.index;
    html += escapeCodeHTML(source.slice(cursor, index));
    let kind = "gql-punct";
    if (token.startsWith("#")) kind = "comment";
    else if (token.startsWith('"')) kind = "string";
    else if (token.startsWith("$")) kind = "variable";
    else if (
      /^(query|mutation|type|input|enum|interface|scalar|union|implements|extend)$/.test(
        token,
      )
    )
      kind = "keyword";
    else if (/^[A-Z]/.test(token)) kind = "type";
    else if (/^[a-z_]/.test(token)) kind = "field";
    html += `<span class="tok-${kind}">${escapeCodeHTML(token)}</span>`;
    cursor = index + token.length;
  }
  return html + escapeCodeHTML(source.slice(cursor));
}
function highlightJSON(source) {
  const tokenPattern =
    /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?|[{}\[\],:]/g;
  let html = "",
    cursor = 0;
  for (const match of source.matchAll(tokenPattern)) {
    const token = match[0],
      index = match.index;
    html += escapeCodeHTML(source.slice(cursor, index));
    const kind = /^[{}\[\],:]$/.test(token)
      ? "json-punct"
      : /^"/.test(token)
        ? /:\s*$/.test(
            source.slice(index + token.length, index + token.length + 1),
          )
          ? "json-key"
          : "string"
        : /^-?\d/.test(token)
          ? "number"
          : "literal";
    html += `<span class="tok-${kind}">${escapeCodeHTML(token)}</span>`;
    cursor = index + token.length;
  }
  return html + escapeCodeHTML(source.slice(cursor));
}
function syncQueryHighlight() {
  const editor = document.querySelector("#queryInput"),
    highlighted = document.querySelector("#queryHighlight");
  if (!editor || !highlighted) return;
  highlighted.innerHTML = `<code>${highlightGraphQL(editor.value || " ")}</code>`;
  highlighted.scrollTop = editor.scrollTop;
  highlighted.scrollLeft = editor.scrollLeft;
}
function renderGraphQLStartHere() {
  return `<section class="graphql-start-here" aria-labelledby="graphqlStartTitle">
    <div class="graphql-start-heading"><img src="/brands/graphql-hexagraph.svg" width="42" height="42" alt="GraphQL logo" /><div><span>THE BIG PICTURE</span><h2 id="graphqlStartTitle">How a GraphQL request becomes an answer</h2></div></div>
    <div class="graphql-request-flow" role="img" aria-label="A client sends an operation. The server validates it against the schema, runs resolvers to fetch data, and returns selected fields as JSON.">
      <article><span>01</span><b>Client operation</b><p>The app names the fields and inputs it needs.</p></article><i aria-hidden="true">→</i>
      <article><span>02</span><b>Schema check</b><p>The server checks field names, types, and required values.</p></article><i aria-hidden="true">→</i>
      <article><span>03</span><b>Resolvers</b><p>Server functions obtain each requested value.</p></article><i aria-hidden="true">→</i>
      <article><span>04</span><b>JSON response</b><p>The result follows the fields the client selected.</p></article>
    </div>
    <div class="graphql-start-definitions">
      <article><span class="graphql-definition-mark schema-mark" aria-hidden="true">&#123; &#125;</span><div><b>Schema</b><p>The typed contract: which fields and operations exist, what arguments they accept, and what values they return.</p></div></article>
      <article><span class="graphql-definition-mark resolver-mark" aria-hidden="true">ƒ</span><div><b>Resolver</b><p>A server function that supplies a field’s value, often by calling a database or another service.</p></div></article>
      <article><span class="graphql-definition-mark source-mark" aria-hidden="true">↔</span><div><b>Data source</b><p>The place the resolver reads or changes data. GraphQL does not require a particular database.</p></div></article>
    </div>
    <p class="graphql-start-note"><b>Keep the boundary clear:</b> GraphQL is not the database and does not fetch data by magic. The schema describes the API; backend resolver code performs the work.</p>
  </section>`;
}
function renderChapter(i) {
  const d = chapterDetails[i],
    chapter = String(i).padStart(2, "0");
  const breakdown = chapterBreakdowns[i];
  const isFinal = i === lessons.length - 1;
  const labButton = isFinal
    ? `<button class="jump-final-lab">Open the complete final lab <span>↓</span></button>`
    : `<button class="jump-chapter-tryout">Try this chapter yourself <span>↓</span></button>`;
  const backendCode =
    i === 2 ? highlightGraphQL(d.resolver) : highlightJavaScript(d.resolver);
  const helperCode = `async function request({ query, variables }) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}`;
  const backendLabel =
    i === 2
      ? "SCHEMA · GRAPHQL SDL"
      : i === 1
        ? "REQUEST EXECUTION · SERVER.JS"
        : i === 8
          ? "NODE ENDPOINT · SERVER.JS"
          : isFinal
            ? "SIMPLIFIED RESOLVER FLOW"
            : "RESOLVER · SERVER.JS";
  const insightHTML = `<div class="chapter-insights"><article class="insight-card"><div class="eyebrow">READ THE EXAMPLE</div><h3>What each part means</h3><ol>${breakdown.steps.map(([term, explanation]) => `<li><code>${escapeCodeHTML(term)}</code><span>${escapeCodeHTML(explanation)}</span></li>`).join("")}</ol></article><article class="insight-card"><div class="eyebrow">SAMPLE RESULT</div><h3>What the server sends back</h3><pre class="chapter-code json-code"><code>${highlightJSON(breakdown.response)}</code></pre><p class="response-explain">GraphQL returns selected fields under <code>data</code>. Validation problems appear under <code>errors</code>. This sample uses the library’s starting data; a live response may differ after a mutation.</p></article></div>`;
  const tryout = isFinal ? "" : renderChapterTryout(i);
  const serverPanel = `<article class="chapter-panel"><div class="chapter-panel-title"><span class="chapter-icon server-icon">02</span><div><h3>What happens on the server?</h3><p>${d.backend}</p></div></div><div class="snippet-label"><span>${backendLabel}</span><span>BACKEND</span></div><pre class="chapter-code"><code>${backendCode}</code></pre></article>`;
  const clientPanel = `<div class="client-panel"><div class="client-copy"><div class="eyebrow">FROM THE APP</div><h3>How a client sends it</h3><p>A browser or mobile app sends the operation to the GraphQL endpoint over HTTP. It receives JSON, then uses the data to update the screen.</p><div class="client-note"><b>${isFinal ? "Use the complete lab" : "Use this chapter’s tryout"}</b><span>${isFinal ? "The final lab collects every example and challenge in one place." : "Experiment with only the concept taught in this chapter before moving forward."}</span></div><details class="client-helper"><summary>Show the fetch helper used by the examples</summary><pre class="chapter-code"><code>${highlightJavaScript(helperCode)}</code></pre></details></div><div class="client-snippet"><div class="snippet-label"><span>JAVASCRIPT CLIENT EXAMPLE</span><span>CODE</span></div><pre class="chapter-code"><code>${highlightJavaScript(d.client)}</code></pre></div></div>`;
  const dataPath = `<div class="data-path"><div class="eyebrow">HOW THE DATA GETS THERE</div><h3>GraphQL describes the request; resolvers fetch the values.</h3><p>${d.data}</p><div class="data-flow"><span>Query</span><b>→</b><span>Schema check</span><b>→</b><span>Resolver</span><b>→</b><span>Data source</span><b>→</b><span>JSON response</span></div></div>`;
  const stage =
    i === 0
      ? "START HERE"
      : i < 4
        ? "FOUNDATIONS"
        : i < 12
        ? "APPLIED PRACTICE"
        : isFinal
          ? "FINAL INTEGRATION"
          : "INTERVIEW & OPERATIONS";
  const startHere = i === 0 ? renderGraphQLStartHere() : "";
  const deepDiveOpen = i < 4 ? " open" : "";
  return `<div class="chapter-banner"><div><div class="eyebrow">CHAPTER ${chapter} · ${stage} · LEARN BY EXAMPLE</div><p>${d.lead}</p></div><span class="chapter-mark">${chapter}</span></div>${startHere}<div class="chapter-grid chapter-grid-focused"><article class="chapter-panel"><div class="chapter-panel-title"><span class="chapter-icon">01</span><div><h3>Learning example</h3><p>${d.why}</p></div></div><div class="snippet-label"><span>GRAPHQL OPERATION</span><span>EXAMPLE</span></div><pre class="chapter-code gql-code"><code>${highlightGraphQL(d.query)}</code></pre><div class="chapter-action">${labButton}</div></article></div>${tryout}<details class="chapter-deep-dive"${deepDiveOpen}><summary><span>Explore behind the scenes</span><small>Server code · sample response · client request</small></summary><div class="chapter-deep-dive-content"><div class="chapter-grid">${serverPanel}</div>${insightHTML}${clientPanel}${dataPath}</div></details>`;
}

function renderChapterTryout(i) {
  const tryout = chapterTryouts[i];
  const presetButtons = tryout.presets
    .map(
      ([label], index) =>
        `<button class="tryout-preset ${index === 0 ? "active" : ""}" data-preset="${index}">${escapeCodeHTML(label)}</button>`,
    )
    .join("");
  return `<section class="chapter-tryout" id="chapterTryout"><div class="tryout-head"><div><div class="eyebrow">CHAPTER ${String(i).padStart(2, "0")} · TRY IT YOURSELF</div><h2>Change it. Run it. Read the result.</h2><p>${escapeCodeHTML(tryout.task)} You can freely edit the operation before running it.</p></div><span class="tryout-status" id="chapterTryoutStatus">READY</span></div><div class="tryout-presets">${presetButtons}</div><div class="tryout-grid"><div class="tryout-editor"><label for="chapterQuery">GRAPHQL OPERATION</label><textarea id="chapterQuery" spellcheck="false">${escapeCodeHTML(tryout.presets[0][1])}</textarea><label for="chapterVariables">VARIABLES · JSON</label><textarea id="chapterVariables" class="tryout-vars" spellcheck="false">${escapeCodeHTML(tryout.presets[0][2])}</textarea><button id="runChapterTryout" class="run-btn">Run experiment <span>▶</span></button></div><div class="tryout-result"><div class="tryout-result-head"><span>LIVE RESPONSE</span><span id="chapterTryoutMeta">Waiting for your request</span></div><pre id="chapterTryoutOutput"><span class="tryout-empty">Your result and errors will appear here.</span></pre><div id="chapterTryoutCoach" class="tryout-coach"><b>Experiment freely</b><p>Errors are useful here. Read the message, edit the operation, and run it again.</p></div></div></div></section>`;
}
function selectLesson(i) {
  active = i;
  const progress = document.querySelector("#lessonProgress");
  const progressLabel = document.querySelector("#lessonProgressLabel");
  if (progress) progress.value = i + 1;
  if (progressLabel)
    progressLabel.textContent = `Chapter ${String(i).padStart(2, "0")} of ${lessons.length}`;
  window.activePracticeIndex = null;
  window.lastRunPracticeIndex = null;
  window.lastGraphQLResult = null;
  const l = lessons[i];
  try {
    localStorage.setItem(
      "graphql-course-state",
      JSON.stringify({ active: i, query: l.query, variables: l.variables, curriculumVersion: graphqlCourseVersion }),
    );
  } catch {}
  const journeyLevel =
    i === 0
      ? "START HERE"
      : i < 4
        ? "FOUNDATIONS"
        : i < 12
        ? "APPLIED PRACTICE"
        : i < lessons.length - 1
          ? "INTERVIEW & OPERATIONS"
          : "FINAL INTEGRATION";
  document.querySelectorAll(".nav-item").forEach((b, j) => {
    b.classList.toggle("active", j === i);
    if (j === i) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
  });
  stageGroups.forEach((group, index) => {
    group.open = i >= lessonStages[index].start && i < lessonStages[index].end;
  });
  document.querySelector("#lessonKicker").textContent =
    `${l.kicker.startsWith("ADVANCED LESSON ·")
      ? l.kicker.replace("ADVANCED LESSON ·", `CHAPTER ${String(i).padStart(2, "0")} ·`)
      : l.kicker.replace(/^LESSON /, "CHAPTER ")} · ${journeyLevel}`;
  document.querySelector("#lessonTitle").textContent = l.title;
  document.querySelector("#lessonTime").textContent = l.time;
  document.querySelector("#lessonBody").textContent = l.body;
  document.querySelector("#lessonExtra").innerHTML =
    `<div class="lesson-callout"><span>✦</span>${l.extra}</div>`;
  document.querySelector("#chapterDetail").innerHTML = renderChapter(i);
  const isFinal = i === lessons.length - 1;
  document.querySelector("#finalLab").hidden = !isFinal;
  document.querySelector("#queryInput").value = l.query;
  syncQueryHighlight();
  document.querySelector("#variablesInput").value = l.variables;
  document.querySelector("#variablesInput").hidden = !l.variables;
  document.querySelector("#varsToggle").innerHTML = l.variables
    ? "Hide <span>⌃</span>"
    : "Show <span>⌄</span>";
  document.querySelector("#explainTitle").textContent = l.explainTitle;
  document.querySelector("#explainText").textContent = l.explain;
  document.querySelector("#responseOutput").innerHTML =
    `<div class="empty-response"><span class="braces">{ }</span><b>Your response will appear here</b><span>Run a query to see what the API sends back.</span></div>`;
  document.querySelector("#requestPipeline").hidden = true;
  if (isFinal) {
    document
      .querySelector(".jump-final-lab")
      ?.addEventListener("click", () =>
        document
          .querySelector("#playground")
          .scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  } else {
    bindChapterTryout(i);
    document
      .querySelector(".jump-chapter-tryout")
      ?.addEventListener("click", () =>
        document
          .querySelector("#chapterTryout")
          .scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  }
}

window.addEventListener("learning:progress-restored", (event) => {
  const { key, value } = event.detail || {};
  if (
    key !== "graphql-course-state" ||
    !value ||
    !Number.isInteger(Number(value.active))
  )
    return;
  const savedActive = Number(value.active) + (Number(value.curriculumVersion) < graphqlCourseVersion ? 1 : 0);
  const lessonIndex = Math.max(
    0,
    Math.min(lessons.length - 1, savedActive),
  );
  selectLesson(lessonIndex);
  const query = document.querySelector("#queryInput");
  const variables = document.querySelector("#variablesInput");
  if (typeof value.query === "string") query.value = value.query;
  if (typeof value.variables === "string") variables.value = value.variables;
  syncQueryHighlight();
});

function bindChapterTryout(chapterIndex) {
  const tryout = chapterTryouts[chapterIndex];
  const queryInput = document.querySelector("#chapterQuery");
  const variablesInput = document.querySelector("#chapterVariables");
  const output = document.querySelector("#chapterTryoutOutput");
  const meta = document.querySelector("#chapterTryoutMeta");
  const status = document.querySelector("#chapterTryoutStatus");
  const coach = document.querySelector("#chapterTryoutCoach");
  document.querySelectorAll(".tryout-preset").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = tryout.presets[Number(button.dataset.preset)];
      document
        .querySelectorAll(".tryout-preset")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      queryInput.value = preset[1];
      variablesInput.value = preset[2];
      output.innerHTML =
        '<span class="tryout-empty">Edit the example or run it as provided.</span>';
      meta.textContent = "Example loaded";
      status.textContent = "READY";
      status.className = "tryout-status";
    });
  });
  document
    .querySelector("#runChapterTryout")
    .addEventListener("click", async () => {
      const button = document.querySelector("#runChapterTryout");
      button.disabled = true;
      button.innerHTML = "Running… <span>◌</span>";
      status.textContent = "RUNNING";
      meta.textContent = "Validating against the schema…";
      try {
        const variables = variablesInput.value.trim()
          ? JSON.parse(variablesInput.value)
          : {};
        const startedAt = performance.now();
        const response = await fetch("/graphql", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: queryInput.value, variables }),
        });
        const result = await response.json();
        output.innerHTML = highlightJSON(JSON.stringify(result, null, 2));
        const hasErrors = Boolean(result.errors?.length);
        status.textContent = hasErrors ? "LEARN FROM THE ERROR" : "SUCCESS";
        status.className = `tryout-status ${hasErrors ? "has-error" : "is-success"}`;
        meta.textContent = `${Math.round(performance.now() - startedAt)} ms · ${result.extensions?.trace?.length || 0} resolver steps`;
        coach.innerHTML = hasErrors
          ? `<b>What the server caught</b><p>${escapeCodeHTML(result.errors[0].message)} Edit the operation and try again.</p>`
          : `<b>What changed</b><p>The response mirrors your current selection. Try removing a field, changing an argument, or loading the next experiment.</p>`;
      } catch (error) {
        status.textContent = "INPUT ERROR";
        status.className = "tryout-status has-error";
        output.textContent = JSON.stringify(
          { errors: [{ message: error.message }] },
          null,
          2,
        );
        meta.textContent = "Fix the variables JSON and retry";
      } finally {
        button.disabled = false;
        button.innerHTML = "Run experiment <span>▶</span>";
      }
    });
}
let initialLessonIndex = 0;
let initialGraphQLState = null;
try {
  initialGraphQLState = JSON.parse(localStorage.getItem("graphql-course-state") || "null");
  if (Number.isInteger(Number(initialGraphQLState?.active))) {
    initialLessonIndex = Math.max(
      0,
      Math.min(
        lessons.length - 1,
        Number(initialGraphQLState.active) +
          (Number(initialGraphQLState.curriculumVersion) < graphqlCourseVersion ? 1 : 0),
      ),
    );
  }
} catch {}
selectLesson(initialLessonIndex);
if (typeof initialGraphQLState?.query === "string") {
  document.querySelector("#queryInput").value = initialGraphQLState.query;
  syncQueryHighlight();
}
if (typeof initialGraphQLState?.variables === "string") {
  document.querySelector("#variablesInput").value = initialGraphQLState.variables;
}
const practiceList = document.querySelector("#practiceList");
const completedPractice = new Set(
  JSON.parse(localStorage.getItem("graphql-practice-progress") || "[]"),
);
function updatePracticeProgress() {
  document.querySelector("#practiceProgress").textContent =
    `${completedPractice.size} / ${practices.length} complete`;
}
window.addEventListener("learning:progress-restored", (event) => {
  const { key, value } = event.detail || {};
  if (key === "graphql-practice-progress" && Array.isArray(value)) {
    completedPractice.clear();
    value.forEach((index) => completedPractice.add(Number(index)));
    practices.forEach((_, index) => {
      const card = practiceList.children[index];
      card?.classList.toggle("complete", completedPractice.has(index));
    });
    updatePracticeProgress();
  }
});
updatePracticeProgress();
practices.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = `practice-card ${completedPractice.has(i) ? "complete" : ""}`;
  card.innerHTML = `<div class="practice-card-top"><span class="practice-index">CHALLENGE ${String(i + 1).padStart(2, "0")}</span><span class="practice-level">${p.level || (i < 6 ? "FOUNDATION" : "APPLIED")}</span><span class="practice-skill">${p.skill}</span></div><h3>${p.title}</h3><p class="practice-prompt">${p.prompt}</p><div class="practice-steps"><span><b>1</b><span>Edit the starter in the playground.</span></span><span><b>2</b><span>Run your query and inspect the response.</span></span><span><b>3</b><span>Return here and check your result.</span></span></div><div class="practice-actions"><button class="open-challenge">Open starter in playground <span>↑</span></button><button class="check-answer">Check my result</button></div><p class="check-result" aria-live="polite">Start with step 1. The playground opens with a partial query you can finish.</p><div class="practice-support"><details class="hint"><summary>Need a hint?</summary><p>${p.hint}</p></details><details class="answer"><summary>Show one possible answer</summary><pre></pre><button class="load-answer">Load answer into playground</button></details></div>`;
  card.querySelector("pre").textContent = p.answer;
  card.querySelector(".open-challenge").onclick = () => {
    window.activePracticeIndex = i;
    window.lastGraphQLResult = null;
    window.lastRunPracticeIndex = null;
    q.value = p.starter;
    vars.value = p.variables || "";
    vars.hidden = !p.variables;
    document.querySelector("#varsToggle").innerHTML = p.variables
      ? "Hide <span>⌃</span>"
      : "Show <span>⌄</span>";
    syncQueryHighlight();
    document.querySelector("#responseOutput").innerHTML =
      `<div class="empty-response"><span class="braces">{ }</span><b>Challenge ${String(i + 1).padStart(2, "0")} is ready</b><span>Finish the starter query and press Run query.</span></div>`;
    document.querySelector("#responseMeta").textContent = "CHALLENGE READY";
    card.querySelector(".check-result").textContent =
      "Starter loaded. Finish it in the playground, run it, then come back to check.";
    card.querySelector(".check-result").className = "check-result";
    document
      .querySelector("#playground")
      .scrollIntoView({ behavior: "smooth", block: "start" });
    q.focus();
  };
  card.querySelector(".load-answer").onclick = () => {
    window.activePracticeIndex = i;
    window.lastGraphQLResult = null;
    window.lastRunPracticeIndex = null;
    q.value = p.answer;
    vars.value = p.variables || "";
    vars.hidden = !p.variables;
    document.querySelector("#varsToggle").innerHTML = p.variables
      ? "Hide <span>⌃</span>"
      : "Show <span>⌄</span>";
    document
      .querySelector("#playground")
      .scrollIntoView({ behavior: "smooth", block: "start" });
    q.focus();
  };
  card.querySelector(".check-answer").onclick = () => {
    const result = card.querySelector(".check-result");
    if (!window.lastGraphQLResult || window.lastRunPracticeIndex !== i) {
      result.textContent =
        "This challenge has no recent result yet. Open its starter, finish the query in the playground, and run it first.";
      result.className = "check-result";
      return;
    }
    const ok = p.check(window.lastGraphQLResult);
    result.textContent = ok
      ? "Correct — your response matches the challenge."
      : "Not quite yet. Read the response above, adjust your fields or arguments, run it again, then check here.";
    result.className = "check-result " + (ok ? "correct" : "try-again");
    if (ok) {
      completedPractice.add(i);
      localStorage.setItem(
        "graphql-practice-progress",
        JSON.stringify([...completedPractice]),
      );
      card.classList.add("complete");
      updatePracticeProgress();
    }
  };
  practiceList.append(card);
});
const graphqlInterviewQuestions = [
  {
    prompt: "When should a field belong to a mutation instead of a query?",
    options: [
      "When resolving it should change server state",
      "Whenever it returns an object",
      "Whenever the client uses variables",
    ],
    answer: 0,
    explanation:
      "Queries are intended for reading. In GraphQL, top-level mutation fields are the place for side effects; nested fields should remain side-effect-free.",
  },
  {
    prompt: "What does `ID!` tell you about an argument?",
    options: [
      "It must be an integer",
      "It is a required ID value and cannot be null",
      "It is optional but unique",
    ],
    answer: 1,
    explanation:
      "The exclamation mark makes the type non-null. ID is an identifier type; it is not restricted to integer representation.",
  },
  {
    prompt:
      "A query returns `data` and `errors`. What is the right interpretation?",
    options: [
      "The entire operation always failed",
      "Some fields may have resolved while another field failed",
      "The response is invalid JSON",
    ],
    answer: 1,
    explanation:
      "Execution can return partial data together with field errors. Clients should inspect both parts of the response.",
  },
  {
    prompt:
      "A field name is invalid according to the schema. What usually happens?",
    options: [
      "Validation rejects the operation before its data resolvers run",
      "The server guesses a similarly named resolver",
      "The database returns an empty list",
    ],
    answer: 0,
    explanation:
      "The schema validates the operation before execution. A misspelled field is a request validation problem, not a database result.",
  },
  {
    prompt:
      "Where should authorization for a sensitive object lookup be enforced?",
    options: [
      "Only by hiding the field in the client UI",
      "In trusted server-side business or resolver logic",
      "By making the GraphQL type name hard to guess",
    ],
    answer: 1,
    explanation:
      "Clients are not a security boundary. The server must check identity and permissions before returning protected data or performing a write.",
  },
  {
    prompt:
      "Why use an alias when asking for the same field with different arguments?",
    options: [
      "Aliases give each result a distinct response key",
      "Aliases bypass field validation",
      "Aliases make the request a mutation",
    ],
    answer: 0,
    explanation:
      "An alias renames the response key, so both field calls can coexist in one selection set with their own arguments.",
  },
  {
    prompt:
      "A nested list resolver makes one database request for every item. What issue might appear?",
    options: [
      "N+1 request pattern; batching or dataloader-style caching can reduce repeated fetches",
      "The schema cannot return lists",
      "The client must split every field into a separate HTTP request",
    ],
    answer: 0,
    explanation:
      "Nested resolution can trigger repeated backend reads. Batch related IDs or cache per-request lookups when measuring shows this pattern.",
  },
  {
    prompt:
      "When designing a list API for results that can grow large, what should you plan for?",
    options: [
      "Unboundedly return every record",
      "Add a consistent pagination model and a sensible page limit",
      "Replace GraphQL with a database connection string",
    ],
    answer: 1,
    explanation:
      "Pagination bounds work and lets clients traverse large collections. Cursor pagination is a common option for stable continuation, but the GraphQL spec does not require one pagination convention.",
  },
  {
    prompt: "What should a client use to request the next cursor page?",
    options: [
      "The previous page's endCursor, with the same stable ordering",
      "The last array index guessed from the response length",
      "A new random cursor on every request",
    ],
    answer: 0,
    explanation:
      "A cursor is a continuation token. Stable ordering and a bounded page size help avoid duplicates or skipped items as a collection changes.",
  },
  {
    prompt: "Why can a GraphQL response contain both data and errors?",
    options: [
      "Resolvers can fail after validation while other nullable fields still resolve",
      "GraphQL requires every error response to discard all data",
      "The client must merge two separate HTTP responses",
    ],
    answer: 0,
    explanation:
      "Execution errors are associated with response paths. Nullability determines how far a failed value propagates, while other fields may still succeed.",
  },
  {
    prompt:
      "What is a common defense against deeply nested or repeated expensive operations?",
    options: [
      "Disable every object type",
      "Use pagination plus depth or complexity limits and rate controls",
      "Trust that clients will request only small responses",
    ],
    answer: 1,
    explanation:
      "GraphQL APIs need demand controls that fit their use case. Introspection settings alone do not limit expensive work.",
  },
  {
    prompt: "When is a subscription a good fit?",
    options: [
      "Whenever a query returns a list",
      "When clients need frequent incremental updates and the system can support long-lived connections",
      "When the server has no event source",
    ],
    answer: 1,
    explanation:
      "Subscriptions suit near-real-time updates, but require transport, event delivery, authorization, reconnect handling, and scaling decisions. Polling or refetching may be simpler for infrequent changes.",
  },
];
const graphqlInterviewAnswers = new Map();
const graphqlInterviewReviewed = new Set(
  JSON.parse(localStorage.getItem("graphql-interview-reviewed") || "[]"),
);
function renderGraphQLInterviewQuestions() {
  const holder = document.querySelector("#graphqlInterviewQuestions");
  if (!holder) return;
  holder.innerHTML = graphqlInterviewQuestions
    .map((question, questionIndex) => {
      const selected = graphqlInterviewAnswers.has(questionIndex)
        ? graphqlInterviewAnswers.get(questionIndex)
        : graphqlInterviewReviewed.has(questionIndex)
          ? question.answer
          : null;
      const correct = selected === question.answer;
      const feedback =
        selected == null
          ? "Choose an answer to reveal the reasoning."
          : correct
            ? `Correct. ${question.explanation}`
            : `Not quite. The strongest answer is: ${question.options[question.answer]}. ${question.explanation}`;
      return `<article class="interview-question ${graphqlInterviewReviewed.has(questionIndex) ? "reviewed" : ""}"><span>QUESTION ${String(questionIndex + 1).padStart(2, "0")}</span><h3>${escapeCodeHTML(question.prompt)}</h3><div class="interview-options">${question.options
        .map((option, optionIndex) => {
          const className =
            selected == null
              ? ""
              : optionIndex === question.answer
                ? "is-answer"
                : optionIndex === selected
                  ? "is-wrong"
                  : "";
          return `<button type="button" data-question="${questionIndex}" data-option="${optionIndex}" aria-pressed="${selected === optionIndex}" class="${className}">${escapeCodeHTML(option)}</button>`;
        })
        .join(
          "",
        )}</div><p class="interview-feedback ${selected == null ? "" : correct ? "correct" : "try-again"}" aria-live="polite">${escapeCodeHTML(feedback)}</p></article>`;
    })
    .join("");
  document.querySelector("#graphqlInterviewScore").textContent =
    `${graphqlInterviewReviewed.size} / ${graphqlInterviewQuestions.length} correct`;
  holder.querySelectorAll("button[data-question]").forEach((button) => {
    button.onclick = () => {
      const questionIndex = Number(button.dataset.question);
      const answer = Number(button.dataset.option);
      graphqlInterviewAnswers.set(questionIndex, answer);
      if (answer === graphqlInterviewQuestions[questionIndex].answer) {
        graphqlInterviewReviewed.add(questionIndex);
        localStorage.setItem(
          "graphql-interview-reviewed",
          JSON.stringify([...graphqlInterviewReviewed]),
        );
      }
      renderGraphQLInterviewQuestions();
    };
  });
}
renderGraphQLInterviewQuestions();
window.addEventListener("learning:progress-restored", (event) => {
  if (
    event.detail?.key !== "graphql-interview-reviewed" ||
    !Array.isArray(event.detail.value)
  )
    return;
  graphqlInterviewReviewed.clear();
  event.detail.value.forEach((index) =>
    graphqlInterviewReviewed.add(Number(index)),
  );
  renderGraphQLInterviewQuestions();
});
const q = document.querySelector("#queryInput"),
  vars = document.querySelector("#variablesInput"),
  out = document.querySelector("#responseOutput"),
  run = document.querySelector("#runBtn");
let workbenchSaveTimer;
const saveGraphQLWorkbench = () => {
  clearTimeout(workbenchSaveTimer);
  workbenchSaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        "graphql-course-state",
        JSON.stringify({ active, query: q.value, variables: vars.value }),
      );
    } catch {}
  }, 250);
};
q.addEventListener("input", saveGraphQLWorkbench);
vars.addEventListener("input", saveGraphQLWorkbench);
const finalExampleList = document.querySelector("#finalExampleList");
chapterTryouts.forEach((chapter, chapterIndex) => {
  const group = document.createElement("article");
  group.className = "final-example-group";
  group.innerHTML = `<span>CH ${String(chapterIndex).padStart(2, "0")}</span><div><b>${escapeCodeHTML(lessons[chapterIndex].title)}</b><div>${chapter.presets.map(([label], presetIndex) => `<button data-chapter="${chapterIndex}" data-preset="${presetIndex}">${escapeCodeHTML(label)}</button>`).join("")}</div></div>`;
  finalExampleList.append(group);
});
finalExampleList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-chapter]");
  if (!button) return;
  const preset =
    chapterTryouts[Number(button.dataset.chapter)].presets[
      Number(button.dataset.preset)
    ];
  window.activePracticeIndex = null;
  window.lastRunPracticeIndex = null;
  window.lastGraphQLResult = null;
  q.value = preset[1];
  vars.value = preset[2];
  vars.hidden = !preset[2];
  document.querySelector("#varsToggle").innerHTML = preset[2]
    ? "Hide <span>⌃</span>"
    : "Show <span>⌄</span>";
  syncQueryHighlight();
  document
    .querySelector("#playground")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});
const finalLab = document.querySelector("#finalLab");
const finalReference = document.createElement("details");
finalReference.className = "final-reference";
finalReference.innerHTML = `<summary><span>Explore the wider picture</span><small>Request flow · JavaScript client examples · GraphQL concepts</small></summary><div class="final-reference-content"></div>`;
[
  finalLab.querySelector(".flow-card"),
  finalLab.querySelector(".code-lab"),
  finalLab.querySelector(".concepts"),
].forEach((section) =>
  finalReference.querySelector(".final-reference-content").append(section),
);
finalLab.replaceChildren(
  finalLab.querySelector(".playground"),
  finalLab.querySelector(".practice"),
  finalReference,
);
q.addEventListener("input", syncQueryHighlight);
q.addEventListener("scroll", syncQueryHighlight);
syncQueryHighlight();

function renderRequestPipeline(phase, result = null) {
  const pipeline = document.querySelector("#requestPipeline");
  const steps = [...pipeline.querySelectorAll("[data-step]")];
  const positions = {
    client: 0,
    network: 1,
    schema: 2,
    resolver: 3,
    response: 4,
  };
  pipeline.hidden = false;
  steps.forEach((step) => {
    const index = positions[step.dataset.step];
    step.className = "";
    if (phase === "sending") {
      if (index === 0) step.classList.add("complete");
      if (index === 1) step.classList.add("active");
    } else if (phase === "validating") {
      if (index < 2) step.classList.add("complete");
      if (index === 2) step.classList.add("active");
    } else if (phase === "complete") {
      const trace = result?.extensions?.trace || [];
      const errors = result?.errors || [];
      if (index < 2) step.classList.add("complete");
      else if (index === 2 && errors.length && trace.length === 0)
        step.classList.add("error");
      else if (index === 3 && trace.length === 0) step.classList.add("skipped");
      else step.classList.add("complete");
    } else if (phase === "transport-error") {
      if (index === 0) step.classList.add("complete");
      if (index === 1) step.classList.add("error");
    } else if (phase === "input-error") {
      if (index === 0) step.classList.add("error");
      else step.classList.add("skipped");
    }
  });
  const labels = pipeline.querySelectorAll("[data-step] span");
  if (
    phase === "complete" &&
    result?.errors?.length &&
    !(result.extensions?.trace || []).length
  ) {
    labels[2].textContent = "Validation error";
    labels[3].textContent = "No resolvers ran";
  } else if (phase === "input-error") {
    labels[0].textContent = "Invalid variables";
    labels[1].textContent = "Request not sent";
    labels[2].textContent = "Not reached";
    labels[3].textContent = "Not reached";
    labels[4].textContent = "No response";
  } else {
    labels[0].textContent = "Client";
    labels[1].textContent = "Send request";
    labels[2].textContent = "Validate schema";
    labels[3].textContent = "Resolve data";
    labels[4].textContent = "Return JSON";
  }
}
const codeExamples = [
  {
    title: "Fetch books",
    description: "Send a query and print the JSON response.",
    code: `const response = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "{ books { title author } }"
  })
});
const result = await response.json();
console.log(JSON.stringify(result, null, 2));`,
  },
  {
    title: "Use variables",
    description: "Keep the query reusable and pass search text separately.",
    code:
      `const query = ` +
      "`" +
      `query Search($term: String!) {
  searchBooks(text: $term) {
    title
    genre
  }
}` +
      "`" +
      `;
const variables = { term: "fantasy" };
const response = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
});
const result = await response.json();
console.log(JSON.stringify(result, null, 2));`,
  },
  {
    title: "Read an error",
    description:
      "GraphQL returns helpful validation errors for unknown fields.",
    code: `const response = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "{ book(id: \\\"1\\\") { titel } }"
  })
});
const result = await response.json();
console.log(JSON.stringify(result, null, 2));`,
  },
];
let activeCodeExample = 0;
const codeTabs = document.querySelector("#codeTabs"),
  codeBlock = document.querySelector("#codeExample"),
  codeOutput = document.querySelector("#codeOutput"),
  codeRun = document.querySelector("#runCodeBtn");
function escapeCodeHTML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function highlightJavaScript(source) {
  const tokenPattern =
    /\/\/[^\n]*|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b|[{}()[\].,:;]/g;
  const keywords = new Set([
    "const",
    "let",
    "var",
    "await",
    "async",
    "return",
    "new",
    "function",
    "if",
    "else",
    "throw",
    "try",
    "catch",
    "import",
    "from",
    "export",
    "default",
  ]);
  const builtins = new Set([
    "fetch",
    "JSON",
    "console",
    "graphql",
    "useEffect",
    "useState",
    "Error",
  ]);
  const methods = new Set(["stringify", "log", "json", "then", "catch", "map"]);
  let html = "",
    cursor = 0;
  for (const match of source.matchAll(tokenPattern)) {
    const token = match[0],
      index = match.index;
    html += escapeCodeHTML(source.slice(cursor, index));
    let kind = "punct";
    if (token.startsWith("//")) kind = "comment";
    else if (/^['"`]/.test(token)) kind = "string";
    else if (keywords.has(token)) kind = "keyword";
    else if (["true", "false", "null", "undefined"].includes(token))
      kind = "literal";
    else if (/^\d/.test(token)) kind = "number";
    else if (builtins.has(token)) kind = "builtin";
    else if (
      methods.has(token) &&
      /^\s*\(/.test(source.slice(index + token.length))
    )
      kind = "method";
    else if (/^[A-Za-z_$]/.test(token))
      kind = /^\s*:/.test(source.slice(index + token.length))
        ? "property"
        : "identifier";
    html += `<span class="tok-${kind}">${escapeCodeHTML(token)}</span>`;
    cursor = index + token.length;
  }
  return html + escapeCodeHTML(source.slice(cursor));
}
function chooseCodeExample(i) {
  activeCodeExample = i;
  document.querySelectorAll(".code-tab").forEach((b, j) => {
    b.classList.toggle("active", j === i);
    b.setAttribute("aria-selected", j === i ? "true" : "false");
  });
  codeBlock.innerHTML = highlightJavaScript(codeExamples[i].code);
  document.querySelector("#codeDescription").textContent =
    codeExamples[i].description;
  codeOutput.innerHTML =
    '<span class="code-placeholder">Run this example to see the live API response.</span>';
  document.querySelector("#codeMeta").textContent = "READY";
}
codeExamples.forEach((example, i) => {
  const tab = document.createElement("button");
  tab.className = "code-tab";
  tab.type = "button";
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", () => chooseCodeExample(i));
  tab.textContent = example.title;
  codeTabs.append(tab);
});
chooseCodeExample(0);
async function runCodeExample() {
  const selected = codeExamples[activeCodeExample];
  codeRun.disabled = true;
  codeRun.innerHTML = "Running… <span>◌</span>";
  document.querySelector("#codeMeta").textContent = "RUNNING";
  const logs = [];
  const safeFetch = async (input, options = {}) => {
    const target = new URL(input, window.location.href);
    if (
      target.origin !== window.location.origin ||
      target.pathname !== "/graphql" ||
      options.method !== "POST"
    )
      throw new Error(
        "This example runner only sends POST requests to this project’s /graphql endpoint.",
      );
    if (typeof options.body !== "string" || options.body.length > 20000)
      throw new Error("Request body is missing or too large.");
    const payload = JSON.parse(options.body);
    if (typeof payload.query !== "string")
      throw new Error("Request must contain a GraphQL query string.");
    return window.fetch("/graphql", options);
  };
  const demoConsole = { log: (...args) => logs.push(args.join(" ")) };
  try {
    const execute = new Function(
      "fetch",
      "console",
      `return (async () => { ${selected.code} })();`,
    );
    await execute(safeFetch, demoConsole);
    codeOutput.innerHTML = highlightJSON(logs.join("\n") || '"(No output)"');
    document.querySelector("#codeMeta").textContent =
      `${logs.length} output${logs.length === 1 ? "" : "s"}`;
  } catch (error) {
    codeOutput.innerHTML = highlightJSON(
      JSON.stringify({ error: error.message }, null, 2),
    );
    document.querySelector("#codeMeta").textContent = "ERROR";
  } finally {
    codeRun.disabled = false;
    codeRun.innerHTML = "Run JavaScript <span>▶</span>";
  }
}
codeRun.addEventListener("click", runCodeExample);
document.querySelector("#varsToggle").onclick = () => {
  vars.hidden = !vars.hidden;
  document.querySelector("#varsToggle").innerHTML = vars.hidden
    ? "Show <span>⌄</span>"
    : "Hide <span>⌃</span>";
};
document.querySelector("#resetBtn").onclick = () => {
  if (!window.confirm(
    "Reset this lesson's editor? Your unsaved query and variable edits will be replaced with the lesson example.",
  )) return;
  selectLesson(active);
};
async function runQuery() {
  run.disabled = true;
  run.innerHTML = "Running… <span>◌</span>";
  document.querySelector("#responseMeta").textContent = "RUNNING";
  renderRequestPipeline("sending");
  const start = performance.now();
  let requestSent = false;
  try {
    let variables = {};
    if (vars.value.trim()) variables = JSON.parse(vars.value);
    await new Promise((resolve) => setTimeout(resolve, 160));
    requestSent = true;
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: q.value, variables }),
    });
    renderRequestPipeline("validating");
    const result = await response.json();
    renderRequestPipeline("complete", result);
    window.lastGraphQLResult = result;
    window.lastRunPracticeIndex = window.activePracticeIndex ?? null;
    out.innerHTML = highlightJSON(JSON.stringify(result, null, 2));
    renderResolverTrace(
      result.extensions?.trace || [],
      result.extensions?.durationMs,
    );
    if (result.extensions?.state) renderLibraryState(result.extensions.state);
    if (window.activePracticeIndex != null) {
      const activeCard = practiceList.children[window.activePracticeIndex];
      const feedback = activeCard?.querySelector(".check-result");
      if (feedback) {
        feedback.textContent =
          "Query ran. Review the response, then return to this challenge and select Check my result.";
        feedback.className = "check-result has-run";
      }
    }
    document.querySelector("#responseMeta").textContent =
      `${Math.round(performance.now() - start)} ms · JSON`;
  } catch (error) {
    renderRequestPipeline(requestSent ? "transport-error" : "input-error");
    window.lastGraphQLResult = null;
    window.lastRunPracticeIndex = null;
    out.innerHTML = highlightJSON(
      JSON.stringify(
        {
          errors: [
            {
              message:
                error instanceof SyntaxError
                  ? "Variables must be valid JSON: " + error.message
                  : error.message,
            },
          ],
        },
        null,
        2,
      ),
    );
    document.querySelector("#responseMeta").textContent = "ERROR";
  } finally {
    run.disabled = false;
    run.innerHTML = "Run query <span>▶</span>";
  }
}
run.onclick = runQuery;

function renderResolverTrace(trace, duration) {
  const holder = document.querySelector("#resolverTrace");
  document.querySelector("#traceMeta").textContent =
    `${trace.length} resolver${trace.length === 1 ? "" : "s"}${duration == null ? "" : ` · ${duration} ms`}`;
  holder.innerHTML = trace.length
    ? trace
        .map(
          (item) =>
            `<div class="trace-row"><span class="trace-dot"></span><div><b>${escapeCodeHTML(item.resolver)}</b><p>${escapeCodeHTML(item.detail || item.type || "Resolved field")}</p></div><small>${Number(item.ms || 0).toFixed(2)} ms</small></div>`,
        )
        .join("")
    : "<p>No resolver ran. Validation errors are returned before data resolvers execute.</p>";
}
function renderLibraryState(state) {
  const holder = document.querySelector("#stateSummary");
  const books = state?.books || [],
    authors = state?.authors || [],
    reviews = state?.reviews || [];
  holder.innerHTML = `<div class="state-metrics"><span><b>${books.length}</b> books</span><span><b>${authors.length}</b> authors</span><span><b>${reviews.length}</b> reviews</span></div><div class="state-book-list">${books
    .slice(0, 5)
    .map(
      (book) =>
        `<div><span>${escapeCodeHTML(book.title)}</span><small>${escapeCodeHTML(book.genre)} · ${book.read ? "read" : "unread"}</small></div>`,
    )
    .join(
      "",
    )}${books.length > 5 ? `<small>+ ${books.length - 5} more books</small>` : ""}</div>`;
}
async function refreshLibraryState() {
  try {
    const response = await fetch("/api/state");
    const payload = await response.json();
    renderLibraryState(payload.state);
  } catch (error) {
    document.querySelector("#stateSummary").textContent =
      `Could not load state: ${error.message}`;
  }
}
document
  .querySelector("#refreshState")
  .addEventListener("click", refreshLibraryState);
document.querySelector("#resetLibrary").addEventListener("click", async () => {
  if (!window.confirm(
    "Reset the sample data? This restores the original books and reviews and discards changes made in this session.",
  )) return;
  const button = document.querySelector("#resetLibrary");
  button.disabled = true;
  try {
    const response = await fetch("/api/reset", { method: "POST" });
    const payload = await response.json();
    renderLibraryState(payload.state);
    document.querySelector("#traceMeta").textContent = "Sample data reset";
  } catch (error) {
    document.querySelector("#traceMeta").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
refreshLibraryState();
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    runQuery();
  }
});
window.__learningDirtyKeys?.clear();
