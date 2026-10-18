# Reflection

The most difficult concept in the course was concurrency: understanding why two requests that each look correct can still produce a wrong result together. At first I thought checking "is the seat free?" and then saving the order was enough. I overcame this by drawing the timeline of two buyers step by step and seeing the gap between the check and the write. Learning about transactions, and then rewriting the check as a single conditional update, made it click: let the database decide, because it is the one place that sees every request. Trying it with two terminal windows helped me trust it.

Based on the feedback I received, I would improve my capstone's error handling and documentation. Reviewers said my API returned vague errors and that my README did not explain how to run the project. I would add clear status codes and messages, write the setup steps, and add automated tests for failure cases, not only the happy path.

Next, I want to learn how systems behave under real load: caching, message queues, and monitoring. I also plan to practise load testing with a tool such as k6, so I can compare my estimates with measurements instead of trusting arithmetic alone. After that, I want to go deeper into SQL indexes and query tuning.
