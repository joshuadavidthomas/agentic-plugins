import type { Plugin } from "@opencode-ai/plugin";

export const WebSearchPlugin: Plugin = async ({ client, $ }) => {
  const hasExaKey = !!process.env.EXA_API_KEY;

  return {
    config: async (config) => {
      config.agent = config.agent || {};
      config.command = config.command || {};
      config.tools = config.tools || {};

      if (hasExaKey) {
        // === EXA MCP MODE ===
        // Register MCP server
        config.mcp = config.mcp || {};
        config.mcp["exa"] = {
          type: "remote",
          url: "https://mcp.exa.ai/mcp",
        };

        // web-search agent with Exa tools
        config.agent["web-search"] = {
          description: "General web research: docs, articles, best practices",
          mode: "subagent",
          permission: {
            edit: "ask",
            bash: {},
          },
          tools: {
            "exa_web_search_exa": true,
            "exa_crawling": true,
            "exa_deep_researcher_start": true,
            "exa_deep_researcher_check": true,
          },
          prompt: `You are a web research specialist helping with programming tasks.

## Your Job

Find documentation, best practices, articles, and general information. Return contextual, actionable results.

## Tools

- **web_search_exa**: Real-time web search. Use for most queries.
- **crawling**: Fetch content from specific URLs when you need the full page.
- **deep_researcher_start/deep_researcher_check**: Comprehensive research across many sources. Use when:
  - The question requires synthesizing multiple perspectives
  - A quick search won't provide sufficient depth
  - Explicitly requested via /deep-research

## Output Format

- Summarize key findings with source links
- Format code examples in fenced code blocks with language tags
- Be concise - skip preamble, get to the answer
- After tool calls, provide a brief summary of what you found`,
        };

        // code-search agent with Exa tools
        config.agent["code-search"] = {
          description: "Find concrete code examples, API signatures, implementations",
          mode: "subagent",
          permission: {
            edit: "ask",
            bash: {},
          },
          tools: {
            "exa_get_code_context_exa": true,
            "exa_crawling": true,
          },
          prompt: `You are a code context specialist helping find concrete implementations.

## Your Job

Find actual code examples, API signatures, implementation patterns, and SDK documentation. Users want specific, working code - not general advice.

## Tools

- **get_code_context_exa**: Search for code snippets, examples, and documentation from open source libraries, GitHub repos, and programming frameworks.
- **crawling**: Fetch content from specific URLs (GitHub files, documentation pages).

## Output Format

- Show actual code snippets in fenced code blocks with language tags
- Include source links to repositories/docs
- Highlight relevant API signatures and usage patterns
- Be precise and concise - users want concrete examples
- After tool calls, briefly summarize what you found and where`,
        };

        // Commands
        config.command["web-search"] = {
          description: "Search the web for information",
          template: `<user_input>
$ARGUMENTS
</user_input>

If the user input above is empty or contains only whitespace, respond with:

"A search query is required. Please try again with:

/web-search <your query>

Example: /web-search best practices for Django REST framework pagination"

Otherwise, search the web for the query. Provide a concise summary with source links.`,
          agent: "web-search",
        };

        config.command["code-search"] = {
          description: "Find code examples and implementations",
          template: `<user_input>
$ARGUMENTS
</user_input>

If the user input above is empty or contains only whitespace, respond with:

"A search query is required. Please try again with:

/code-search <what to find>

Example: /code-search React useEffect cleanup function examples"

Otherwise, find code examples and implementations. Show actual code snippets with source links.`,
          agent: "code-search",
        };

        config.command["deep-research"] = {
          description: "Comprehensive research across multiple sources",
          template: `<user_input>
$ARGUMENTS
</user_input>

If the user input above is empty or contains only whitespace, respond with:

"A research query is required. Please try again with:

/deep-research <your question>

Example: /deep-research comparison of PostgreSQL vs MongoDB for time-series data"

Otherwise, use the deep researcher tools (deep_researcher_start, then deep_researcher_check) to thoroughly research the query. Synthesize findings from multiple sources.`,
          agent: "web-search",
        };

        // Disable all Exa tools globally (they're scoped to agents above)
        config.tools["exa_*"] = false;
      } else {
        // === FALLBACK MODE (built-in OpenCode tools) ===
        // web-search agent with built-in tools
        config.agent["web-search"] = {
          description: "General web research: docs, articles, best practices",
          mode: "subagent",
          permission: {
            edit: "ask",
            bash: {},
          },
          tools: {
            websearch: true,
            webfetch: true,
          },
          prompt: `You are a web research specialist helping with programming tasks.

## Your Job

Find documentation, best practices, articles, and general information. Return contextual, actionable results.

## Tools

- **websearch**: Real-time web search. Use for most queries.
- **webfetch**: Fetch content from specific URLs when you need the full page.

## Output Format

- Summarize key findings with source links
- Format code examples in fenced code blocks with language tags
- Be concise - skip preamble, get to the answer
- After tool calls, provide a brief summary of what you found`,
        };

        // code-search agent with built-in tools
        config.agent["code-search"] = {
          description: "Find concrete code examples, API signatures, implementations",
          mode: "subagent",
          permission: {
            edit: "ask",
            bash: {},
          },
          tools: {
            codesearch: true,
            webfetch: true,
          },
          prompt: `You are a code context specialist helping find concrete implementations.

## Your Job

Find actual code examples, API signatures, implementation patterns, and SDK documentation. Users want specific, working code - not general advice.

## Tools

- **codesearch**: Search for code snippets, examples, and documentation from open source libraries, GitHub repos, and programming frameworks.
- **webfetch**: Fetch content from specific URLs (GitHub files, documentation pages).

## Output Format

- Show actual code snippets in fenced code blocks with language tags
- Include source links to repositories/docs
- Highlight relevant API signatures and usage patterns
- Be precise and concise - users want concrete examples
- After tool calls, briefly summarize what you found and where`,
        };

        // Commands (no deep-research in fallback mode)
        config.command["web-search"] = {
          description: "Search the web for information",
          template: `<user_input>
$ARGUMENTS
</user_input>

If the user input above is empty or contains only whitespace, respond with:

"A search query is required. Please try again with:

/web-search <your query>

Example: /web-search Next.js server components best practices"

Otherwise, search the web for the query. Provide a concise summary with source links.`,
          agent: "web-search",
        };

        config.command["code-search"] = {
          description: "Find code examples and implementations",
          template: `<user_input>
$ARGUMENTS
</user_input>

If the user input above is empty or contains only whitespace, respond with:

"A search query is required. Please try again with:

/code-search <what to find>

Example: /code-search Python asyncio gather vs wait usage"

Otherwise, find code examples and implementations. Show actual code snippets with source links.`,
          agent: "code-search",
        };
      }
    },
  };
};
