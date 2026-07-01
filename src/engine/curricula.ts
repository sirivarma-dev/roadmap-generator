// Curriculum knowledge base.
//
// Each curriculum is an ordered list of "topic blueprints". Order encodes
// dependency: a topic may only depend on topics that appear before it.
// The engine consumes these blueprints, applies pace math, groups them into
// phases, and personalizes based on the learner's current knowledge and goal.
//
// This is deliberately data-driven so new subjects are added by appending data,
// never by touching engine logic.

import type { Difficulty, InterviewImportance } from '../types/roadmap';

export interface TopicBlueprint {
  name: string;
  baseHours: number;
  difficulty: Difficulty;
  prerequisites: string[];
  subtopics: string[];
  learningObjective: string;
  interviewImportance: InterviewImportance;
  interviewConcepts: string[];
  commonMistakes: string[];
  /** Coarse level used to skip content for more advanced learners. */
  level: 'foundation' | 'core' | 'intermediate' | 'advanced' | 'professional';
}

export interface Curriculum {
  label: string;
  aliases: string[];
  /** One-line description of the destination. */
  destination: string;
  topics: TopicBlueprint[];
}

// ---------------------------------------------------------------------------
// Generic programming-language curriculum (used for Python, Java, C++, JS...)
// The engine substitutes the language name into copy where {lang} appears.
// ---------------------------------------------------------------------------
const programmingTopics: TopicBlueprint[] = [
  {
    name: 'Environment & Tooling Setup',
    baseHours: 4,
    difficulty: 'Easy',
    prerequisites: [],
    level: 'foundation',
    subtopics: [
      'Installing the {lang} runtime/compiler',
      'Choosing and configuring an editor or IDE',
      'Running your first program',
      'Understanding the REPL / interactive shell',
      'Reading error output',
      'Formatting and linting basics',
    ],
    learningObjective:
      'Set up a reliable {lang} development environment and run programs confidently.',
    interviewImportance: 'Low',
    interviewConcepts: [
      'How {lang} code is executed (compiled vs interpreted)',
      'Difference between source, bytecode, and machine code',
    ],
    commonMistakes: [
      'Mixing multiple runtime versions on one machine',
      'Ignoring compiler/interpreter warnings',
      'Not learning the editor shortcuts early',
    ],
  },
  {
    name: 'Syntax & Variables',
    baseHours: 6,
    difficulty: 'Easy',
    prerequisites: ['Environment & Tooling Setup'],
    level: 'foundation',
    subtopics: [
      'Statements and expressions',
      'Declaring variables',
      'Naming conventions',
      'Comments and documentation',
      'Constants and immutability',
      'Basic input and output',
    ],
    learningObjective:
      'Write syntactically correct {lang} and reason about how variables store values.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Value vs reference semantics',
      'Mutable vs immutable bindings',
      'Scope of a variable',
    ],
    commonMistakes: [
      'Confusing assignment with equality',
      'Shadowing variables unintentionally',
      'Assuming a language is pass-by-reference when it is pass-by-value',
    ],
  },
  {
    name: 'Data Types',
    baseHours: 8,
    difficulty: 'Easy',
    prerequisites: ['Syntax & Variables'],
    level: 'foundation',
    subtopics: [
      'Integers and floating-point numbers',
      'Booleans',
      'Strings and text encoding',
      'Type conversion and casting',
      'Null / None / undefined',
      'Type checking',
      'Precision and overflow',
    ],
    learningObjective:
      'Select the correct primitive type and convert safely between representations.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Floating-point precision errors',
      'Integer overflow behavior',
      'String immutability',
      'Truthiness rules',
    ],
    commonMistakes: [
      'Comparing floats with exact equality',
      'Forgetting strings are immutable in many languages',
      'Implicit type coercion surprises',
    ],
  },
  {
    name: 'Operators & Expressions',
    baseHours: 6,
    difficulty: 'Easy',
    prerequisites: ['Data Types'],
    level: 'foundation',
    subtopics: [
      'Arithmetic operators',
      'Comparison operators',
      'Logical operators',
      'Bitwise operators',
      'Operator precedence',
      'Short-circuit evaluation',
      'Assignment operators',
    ],
    learningObjective:
      'Combine values into expressions and predict evaluation order precisely.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Short-circuit evaluation and its side effects',
      'Operator precedence pitfalls',
      'Bit manipulation tricks',
    ],
    commonMistakes: [
      'Relying on precedence instead of parentheses',
      'Confusing bitwise and logical operators',
    ],
  },
  {
    name: 'Control Flow',
    baseHours: 8,
    difficulty: 'Easy',
    prerequisites: ['Operators & Expressions'],
    level: 'foundation',
    subtopics: [
      'if / else if / else',
      'switch / match statements',
      'Ternary expressions',
      'Nested conditionals',
      'Guard clauses',
      'Boolean logic in conditions',
    ],
    learningObjective:
      'Direct program execution using conditional branching cleanly and readably.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Guard clauses vs nested ifs',
      'Fall-through behavior in switch',
    ],
    commonMistakes: [
      'Deeply nested conditionals',
      'Forgetting break in switch statements',
      'Off-by-one logic in boundary conditions',
    ],
  },
  {
    name: 'Loops & Iteration',
    baseHours: 10,
    difficulty: 'Medium',
    prerequisites: ['Control Flow'],
    level: 'foundation',
    subtopics: [
      'for loops',
      'while loops',
      'do-while loops',
      'Iterating collections',
      'break and continue',
      'Nested loops',
      'Infinite loops and termination',
      'Loop invariants',
    ],
    learningObjective:
      'Repeat work correctly and efficiently while avoiding infinite loops.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Loop time complexity',
      'Loop invariants',
      'When to use each loop type',
    ],
    commonMistakes: [
      'Off-by-one errors',
      'Modifying a collection while iterating it',
      'Accidental infinite loops',
    ],
  },
  {
    name: 'Functions',
    baseHours: 12,
    difficulty: 'Medium',
    prerequisites: ['Loops & Iteration'],
    level: 'core',
    subtopics: [
      'Function definition',
      'Parameters',
      'Arguments',
      'Return statement',
      'Default arguments',
      'Keyword arguments',
      'Lambda / anonymous functions',
      'Recursion',
      'Variable scope',
      'Higher-order functions',
      'Built-in functions',
      'Pure functions and side effects',
      'Best practices',
    ],
    learningObjective:
      'Decompose problems into reusable functions and reason about scope and recursion.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Recursion vs iteration',
      'Call stack and stack overflow',
      'Closures and captured scope',
      'Pass-by-value vs pass-by-reference',
    ],
    commonMistakes: [
      'Missing recursion base case',
      'Mutating shared default arguments',
      'Overusing global variables instead of parameters',
    ],
  },
  {
    name: 'Data Structures',
    baseHours: 16,
    difficulty: 'Medium',
    prerequisites: ['Functions'],
    level: 'core',
    subtopics: [
      'Arrays and lists',
      'Dictionaries / maps / hash tables',
      'Sets',
      'Tuples',
      'Stacks',
      'Queues',
      'Nested structures',
      'Choosing the right structure',
      'Iteration and comprehension',
    ],
    learningObjective:
      'Store and organize collections of data and pick structures by access pattern.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Time complexity of common operations',
      'Hash table collisions',
      'When to use a set vs list vs map',
    ],
    commonMistakes: [
      'Using a list where a set or map is correct',
      'Assuming dictionary ordering guarantees',
      'Copying vs referencing nested structures',
    ],
  },
  {
    name: 'Strings & Text Processing',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['Data Structures'],
    level: 'core',
    subtopics: [
      'String methods and slicing',
      'Formatting and interpolation',
      'Searching and replacing',
      'Splitting and joining',
      'Regular expressions basics',
      'Unicode and encoding',
    ],
    learningObjective:
      'Manipulate and parse text robustly across encodings.',
    interviewImportance: 'High',
    interviewConcepts: [
      'String immutability and performance',
      'Common string algorithm patterns',
      'Encoding vs decoding',
    ],
    commonMistakes: [
      'Building strings with repeated concatenation in a loop',
      'Ignoring Unicode edge cases',
    ],
  },
  {
    name: 'Error Handling',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['Functions'],
    level: 'core',
    subtopics: [
      'Exceptions and errors',
      'try / catch / finally',
      'Raising and throwing',
      'Custom exception types',
      'Error propagation',
      'Cleanup and resource release',
      'Defensive programming',
    ],
    learningObjective:
      'Handle failures gracefully and keep programs robust under bad input.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Checked vs unchecked exceptions',
      'When to catch vs propagate',
      'try/finally and resource safety',
    ],
    commonMistakes: [
      'Catching and silently swallowing errors',
      'Using exceptions for normal control flow',
      'Not releasing resources on failure',
    ],
  },
  {
    name: 'Object-Oriented Programming',
    baseHours: 20,
    difficulty: 'Hard',
    prerequisites: ['Data Structures', 'Error Handling'],
    level: 'intermediate',
    subtopics: [
      'Classes and objects',
      'Attributes and methods',
      'Constructors',
      'Encapsulation',
      'Inheritance',
      'Polymorphism',
      'Abstraction and interfaces',
      'Composition over inheritance',
      'Static vs instance members',
      'Method overriding and overloading',
      'SOLID principles',
    ],
    learningObjective:
      'Model real-world entities with classes and apply OOP design principles.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Four pillars of OOP',
      'Composition vs inheritance',
      'SOLID principles',
      'Abstract classes vs interfaces',
    ],
    commonMistakes: [
      'Deep inheritance hierarchies',
      'Leaking internal state (poor encapsulation)',
      'Confusing overriding with overloading',
    ],
  },
  {
    name: 'Functional Programming Concepts',
    baseHours: 10,
    difficulty: 'Hard',
    prerequisites: ['Functions', 'Data Structures'],
    level: 'intermediate',
    subtopics: [
      'First-class functions',
      'Map, filter, reduce',
      'Immutability',
      'Closures',
      'Currying and partial application',
      'Side-effect-free design',
    ],
    learningObjective:
      'Write declarative, composable code using functional techniques.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Closures and captured variables',
      'Pure functions and referential transparency',
      'map/filter/reduce complexity',
    ],
    commonMistakes: [
      'Hidden mutation inside "pure" functions',
      'Overusing clever one-liners that hurt readability',
    ],
  },
  {
    name: 'Modules, Packages & Dependencies',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['Object-Oriented Programming'],
    level: 'intermediate',
    subtopics: [
      'Importing and exporting',
      'Namespaces',
      'Package managers',
      'Dependency versioning',
      'Project structure',
      'Virtual environments / isolation',
    ],
    learningObjective:
      'Organize code across files and manage third-party dependencies safely.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Dependency management strategies',
      'Semantic versioning',
      'Namespace collisions',
    ],
    commonMistakes: [
      'Not pinning dependency versions',
      'Circular imports',
    ],
  },
  {
    name: 'Memory & Performance',
    baseHours: 10,
    difficulty: 'Hard',
    prerequisites: ['Object-Oriented Programming'],
    level: 'advanced',
    subtopics: [
      'Memory model of {lang}',
      'Stack vs heap',
      'Garbage collection / manual management',
      'References and pointers',
      'Profiling and benchmarking',
      'Common performance pitfalls',
      'Caching strategies',
    ],
    learningObjective:
      'Reason about how {lang} uses memory and optimize hotspots methodically.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Stack vs heap allocation',
      'How garbage collection works',
      'Big-O of your own code',
    ],
    commonMistakes: [
      'Premature optimization',
      'Memory leaks from lingering references',
      'Optimizing without profiling first',
    ],
  },
  {
    name: 'Concurrency & Asynchrony',
    baseHours: 14,
    difficulty: 'Expert',
    prerequisites: ['Memory & Performance'],
    level: 'advanced',
    subtopics: [
      'Processes vs threads',
      'Async / await',
      'Event loops',
      'Locks and synchronization',
      'Race conditions and deadlocks',
      'Parallelism vs concurrency',
      'Thread-safe data structures',
    ],
    learningObjective:
      'Write correct concurrent code and avoid race conditions and deadlocks.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Concurrency vs parallelism',
      'Deadlock conditions',
      'Race conditions and how to prevent them',
    ],
    commonMistakes: [
      'Shared mutable state without synchronization',
      'Blocking the event loop',
      'Assuming operations are atomic',
    ],
  },
  {
    name: 'Testing & Debugging',
    baseHours: 10,
    difficulty: 'Medium',
    prerequisites: ['Modules, Packages & Dependencies'],
    level: 'advanced',
    subtopics: [
      'Unit testing',
      'Integration testing',
      'Test-driven development',
      'Mocking and stubbing',
      'Debugger usage',
      'Assertions',
      'Code coverage',
    ],
    learningObjective:
      'Prove code correctness with tests and diagnose defects systematically.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Unit vs integration vs end-to-end tests',
      'Test doubles (mock/stub/fake)',
      'What makes a good test',
    ],
    commonMistakes: [
      'Testing implementation instead of behavior',
      'Fragile tests coupled to internals',
    ],
  },
  {
    name: 'Idiomatic Style & Best Practices',
    baseHours: 8,
    difficulty: 'Hard',
    prerequisites: ['Testing & Debugging', 'Concurrency & Asynchrony'],
    level: 'professional',
    subtopics: [
      'Language idioms and conventions',
      'Clean code principles',
      'Naming and readability',
      'Refactoring techniques',
      'Common design patterns',
      'Code review practices',
      'Documentation standards',
    ],
    learningObjective:
      'Write professional, idiomatic {lang} that reviewers trust and maintain.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Common design patterns',
      'DRY, KISS, YAGNI principles',
      'Refactoring smells',
    ],
    commonMistakes: [
      'Writing non-idiomatic code that "works"',
      'Over-engineering with unnecessary patterns',
    ],
  },
];

// ---------------------------------------------------------------------------
// Web development curriculum
// ---------------------------------------------------------------------------
const webDevTopics: TopicBlueprint[] = [
  {
    name: 'How the Web Works',
    baseHours: 6,
    difficulty: 'Easy',
    prerequisites: [],
    level: 'foundation',
    subtopics: [
      'Clients and servers',
      'HTTP requests and responses',
      'DNS and domains',
      'URLs and routing',
      'Status codes',
      'Browsers and rendering',
    ],
    learningObjective:
      'Understand the request/response cycle that powers every website.',
    interviewImportance: 'High',
    interviewConcepts: [
      'HTTP methods and status codes',
      'What happens when you type a URL and hit enter',
      'DNS resolution steps',
    ],
    commonMistakes: [
      'Confusing HTTP with HTTPS security guarantees',
      'Thinking the browser talks directly to the database',
    ],
  },
  {
    name: 'HTML Fundamentals',
    baseHours: 8,
    difficulty: 'Easy',
    prerequisites: ['How the Web Works'],
    level: 'foundation',
    subtopics: [
      'Document structure',
      'Semantic elements',
      'Forms and inputs',
      'Links and media',
      'Tables',
      'Accessibility attributes',
      'Metadata and SEO basics',
    ],
    learningObjective:
      'Structure content with semantic, accessible HTML.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Semantic HTML and why it matters',
      'Accessibility (ARIA) basics',
      'Block vs inline elements',
    ],
    commonMistakes: [
      'Using divs for everything (div soup)',
      'Skipping alt text and labels',
    ],
  },
  {
    name: 'CSS & Layout',
    baseHours: 14,
    difficulty: 'Medium',
    prerequisites: ['HTML Fundamentals'],
    level: 'foundation',
    subtopics: [
      'Selectors and specificity',
      'The box model',
      'Flexbox',
      'CSS Grid',
      'Responsive design and media queries',
      'Positioning',
      'Transitions and animations',
      'Custom properties (variables)',
    ],
    learningObjective:
      'Style and lay out pages that adapt across screen sizes.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Specificity and the cascade',
      'Box model and box-sizing',
      'Flexbox vs Grid trade-offs',
    ],
    commonMistakes: [
      'Fighting specificity with !important',
      'Fixed pixel layouts that break on mobile',
    ],
  },
  {
    name: 'JavaScript Essentials',
    baseHours: 20,
    difficulty: 'Medium',
    prerequisites: ['CSS & Layout'],
    level: 'core',
    subtopics: [
      'Variables and types',
      'Functions and scope',
      'Arrays and objects',
      'The DOM and events',
      'Async and promises',
      'Fetch and APIs',
      'ES modules',
      'Error handling',
    ],
    learningObjective:
      'Add interactivity and talk to servers using modern JavaScript.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Event loop and async behavior',
      'Closures and scope',
      'this binding',
      'Prototypal inheritance',
    ],
    commonMistakes: [
      'Blocking the main thread',
      'Misunderstanding this',
      'Callback nesting instead of promises/async',
    ],
  },
  {
    name: 'Version Control with Git',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['JavaScript Essentials'],
    level: 'core',
    subtopics: [
      'Repositories and commits',
      'Branching and merging',
      'Remotes and pull requests',
      'Resolving conflicts',
      'Rebasing',
      'Ignoring files',
    ],
    learningObjective:
      'Track changes and collaborate safely with Git.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Merge vs rebase',
      'How to resolve conflicts',
      'Branching strategies',
    ],
    commonMistakes: [
      'Committing secrets or build artifacts',
      'Force-pushing shared branches',
    ],
  },
  {
    name: 'Frontend Frameworks',
    baseHours: 24,
    difficulty: 'Hard',
    prerequisites: ['JavaScript Essentials', 'Version Control with Git'],
    level: 'intermediate',
    subtopics: [
      'Components and props',
      'State management',
      'Rendering and reconciliation',
      'Routing',
      'Forms and validation',
      'Hooks / reactivity',
      'Component lifecycle',
      'Performance optimization',
    ],
    learningObjective:
      'Build component-based single-page applications.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Virtual DOM and reconciliation',
      'Controlled vs uncontrolled components',
      'State management patterns',
    ],
    commonMistakes: [
      'Unnecessary re-renders',
      'Mutating state directly',
      'Prop drilling instead of proper state design',
    ],
  },
  {
    name: 'Backend & APIs',
    baseHours: 22,
    difficulty: 'Hard',
    prerequisites: ['Frontend Frameworks'],
    level: 'intermediate',
    subtopics: [
      'Server frameworks',
      'REST API design',
      'Routing and middleware',
      'Authentication and sessions',
      'Request validation',
      'Error handling',
      'Environment configuration',
    ],
    learningObjective:
      'Design and build server-side APIs that clients consume.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'REST principles',
      'Authentication vs authorization',
      'Statelessness and sessions',
    ],
    commonMistakes: [
      'Trusting client input without validation',
      'Leaking stack traces to clients',
    ],
  },
  {
    name: 'Databases',
    baseHours: 18,
    difficulty: 'Hard',
    prerequisites: ['Backend & APIs'],
    level: 'advanced',
    subtopics: [
      'Relational vs NoSQL',
      'Schema design',
      'CRUD operations',
      'Indexes',
      'Joins and relationships',
      'Transactions',
      'Query optimization',
      'ORMs',
    ],
    learningObjective:
      'Persist and query data efficiently and safely.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Normalization',
      'ACID properties',
      'Indexing and query performance',
      'SQL vs NoSQL trade-offs',
    ],
    commonMistakes: [
      'Missing indexes on filtered columns',
      'SQL injection from string concatenation',
      'N+1 query problems',
    ],
  },
  {
    name: 'Security Fundamentals',
    baseHours: 12,
    difficulty: 'Hard',
    prerequisites: ['Backend & APIs', 'Databases'],
    level: 'advanced',
    subtopics: [
      'HTTPS and TLS',
      'XSS and CSRF',
      'SQL injection',
      'Authentication tokens (JWT)',
      'Password hashing',
      'CORS',
      'Secrets management',
    ],
    learningObjective:
      'Protect applications against the most common web vulnerabilities.',
    interviewImportance: 'High',
    interviewConcepts: [
      'OWASP Top 10',
      'XSS vs CSRF',
      'Why you hash and salt passwords',
    ],
    commonMistakes: [
      'Storing plaintext passwords',
      'Trusting data from the client',
    ],
  },
  {
    name: 'Deployment & DevOps Basics',
    baseHours: 12,
    difficulty: 'Hard',
    prerequisites: ['Security Fundamentals'],
    level: 'professional',
    subtopics: [
      'Build tooling and bundlers',
      'Environment variables',
      'CI/CD pipelines',
      'Hosting and CDNs',
      'Containers',
      'Monitoring and logging',
      'Performance and caching',
    ],
    learningObjective:
      'Ship applications to production reliably and observe them.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'CI/CD pipeline stages',
      'Caching layers',
      'Blue-green vs rolling deploys',
    ],
    commonMistakes: [
      'Hardcoding secrets in the repo',
      'No monitoring after deploy',
    ],
  },
];

// ---------------------------------------------------------------------------
// Data Structures & Algorithms curriculum
// ---------------------------------------------------------------------------
const dsaTopics: TopicBlueprint[] = [
  {
    name: 'Complexity Analysis',
    baseHours: 10,
    difficulty: 'Medium',
    prerequisites: [],
    level: 'foundation',
    subtopics: [
      'Big-O notation',
      'Big-Theta and Big-Omega',
      'Time complexity',
      'Space complexity',
      'Best, average, worst case',
      'Amortized analysis',
    ],
    learningObjective:
      'Measure and compare algorithm efficiency rigorously.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Deriving Big-O of a code snippet',
      'Amortized complexity',
      'Space vs time trade-offs',
    ],
    commonMistakes: [
      'Ignoring constant factors when they matter in practice',
      'Confusing average and worst case',
    ],
  },
  {
    name: 'Arrays & Strings',
    baseHours: 12,
    difficulty: 'Medium',
    prerequisites: ['Complexity Analysis'],
    level: 'foundation',
    subtopics: [
      'Static vs dynamic arrays',
      'Two-pointer technique',
      'Sliding window',
      'Prefix sums',
      'In-place operations',
      'String manipulation patterns',
    ],
    learningObjective:
      'Solve linear-scan problems with pointer and window techniques.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Two-pointer patterns',
      'Sliding window template',
      'In-place vs extra space',
    ],
    commonMistakes: [
      'Off-by-one on window boundaries',
      'Unnecessary extra space',
    ],
  },
  {
    name: 'Hashing',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['Arrays & Strings'],
    level: 'core',
    subtopics: [
      'Hash functions',
      'Hash maps and sets',
      'Collision resolution',
      'Frequency counting',
      'Grouping patterns',
    ],
    learningObjective:
      'Use hashing to achieve constant-time lookups and counting.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Hash collisions and load factor',
      'When hashing beats sorting',
    ],
    commonMistakes: [
      'Assuming O(1) is always constant in practice',
      'Using mutable keys',
    ],
  },
  {
    name: 'Linked Lists',
    baseHours: 10,
    difficulty: 'Medium',
    prerequisites: ['Complexity Analysis'],
    level: 'core',
    subtopics: [
      'Singly linked lists',
      'Doubly linked lists',
      'Traversal and reversal',
      'Cycle detection',
      'Fast and slow pointers',
      'Merging lists',
    ],
    learningObjective:
      'Manipulate pointer-based sequences and detect cycles.',
    interviewImportance: 'High',
    interviewConcepts: [
      "Floyd's cycle detection",
      'Reversing a linked list',
      'Dummy node technique',
    ],
    commonMistakes: [
      'Losing the head reference',
      'Null pointer dereferences at boundaries',
    ],
  },
  {
    name: 'Stacks & Queues',
    baseHours: 8,
    difficulty: 'Medium',
    prerequisites: ['Linked Lists'],
    level: 'core',
    subtopics: [
      'Stack operations and uses',
      'Queue and deque',
      'Monotonic stack',
      'Priority queues',
      'Expression evaluation',
    ],
    learningObjective:
      'Apply LIFO/FIFO structures to parsing and ordering problems.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Monotonic stack pattern',
      'Using a stack to simulate recursion',
    ],
    commonMistakes: [
      'Underflow on empty structures',
      'Choosing the wrong ordering discipline',
    ],
  },
  {
    name: 'Recursion & Backtracking',
    baseHours: 14,
    difficulty: 'Hard',
    prerequisites: ['Stacks & Queues'],
    level: 'intermediate',
    subtopics: [
      'Base and recursive cases',
      'The call stack',
      'Divide and conquer',
      'Backtracking template',
      'Permutations and combinations',
      'Pruning',
    ],
    learningObjective:
      'Explore solution spaces with recursion and prune dead ends.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Backtracking template',
      'Recursion tree and complexity',
      'Stack overflow risks',
    ],
    commonMistakes: [
      'Missing or wrong base case',
      'Not undoing state during backtracking',
    ],
  },
  {
    name: 'Trees',
    baseHours: 16,
    difficulty: 'Hard',
    prerequisites: ['Recursion & Backtracking'],
    level: 'intermediate',
    subtopics: [
      'Binary trees',
      'Binary search trees',
      'Tree traversals (in/pre/post/level)',
      'Balanced trees',
      'Tries',
      'Heaps',
      'Lowest common ancestor',
    ],
    learningObjective:
      'Traverse and reason about hierarchical structures.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'DFS vs BFS traversal',
      'BST invariants',
      'Heap operations',
    ],
    commonMistakes: [
      'Confusing traversal orders',
      'Breaking BST invariants on insert',
    ],
  },
  {
    name: 'Graphs',
    baseHours: 18,
    difficulty: 'Expert',
    prerequisites: ['Trees'],
    level: 'advanced',
    subtopics: [
      'Representations (adjacency list/matrix)',
      'BFS and DFS',
      'Topological sort',
      'Shortest paths (Dijkstra, Bellman-Ford)',
      'Union-Find',
      'Minimum spanning trees',
      'Cycle detection',
    ],
    learningObjective:
      'Model relationships and solve traversal and pathfinding problems.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'BFS vs DFS use cases',
      "Dijkstra's algorithm",
      'Topological ordering',
      'Union-Find',
    ],
    commonMistakes: [
      'Not tracking visited nodes',
      'Using Dijkstra with negative weights',
    ],
  },
  {
    name: 'Sorting & Searching',
    baseHours: 12,
    difficulty: 'Hard',
    prerequisites: ['Arrays & Strings'],
    level: 'advanced',
    subtopics: [
      'Binary search and variants',
      'Merge sort',
      'Quick sort',
      'Heap sort',
      'Counting and radix sort',
      'Stability',
    ],
    learningObjective:
      'Select and implement sorting/searching algorithms by constraint.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Binary search on answer space',
      'Sort stability',
      'Quicksort worst case',
    ],
    commonMistakes: [
      'Binary search boundary bugs',
      'Assuming a sort is stable when it is not',
    ],
  },
  {
    name: 'Dynamic Programming',
    baseHours: 20,
    difficulty: 'Expert',
    prerequisites: ['Recursion & Backtracking', 'Sorting & Searching'],
    level: 'professional',
    subtopics: [
      'Overlapping subproblems',
      'Optimal substructure',
      'Memoization (top-down)',
      'Tabulation (bottom-up)',
      'State design',
      'Classic patterns (knapsack, LIS, LCS)',
      'Space optimization',
    ],
    learningObjective:
      'Recognize DP structure and design state transitions.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Identifying DP problems',
      'Top-down vs bottom-up',
      'State and transition design',
    ],
    commonMistakes: [
      'Wrong state definition',
      'Recomputing instead of caching',
    ],
  },
];

// ---------------------------------------------------------------------------
// Machine Learning curriculum
// ---------------------------------------------------------------------------
const mlTopics: TopicBlueprint[] = [
  {
    name: 'Math Foundations',
    baseHours: 20,
    difficulty: 'Hard',
    prerequisites: [],
    level: 'foundation',
    subtopics: [
      'Linear algebra (vectors, matrices)',
      'Calculus and derivatives',
      'Probability',
      'Statistics and distributions',
      'Gradients',
      'Optimization basics',
    ],
    learningObjective:
      'Build the mathematical intuition every ML algorithm rests on.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Gradient and its meaning',
      'Bias-variance in statistical terms',
      'Probability distributions',
    ],
    commonMistakes: [
      'Skipping math and treating models as black boxes',
      'Confusing correlation with causation',
    ],
  },
  {
    name: 'Data Preprocessing',
    baseHours: 12,
    difficulty: 'Medium',
    prerequisites: ['Math Foundations'],
    level: 'foundation',
    subtopics: [
      'Cleaning and missing values',
      'Feature scaling and normalization',
      'Encoding categorical data',
      'Train/validation/test splits',
      'Handling imbalanced data',
      'Feature engineering',
    ],
    learningObjective:
      'Turn raw data into model-ready features without leakage.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Data leakage',
      'Why you split before scaling',
      'Handling class imbalance',
    ],
    commonMistakes: [
      'Fitting scalers on the full dataset (leakage)',
      'Ignoring imbalanced classes',
    ],
  },
  {
    name: 'Supervised Learning',
    baseHours: 22,
    difficulty: 'Hard',
    prerequisites: ['Data Preprocessing'],
    level: 'core',
    subtopics: [
      'Linear and logistic regression',
      'Decision trees',
      'Random forests',
      'Support vector machines',
      'K-nearest neighbors',
      'Gradient boosting',
      'Loss functions',
    ],
    learningObjective:
      'Train and compare models that learn from labeled data.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Bias-variance trade-off',
      'How gradient boosting works',
      'When to use each model',
    ],
    commonMistakes: [
      'Overfitting on training data',
      'Ignoring the baseline model',
    ],
  },
  {
    name: 'Model Evaluation',
    baseHours: 12,
    difficulty: 'Medium',
    prerequisites: ['Supervised Learning'],
    level: 'core',
    subtopics: [
      'Accuracy, precision, recall, F1',
      'ROC and AUC',
      'Confusion matrix',
      'Cross-validation',
      'Overfitting and underfitting',
      'Regularization',
    ],
    learningObjective:
      'Measure model quality with the right metric for the task.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Precision vs recall trade-off',
      'When accuracy misleads',
      'Cross-validation',
    ],
    commonMistakes: [
      'Using accuracy on imbalanced data',
      'Tuning on the test set',
    ],
  },
  {
    name: 'Unsupervised Learning',
    baseHours: 14,
    difficulty: 'Hard',
    prerequisites: ['Model Evaluation'],
    level: 'intermediate',
    subtopics: [
      'K-means clustering',
      'Hierarchical clustering',
      'Dimensionality reduction (PCA)',
      't-SNE and UMAP',
      'Anomaly detection',
      'Association rules',
    ],
    learningObjective:
      'Find structure in unlabeled data.',
    interviewImportance: 'High',
    interviewConcepts: [
      'How PCA works',
      'Choosing k in k-means',
      'Curse of dimensionality',
    ],
    commonMistakes: [
      'Not scaling before clustering',
      'Interpreting clusters as ground truth',
    ],
  },
  {
    name: 'Neural Networks',
    baseHours: 24,
    difficulty: 'Expert',
    prerequisites: ['Unsupervised Learning'],
    level: 'advanced',
    subtopics: [
      'Perceptrons and activation functions',
      'Forward and backpropagation',
      'Gradient descent variants',
      'Loss and optimization',
      'Regularization and dropout',
      'Batch normalization',
      'Hyperparameter tuning',
    ],
    learningObjective:
      'Understand and train feed-forward neural networks end to end.',
    interviewImportance: 'Critical',
    interviewConcepts: [
      'Backpropagation',
      'Vanishing/exploding gradients',
      'Activation function choice',
    ],
    commonMistakes: [
      'Poor weight initialization',
      'Wrong learning rate',
    ],
  },
  {
    name: 'Deep Learning Architectures',
    baseHours: 22,
    difficulty: 'Expert',
    prerequisites: ['Neural Networks'],
    level: 'advanced',
    subtopics: [
      'Convolutional networks',
      'Recurrent networks and LSTMs',
      'Attention and transformers',
      'Embeddings',
      'Transfer learning',
      'Generative models',
    ],
    learningObjective:
      'Select architectures suited to images, sequences, and text.',
    interviewImportance: 'High',
    interviewConcepts: [
      'Why CNNs work on images',
      'Attention mechanism',
      'Transfer learning',
    ],
    commonMistakes: [
      'Training huge models from scratch unnecessarily',
      'Ignoring data augmentation',
    ],
  },
  {
    name: 'MLOps & Deployment',
    baseHours: 14,
    difficulty: 'Hard',
    prerequisites: ['Deep Learning Architectures'],
    level: 'professional',
    subtopics: [
      'Model serialization',
      'Serving and inference APIs',
      'Monitoring and drift',
      'Experiment tracking',
      'Reproducibility',
      'Scaling inference',
    ],
    learningObjective:
      'Deploy, monitor, and maintain models in production.',
    interviewImportance: 'Medium',
    interviewConcepts: [
      'Data and concept drift',
      'Model versioning',
      'Online vs batch inference',
    ],
    commonMistakes: [
      'No monitoring for drift',
      'Non-reproducible experiments',
    ],
  },
];

export const CURRICULA: Curriculum[] = [
  {
    label: 'Web Development',
    aliases: ['web development', 'web dev', 'webdev', 'full stack', 'fullstack', 'frontend', 'front end', 'backend', 'back end'],
    destination: 'building and shipping full-stack web applications',
    topics: webDevTopics,
  },
  {
    label: 'Data Structures & Algorithms',
    aliases: ['dsa', 'data structures', 'algorithms', 'data structures and algorithms', 'data structures & algorithms', 'leetcode', 'competitive programming'],
    destination: 'solving algorithmic problems and passing technical interviews',
    topics: dsaTopics,
  },
  {
    label: 'Machine Learning',
    aliases: ['machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'data science', 'datascience'],
    destination: 'building, evaluating, and deploying ML models',
    topics: mlTopics,
  },
];

// The programming template is returned for anything that looks like a language.
export const PROGRAMMING_CURRICULUM: Curriculum = {
  label: 'Programming Language',
  aliases: [],
  destination: 'writing professional, idiomatic {lang} code',
  topics: programmingTopics,
};
