// Initial in-memory dataset for the GraphQL Learning Lab.
// Designed with rich relationships (Books <-> Authors <-> Reviews <-> Viewer)
// so learners can explore nested queries, filtering, mutations, and live state changes.

const INITIAL_AUTHORS = [
  {
    id: "a1",
    name: "J.R.R. Tolkien",
    country: "United Kingdom",
    birthYear: 1892,
    bio: "Philologist and author of classic high fantasy works set in Middle-earth.",
  },
  {
    id: "a2",
    name: "Octavia E. Butler",
    country: "United States",
    birthYear: 1947,
    bio: "Multiple Hugo and Nebula award-winning pioneer of visionary science fiction.",
  },
  {
    id: "a3",
    name: "Susanna Clarke",
    country: "United Kingdom",
    birthYear: 1959,
    bio: "British novelist known for atmospheric, labyrinthine worlds and magical realism.",
  },
  {
    id: "a4",
    name: "Ursula K. Le Guin",
    country: "United States",
    birthYear: 1929,
    bio: "Acclaimed speculative fiction writer exploring anthropology, gender, and political systems.",
  },
  {
    id: "a5",
    name: "Ted Chiang",
    country: "United States",
    birthYear: 1967,
    bio: "Computer scientist and fiction writer celebrated for rigorous philosophical stories.",
  },
];

const INITIAL_BOOKS = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    authorId: "a1",
    year: 1937,
    genre: "Fantasy",
    pages: 310,
    read: true,
    rating: 4.8,
    summary:
      "Bilbo Baggins sets out on an unexpected adventure across Middle-earth.",
    tags: ["adventure", "classic", "dragons"],
  },
  {
    id: "2",
    title: "Kindred",
    author: "Octavia E. Butler",
    authorId: "a2",
    year: 1979,
    genre: "Science fiction",
    pages: 287,
    read: false,
    rating: 4.6,
    summary:
      "A modern writer is mysteriously pulled back and forth through time into the antebellum South.",
    tags: ["time-travel", "history", "essential"],
  },
  {
    id: "3",
    title: "Piranesi",
    author: "Susanna Clarke",
    authorId: "a3",
    year: 2020,
    genre: "Fantasy",
    pages: 245,
    read: false,
    rating: 4.5,
    summary:
      "A researcher lives inside an infinite house of statues where an imprisoned ocean rises in tides.",
    tags: ["mystery", "labyrinth", "atmospheric"],
  },
  {
    id: "4",
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    authorId: "a4",
    year: 1969,
    genre: "Science fiction",
    pages: 304,
    read: true,
    rating: 4.7,
    summary:
      "A lone human envoy visits the winter world of Gethen to invite its people into an interstellar coalition.",
    tags: ["diplomacy", "hugo-winner", "classic"],
  },
  {
    id: "5",
    title: "Exhalation",
    author: "Ted Chiang",
    authorId: "a5",
    year: 2019,
    genre: "Science fiction",
    pages: 368,
    read: false,
    rating: 4.9,
    summary:
      "Nine thought-provoking stories exploring free will, memory, time travel, and artificial life.",
    tags: ["short-stories", "philosophy", "ai"],
  },
  {
    id: "6",
    title: "Parable of the Sower",
    author: "Octavia E. Butler",
    authorId: "a2",
    year: 1993,
    genre: "Science fiction",
    pages: 345,
    read: true,
    rating: 4.8,
    summary:
      "Lauren Olamina journeys north in search of safety and plants the seeds of a new community philosophy.",
    tags: ["resilience", "future", "essential"],
  },
];

const INITIAL_REVIEWS = [
  {
    id: "r1",
    bookId: "1",
    reviewer: "Maya",
    rating: 5,
    comment:
      "Warm, witty, and still the best introduction to fantasy world-building.",
    createdAt: "2026-02-10",
  },
  {
    id: "r2",
    bookId: "1",
    reviewer: "Devon",
    rating: 5,
    comment: "Riddles in the Dark alone makes this unforgettable.",
    createdAt: "2026-03-04",
  },
  {
    id: "r3",
    bookId: "2",
    reviewer: "Samira",
    rating: 5,
    comment: "Impossible to put down. Every chapter raises the stakes.",
    createdAt: "2026-03-19",
  },
  {
    id: "r4",
    bookId: "3",
    reviewer: "Liam",
    rating: 4,
    comment:
      "Starts like a quiet puzzle box and turns into a gripping mystery.",
    createdAt: "2026-04-02",
  },
  {
    id: "r5",
    bookId: "4",
    reviewer: "Elena",
    rating: 5,
    comment:
      "The journey across the Gobrin Ice is one of the finest sequences in sci-fi.",
    createdAt: "2026-04-15",
  },
  {
    id: "r6",
    bookId: "5",
    reviewer: "Noah",
    rating: 5,
    comment:
      "Every single story feels like an entire novel compressed into 30 pages.",
    createdAt: "2026-05-01",
  },
];

const INITIAL_VIEWER = {
  id: "u1",
  name: "Alex",
  role: "Curious Reader",
  favoriteGenres: ["Fantasy", "Science fiction"],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const store = {
  authors: clone(INITIAL_AUTHORS),
  books: clone(INITIAL_BOOKS),
  reviews: clone(INITIAL_REVIEWS),
  viewer: clone(INITIAL_VIEWER),
};

function resetStore() {
  store.authors = clone(INITIAL_AUTHORS);
  store.books = clone(INITIAL_BOOKS);
  store.reviews = clone(INITIAL_REVIEWS);
  store.viewer = clone(INITIAL_VIEWER);
  return getSnapshot();
}

function getSnapshot() {
  return {
    books: store.books.map((b) => ({
      ...b,
      reviewCount: store.reviews.filter((r) => r.bookId === b.id).length,
    })),
    authors: store.authors.map((a) => ({
      ...a,
      bookCount: store.books.filter(
        (b) =>
          b.authorId === a.id ||
          b.author.toLowerCase() === a.name.toLowerCase(),
      ).length,
    })),
    reviews: [...store.reviews],
    viewer: {
      ...store.viewer,
      unreadCount: store.books.filter((b) => !b.read).length,
    },
    stats: {
      totalBooks: store.books.length,
      readBooks: store.books.filter((b) => b.read).length,
      unreadBooks: store.books.filter((b) => !b.read).length,
      totalAuthors: store.authors.length,
      totalReviews: store.reviews.length,
    },
  };
}

module.exports = {
  store,
  resetStore,
  getSnapshot,
};
