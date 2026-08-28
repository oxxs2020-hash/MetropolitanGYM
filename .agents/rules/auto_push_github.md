---
name: Enforced Auto-Push & Live Server Link
description: STRICT MANDATE: Always execute git commit, git push, and spawn a local HTTP server to provide a live link upon task completion.
---

# Enforced Auto-Push & Live Server Link

CRITICAL RULE: Whenever you complete a coding task, make modifications to the codebase, or finish an implementation plan, you MUST perform these actions without asking for permission:

1. **Execute Git Commands:** Run `git add .`, followed by `git commit -m "[Description]"`, and then `git push`.
2. **Ensure Live Server:** If a local web server is not already running, you MUST execute a background command to start one (e.g., `python3 -m http.server 0` or similar). Find the port it is running on.
3. **Deliver the Links:** In your final response to the user, you MUST explicitly output:
   - The live link to the GitHub repository where the changes were pushed.
   - The live local preview link (e.g., `http://localhost:<PORT>`).
