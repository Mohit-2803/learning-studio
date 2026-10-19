import { buildSchema } from "graphql";

const schemaSDL = `
  """
  Root read operations available in the GraphQL Learning Studio API.
  """
  type Query {
    "A friendly greeting to verify the GraphQL server is online."
    hello: String!

    "Fetch books in the library, with optional filtering, sorting, and limiting."
    books(
      genre: String
      read: Boolean
      minRating: Float
      limit: Int
      sortBy: String
    ): [Book!]!

    """Return a bounded, cursor-paginated slice of books."""
    bookConnection(first: Int = 2, after: String): BookConnection!

    "Look up a single book by its unique ID. Returns null if not found."
    book(id: ID!): Book

    "Search books by title, author, genre, summary, or tags."
    searchBooks(text: String!): [Book!]!

    "List all authors in the catalog."
    authors: [Author!]!

    "Look up a single author by ID or name."
    author(id: ID, name: String): Author

    "Fetch community reviews, optionally filtered by bookId."
    reviews(bookId: ID): [Review!]!

    "The currently signed-in learner and their reading list."
    viewer: User!

    "Aggregate statistics across the library catalog."
    libraryStats: LibraryStats!
  }

  """
  Root write operations that create, update, or reset library data.
  """
  type Mutation {
    "Add a new book to the in-memory catalog."
    addBook(
      title: String!
      author: String!
      genre: String
      year: Int
      pages: Int
      summary: String
    ): Book!

    """Create a book using one named input object."""
    addBookFromInput(input: AddBookInput!): AddBookPayload!

    "Update whether a book has been read."
    markBookRead(id: ID!, read: Boolean!): Book

    "Update the rating (0.0 to 5.0) of a book."
    updateBookRating(id: ID!, rating: Float!): Book

    "Post a new reader review for a book."
    addReview(
      bookId: ID!
      reviewer: String!
      rating: Int!
      comment: String!
    ): Review!

    "Remove a book from the catalog by ID."
    deleteBook(id: ID!): DeleteResult!

    "Reset the in-memory library back to its original starter dataset."
    resetLibrary: LibraryStats!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
    genre: String!
    pages: Int!
    read: Boolean!
    rating: Float
    summary: String!
    tags: [String!]!
    authorProfile: Author
    reviews: [Review!]!
    reviewCount: Int!
  }

  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
  }

  type BookEdge {
    cursor: String!
    node: Book!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Author {
    id: ID!
    name: String!
    country: String!
    birthYear: Int
    bio: String!
    books: [Book!]!
    bookCount: Int!
  }

  type Review {
    id: ID!
    bookId: ID!
    bookTitle: String!
    reviewer: String!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    role: String!
    favoriteGenres: [String!]!
    readingList: [Book!]!
    completedBooks: [Book!]!
  }

  type LibraryStats {
    totalBooks: Int!
    readBooks: Int!
    unreadBooks: Int!
    totalAuthors: Int!
    totalReviews: Int!
    averageRating: Float!
    genres: [String!]!
  }

  type DeleteResult {
    success: Boolean!
    deletedId: ID!
    message: String!
    remainingCount: Int!
  }

  input AddBookInput {
    title: String!
    author: String!
    genre: String
    year: Int
    pages: Int
    summary: String
  }

  type AddBookPayload {
    book: Book!
  }
`;

const schema = buildSchema(schemaSDL);

const schemaModule = {
  schema,
  schemaSDL: schemaSDL.trim(),
};

export { schema, schemaSDL };
export default schemaModule;
