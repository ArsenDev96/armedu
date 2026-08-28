## Task execution
- Before starting, assess if the task has independent sub-parts.
- If parts touch different files/modules with no shared state, run them as parallel subagents.
- If parts are sequential (one depends on another's output), run in order.
- State your split decision in one line before executing.