import { store, resetStore } from "./data";

export interface ResolverTrace {
  resolver: string;
  type: string;
  detail: string;
  ms: number;
}

function recordTrace(trace, resolver, type, detail, startedAt) {
  trace.push({
    resolver,
    type,
    detail,
    ms: Number((performance.now() - startedAt).toFixed(2)),
  });
}

function findAuthorForBook(book) {
  return (
    store.authors.find(
      (author) =>
        author.id === book.authorId ||
        author.name.toLowerCase() === book.author.toLowerCase(),
    ) || {
      id: `author-${book.id}`,
      name: book.author,
      country: "Unknown",
      birthYear: null,
      bio: `Author of ${book.title}.`,
    }
  );
}

function decorateAuthor(author, trace) {
  return {
    ...author,
    books: () => {
      const startedAt = performance.now();
      const books = store.books
        .filter(
          (book) =>
            book.authorId === author.id ||
            book.author.toLowerCase() === author.name.toLowerCase(),
        )
        .map((book) => decorateBook(book, trace));
      recordTrace(
        trace,
        `Author(${author.name}).books`,
        "[Book!]!",
        `Found ${books.length} book(s) by ${author.name}`,
        startedAt,
      );
      return books;
    },
    bookCount: () =>
      store.books.filter(
        (book) =>
          book.authorId === author.id ||
          book.author.toLowerCase() === author.name.toLowerCase(),
      ).length,
  };
}

function decorateReview(review) {
  const book = store.books.find((item) => item.id === review.bookId);
  return { ...review, bookTitle: book ? book.title : "Unknown Book" };
}

function decorateBook(book, trace) {
  return {
    ...book,
    pages: book.pages || 260,
    tags: book.tags || ["library"],
    authorProfile: () => {
      const startedAt = performance.now();
      const author = findAuthorForBook(book);
      recordTrace(
        trace,
        `Book(${book.id}).authorProfile`,
        "Author",
        `Resolved author \"${author.name}\"`,
        startedAt,
      );
      return decorateAuthor(author, trace);
    },
    reviews: () => {
      const startedAt = performance.now();
      const reviews = store.reviews
        .filter((review) => review.bookId === book.id)
        .map(decorateReview);
      recordTrace(
        trace,
        `Book(${book.id}).reviews`,
        "[Review!]!",
        `Found ${reviews.length} review(s) for \"${book.title}\"`,
        startedAt,
      );
      return reviews;
    },
    reviewCount: () =>
      store.reviews.filter((review) => review.bookId === book.id).length,
  };
}

function computeStats() {
  const rated = store.books.filter((book) => typeof book.rating === "number");
  const averageRating = rated.length
    ? Number(
        (
          rated.reduce((sum, book) => sum + book.rating, 0) / rated.length
        ).toFixed(2),
      )
    : 0;
  return {
    totalBooks: store.books.length,
    readBooks: store.books.filter((book) => book.read).length,
    unreadBooks: store.books.filter((book) => !book.read).length,
    totalAuthors: store.authors.length,
    totalReviews: store.reviews.length,
    averageRating,
    genres: [...new Set(store.books.map((book) => book.genre))],
  };
}

function createRootResolvers(trace: ResolverTrace[] = []) {
  const traced = (resolver, type, detail, fn) => (...args) => {
    const startedAt = performance.now();
    const value = fn(...args);
    recordTrace(trace, resolver, type, detail(value), startedAt);
    return value;
  };

  return {
    hello: traced(
      "Query.hello",
      "String!",
      () => "Returned server greeting string",
      () => "Hello from your GraphQL server! 👋",
    ),
    books: traced(
      "Query.books",
      "[Book!]!",
      (books, { genre, read }: { genre?: string; read?: boolean } = {}) =>
        `Returned ${books.length} book(s)${genre ? ` [genre=${genre}]` : ""}${typeof read === "boolean" ? ` [read=${read}]` : ""}`,
      ({ genre, read, minRating, limit, sortBy }: { genre?: string; read?: boolean; minRating?: number; limit?: number; sortBy?: string } = {}) => {
        let books = [...store.books];
        if (genre?.trim()) {
          books = books.filter(
            (book) => book.genre.toLowerCase() === genre.trim().toLowerCase(),
          );
        }
        if (typeof read === "boolean") {
          books = books.filter((book) => book.read === read);
        }
        if (typeof minRating === "number") {
          books = books.filter((book) => (book.rating ?? 0) >= minRating);
        }
        if (sortBy === "year") books.sort((a, b) => b.year - a.year);
        else if (sortBy === "rating")
          books.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        else if (sortBy === "title")
          books.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === "pages")
          books.sort((a, b) => (b.pages || 0) - (a.pages || 0));
        if (typeof limit === "number" && limit >= 0) books = books.slice(0, limit);
        return books.map((book) => decorateBook(book, trace));
      },
    ),
    bookConnection: traced(
      "Query.bookConnection",
      "BookConnection!",
      (connection) => `Returned ${connection.edges.length} edge(s); hasNextPage=${connection.pageInfo.hasNextPage}`,
      ({ first = 2, after }: { first?: number; after?: string } = {}) => {
        const ordered = [...store.books].sort((a, b) => Number(a.id) - Number(b.id));
        let start = 0;
        if (after) {
          let afterId;
          try {
            afterId = Buffer.from(after, "base64url").toString("utf8");
          } catch {
            throw new Error("Invalid pagination cursor.");
          }
          const cursorIndex = ordered.findIndex((book) => book.id === afterId);
          if (cursorIndex < 0) throw new Error("Pagination cursor is no longer in this collection.");
          start = cursorIndex + 1;
        }
        const pageSize = Math.max(1, Math.min(Number.isInteger(first) ? first : 2, 5));
        const page = ordered.slice(start, start + pageSize);
        const edges = page.map((book) => ({
          cursor: Buffer.from(book.id).toString("base64url"),
          node: decorateBook(book, trace),
        }));
        return {
          edges,
          pageInfo: {
            hasNextPage: start + page.length < ordered.length,
            endCursor: edges.at(-1)?.cursor || null,
          },
        };
      },
    ),
    book: traced(
      "Query.book",
      "Book",
      (book, { id }) => (book ? `Matched \"${book.title}\"` : `No book with id \"${id}\" (returned null)`),
      ({ id }) =>
        store.books.find((item) => item.id === String(id))
          ? decorateBook(store.books.find((item) => item.id === String(id)), trace)
          : null,
    ),
    searchBooks: traced(
      "Query.searchBooks",
      "[Book!]!",
      (books) => `Matched ${books.length} book(s)`,
      ({ text }) => {
        const term = text.toLowerCase();
        return store.books
          .filter((book) =>
            `${book.title} ${book.author} ${book.genre} ${book.summary} ${(book.tags || []).join(" ")}`
              .toLowerCase()
              .includes(term),
          )
          .map((book) => decorateBook(book, trace));
      },
    ),
    authors: traced(
      "Query.authors",
      "[Author!]!",
      (authors) => `Returned ${authors.length} authors`,
      () => store.authors.map((author) => decorateAuthor(author, trace)),
    ),
    author: traced(
      "Query.author",
      "Author",
      (author) => (author ? `Found author \"${author.name}\"` : "Returned null"),
      ({ id, name }) => {
        const author = store.authors.find(
          (item) =>
            (id && item.id === String(id)) ||
            (name && item.name.toLowerCase().includes(name.toLowerCase())),
        );
        return author ? decorateAuthor(author, trace) : null;
      },
    ),
    reviews: traced(
      "Query.reviews",
      "[Review!]!",
      (reviews) => `Returned ${reviews.length} review(s)`,
      ({ bookId }: { bookId?: string } = {}) =>
        store.reviews
          .filter((review) => !bookId || review.bookId === String(bookId))
          .map(decorateReview),
    ),
    viewer: traced(
      "Query.viewer",
      "User!",
      () => "Returned the demo viewer",
      () => ({
        ...store.viewer,
        readingList: () =>
          store.books
            .filter((book) => !book.read)
            .map((book) => decorateBook(book, trace)),
        completedBooks: () =>
          store.books
            .filter((book) => book.read)
            .map((book) => decorateBook(book, trace)),
      }),
    ),
    libraryStats: traced(
      "Query.libraryStats",
      "LibraryStats!",
      (stats) => `Summarized ${stats.totalBooks} books and ${stats.totalReviews} reviews`,
      computeStats,
    ),
    addBook: traced(
      "Mutation.addBook",
      "Book!",
      (book) => `Created \"${book.title}\" with id ${book.id}`,
      ({ title, author, genre = "Unsorted", year, pages, summary }) => {
        const authorRecord = store.authors.find(
          (item) => item.name.toLowerCase() === author.toLowerCase(),
        );
        const id = String(Math.max(0, ...store.books.map((book) => Number(book.id) || 0)) + 1);
        const book = {
          id,
          title: title.trim(),
          author: author.trim(),
          authorId: authorRecord?.id || null,
          year: year || new Date().getFullYear(),
          genre,
          pages: pages || 260,
          read: false,
          rating: null,
          summary: summary || "A newly added book.",
          tags: [],
        };
        store.books.push(book);
        return decorateBook(book, trace);
      },
    ),
    addBookFromInput: traced(
      "Mutation.addBookFromInput",
      "AddBookPayload!",
      ({ book }) => `Created \"${book.title}\" with id ${book.id}`,
      ({ input }) => {
        const { title, author, genre = "Unsorted", year, pages, summary } = input;
        const authorRecord = store.authors.find(
          (item) => item.name.toLowerCase() === author.toLowerCase(),
        );
        const id = String(
          Math.max(0, ...store.books.map((book) => Number(book.id) || 0)) + 1,
        );
        const book = {
          id,
          title: title.trim(),
          author: author.trim(),
          authorId: authorRecord?.id || null,
          year: year || new Date().getFullYear(),
          genre,
          pages: pages || 260,
          read: false,
          rating: null,
          summary: summary || "A newly added book.",
          tags: [],
        };
        store.books.push(book);
        return { book: decorateBook(book, trace) };
      },
    ),
    markBookRead: traced(
      "Mutation.markBookRead",
      "Book",
      (book) => (book ? `Updated read status for \"${book.title}\"` : "Book not found"),
      ({ id, read }) => {
        const book = store.books.find((item) => item.id === String(id));
        if (!book) return null;
        book.read = read;
        return decorateBook(book, trace);
      },
    ),
    updateBookRating: traced(
      "Mutation.updateBookRating",
      "Book",
      (book) => (book ? `Updated rating for \"${book.title}\"` : "Book not found"),
      ({ id, rating }) => {
        if (rating < 0 || rating > 5) throw new Error("Rating must be between 0 and 5.");
        const book = store.books.find((item) => item.id === String(id));
        if (!book) return null;
        book.rating = rating;
        return decorateBook(book, trace);
      },
    ),
    addReview: traced(
      "Mutation.addReview",
      "Review!",
      (review) => `Added a review for \"${review.bookTitle}\"`,
      ({ bookId, reviewer, rating, comment }) => {
        const book = store.books.find((item) => item.id === String(bookId));
        if (!book) throw new Error(`Book ${bookId} was not found.`);
        if (rating < 1 || rating > 5) throw new Error("Review rating must be between 1 and 5.");
        const review = {
          id: `r${Math.max(0, ...store.reviews.map((item) => Number(item.id.slice(1)) || 0)) + 1}`,
          bookId: String(bookId),
          reviewer: reviewer.trim(),
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString().slice(0, 10),
        };
        store.reviews.push(review);
        return decorateReview(review);
      },
    ),
    deleteBook: traced(
      "Mutation.deleteBook",
      "DeleteResult!",
      (result) => result.message,
      ({ id }) => {
        const index = store.books.findIndex((book) => book.id === String(id));
        if (index < 0) {
          return { success: false, deletedId: String(id), message: `Book ${id} was not found.`, remainingCount: store.books.length };
        }
        const [deleted] = store.books.splice(index, 1);
        store.reviews = store.reviews.filter((review) => review.bookId !== deleted.id);
        return { success: true, deletedId: deleted.id, message: `Deleted \"${deleted.title}\".`, remainingCount: store.books.length };
      },
    ),
    resetLibrary: traced(
      "Mutation.resetLibrary",
      "LibraryStats!",
      () => "Restored the starter library",
      () => {
        resetStore();
        return computeStats();
      },
    ),
  };
}

export { createRootResolvers };
export default { createRootResolvers };
