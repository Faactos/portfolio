// Project case-study content — loaded on demand when a "Details" modal is first opened
// Modal Data
var projectDetails = {
  aria: {
    title: 'Enterprise AI Chatbot "Aria" & MCP Architecture',
    subtitle: 'Associate Product Developer @ Neeyamo • May 2026 – Present',
    tech: ['Model Context Protocol (MCP)', 'Java', 'Spring Boot', 'Amazon Bedrock', 'Angular', 'MySQL', 'REST APIs'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          At <strong>Neeyamo</strong>, I contribute to the core engineering of <strong>Aria</strong>, an AI-driven enterprise chatbot system built to automate enterprise employee workflows, HR inquiries, and backend task orchestrations.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Key Responsibilities & Engineering Milestones:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>MCP Server Engineering:</strong> Designed and implemented custom <em>Model Context Protocol (MCP)</em> servers and tools in Java & Spring Boot, providing structured tool interfaces so AI models can securely interact with enterprise microservices.</li>
          <li><strong>Amazon Bedrock Foundation Models:</strong> Integrated foundation models with enterprise chatbot pipelines, giving the system the ability to trigger real-time backend API invocations with strict access controls.</li>
          <li><strong>End-to-End Full Stack Integration:</strong> Developed responsive Angular frontend components with interactive confirmation mechanisms and leave management workflows, coupled with Spring Boot and MySQL database transactions.</li>
          <li><strong>Secure REST APIs:</strong> Built robust REST APIs facilitating bi-directional communication between AI agent runtime environments and core enterprise services.</li>
        </ul>
      </div>
    `
  },
  'rag-assistant': {
    title: 'Enterprise RAG Assistant (Document Grounded QA & Evals)',
    subtitle: 'Production RAG System • Zero-Hallucination Gates • 24-Sweep Empirical Benchmark',
    tech: ['FastAPI', 'Qdrant (Vector DB)', 'BAAI bge-small', 'BM25 Lexical', 'bge-reranker-base', 'Streamlit', 'Docker', 'Pytest', 'Python'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          A production-grade, document-grounded question answering engine designed for enterprise compliance and high-precision document interrogation. Employs a hybrid retrieval architecture backed by strict mathematical and linguistic anti-hallucination gates.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Key Engineering Highlights:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>Hybrid Retrieval & Reciprocal Rank Fusion (RRF):</strong> Combines BM25 lexical keyword scoring with BAAI <code>bge-small-en-v1.5</code> dense embeddings in Qdrant, mitigating failure modes where semantic search misses exact product codes or keywords.</li>
          <li><strong>Cross-Encoder Reranking:</strong> Refines top candidate pools through <code>BAAI/bge-reranker-base</code> cross-encoder scoring prior to LLM context construction.</li>
          <li><strong>Triple Anti-Hallucination Gates:</strong>
            <ul class="list-disc list-inside pl-4 mt-1 space-y-1 text-neutral-400">
              <li><strong class="text-neutral-300">Score Floor:</strong> Explicitly refuses to generate an answer if top-ranked passage relevance falls below <code>MIN_SCORE</code> threshold.</li>
              <li><strong class="text-neutral-300">Mandatory Citations:</strong> Enforces traceable <code>[n]</code> page-level citation markers; un-cited answers are automatically converted into refusals.</li>
              <li><strong class="text-neutral-300">Marker Validation:</strong> Strips phantom citation indices outside retrieved context ranges.</li>
            </ul>
          </li>
          <li><strong>Automated 24-Configuration Empirical Evaluation:</strong> Built an automated evaluation sweep framework testing 24 retrieval permutations (chunk size 256/512/1024, hybrid on/off, rerank on/off) tracking Recall@k, Precision@k, nDCG, MRR, groundedness, refusal accuracy, and p50 latency on gold test sets.</li>
          <li><strong>Data-Layer Access Control:</strong> Enforces document access lists (ACLs) directly at the retrieval/vector database layer rather than brittle route-level filters.</li>
          <li><strong>Production Serving & Stack:</strong> Deployed via FastAPI REST endpoints, Streamlit visual UI, SQLite metadata store, and Docker Compose orchestration with 100% offline Pytest test suites.</li>
        </ul>
      </div>
    `
  },
  'smart-nav': {
    title: 'Smart Indoor Navigation & Heatmap System',
    subtitle: 'Funded Research Project • Awarded ₹18,000 CSRC Funding • Top 20 of 100+',
    tech: ['YOLO Object Detection', 'A* Algorithm', 'Computer Vision', 'Edge AI', 'Voice Assistance', 'Python'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          Navigating complex, crowded indoor environments like railway junctions and transit terminals poses major challenges for commuters and visually impaired individuals. This system provides real-time pathfinding, obstacle avoidance, and congestion mitigation.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Key Achievements & Technical Details:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>CSRC Funding Award:</strong> Selected among the <strong>Top 20 of 100+ competing engineering projects</strong> and awarded <strong>₹18,000 CSRC funding</strong>.</li>
          <li><strong>Computer Vision & Pathfinding:</strong> Trained and deployed a YOLO object detection pipeline on edge devices for real-time corridor landmark recognition, integrated with an A* algorithm for optimal indoor shortest-path calculation.</li>
          <li><strong>Crowd Heatmap & Voice Guidance:</strong> Generated real-time spatial heatmaps to route passengers away from bottlenecks while delivering turn-by-turn voice prompts.</li>
        </ul>
      </div>
    `
  },
  'ai-didi': {
    title: 'AI-DIDI: Indian Sign Language (ISL) Translation',
    subtitle: 'AI Research Intern @ SSN College of Engineering • May 2025 – Jul 2025',
    tech: ['Natural Language Processing (NLP)', 'spaCy', 'Deep Learning', 'Unreal Engine', 'Blender', 'Move AI'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          <strong>AI-DIDI</strong> is an assistive AI system designed to bridge communication barriers for the deaf community in India by translating spoken/written language into accurate Indian Sign Language gestures demonstrated by an interactive 3D avatar.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Validation & Implementation:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>Field-Tested with 30+ Deaf Students:</strong> Validated in physical user testing sessions with 30+ deaf students, achieving an outstanding <strong>&gt;90% comprehension accuracy</strong>.</li>
          <li><strong>NLP Linguistic Pipeline:</strong> Engineered grammar transformation and token parsing using spaCy and deep learning models to convert English/regional text into ISL syntactic structures.</li>
          <li><strong>3D Motion Capture & Synthesis:</strong> Preprocessed motion capture datasets using Move AI, modeled avatars in Blender, and rendered high-fidelity real-time gesture animations in Unreal Engine.</li>
        </ul>
      </div>
    `
  },
  handwritten: {
    title: 'AI Handwritten Answer Evaluation System',
    subtitle: 'Automated Grading Pipeline using OCR, NLP & LLMs',
    tech: ['Optical Character Recognition (OCR)', 'NLP', 'LLM APIs', 'Semantic Similarity', 'Python'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          An automated answer grading pipeline built to relieve educators from repetitive manual evaluation while providing transparent, rubric-aligned feedback to students.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Core Pipeline:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>OCR Text Extraction:</strong> Transcribes handwritten answer sheets into clean text tokens.</li>
          <li><strong>Semantic Similarity Matching:</strong> Evaluates conceptual alignment against model answers using vector embeddings and cosine similarity rather than brittle keyword matching.</li>
          <li><strong>LLM Grammar & Feedback Synthesis:</strong> Employs LLM APIs to score clarity, relevance, and grammar while automatically generating personalized constructive feedback for students.</li>
        </ul>
      </div>
    `
  },
  maitsys: {
    title: 'SAP ABAP & Artificial Intelligence Internship',
    subtitle: 'Maitsys, Madurai • Jan 2026 – Apr 2026',
    tech: ['Qwen Model Family', 'RAG Pipelines', 'Vector Embeddings', 'Model Fine-Tuning', 'SAP ABAP', 'OData Services'],
    content: `
      <div class="space-y-4 text-neutral-300 text-sm leading-relaxed">
        <p>
          Explored the convergence of enterprise ERP architectures and cutting-edge open-weights AI model families at <strong>Maitsys</strong>.
        </p>

        <h4 class="text-white font-bold text-base mt-4">Key Work:</h4>
        <ul class="list-disc list-inside space-y-2 text-neutral-300">
          <li><strong>LLM / SLM Research & Qwen:</strong> Conducted practical experimentation with the <em>Qwen</em> model family (small language models and vision-language models), evaluating performance on domain-specific enterprise prompts.</li>
          <li><strong>RAG Pipeline Development:</strong> Built end-to-end Retrieval-Augmented Generation workflows consisting of document chunking strategies, dense vector embeddings, and semantic similarity search.</li>
          <li><strong>SAP ABAP Backend:</strong> Implemented OData services, custom database tables, and CRUD operations to connect SAP enterprise data with external applications.</li>
        </ul>
      </div>
    `
  }
};

