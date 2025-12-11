# opencode-web-search

Web search plugin for [OpenCode](https://opencode.ai) with dedicated search agents.

Adds specialized search agents scoped so their tools don't pollute your primary agent's context.

## Installation

Add to your `opencode.json`:

```json
{
  "plugin": ["@joshthomas/opencode-web-search"]
}
```

## Usage

```bash
/web-search how to handle errors in TypeScript
/code-search OpenCode plugin API examples
/deep-research comprehensive analysis of MCP architecture
```

## Agents

### web-search

General research: docs, articles, best practices.

**Exa Mode Tools:**
- `web_search_exa` - Real-time web search
- `crawling` - Fetch specific URLs
- `deep_researcher_start` / `deep_researcher_check` - Comprehensive research

**Fallback Mode Tools:**
- `websearch`, `webfetch`

### code-search

Concrete code: examples, API signatures, implementations.

**Exa Mode Tools:**
- `get_code_context_exa` - Code snippets and documentation
- `crawling` - Fetch specific URLs

**Fallback Mode Tools:**
- `codesearch`, `webfetch`

## Commands

| Command | Agent | Description |
|---------|-------|-------------|
| `/web-search` | web-search | Search for docs, articles, best practices |
| `/code-search` | code-search | Find code examples and API signatures |
| `/deep-research` | web-search | Comprehensive research (Exa mode only) |

## MCP Server

When `EXA_API_KEY` is set, the plugin registers the [Exa AI MCP server](https://mcp.exa.ai):

- **Name:** `exa`
- **URL:** `https://mcp.exa.ai/mcp`
- **Tools:** Globally disabled, scoped only to the search agents

## Modes

The plugin operates in two modes based on whether `EXA_API_KEY` is set:

### Exa Mode

Full-featured with Exa AI. Set the environment variable:

```bash
export EXA_API_KEY=your_key_here
```

### Fallback Mode

Uses OpenCode's built-in `websearch`, `codesearch`, and `webfetch` tools. Requires Zen subscription or `OPENCODE_ENABLE_EXA=true`.

Note: `/deep-research` is not available in fallback mode.

A toast notification tells you which mode is active on plugin load.

## License

opencode-web-search is licensed under the MIT license. See the [`LICENSE`](../../LICENSE) file for more information.

---

opencode-web-search is not built by, or affiliated with, the OpenCode team.

OpenCode is ©2025 Anomaly.
