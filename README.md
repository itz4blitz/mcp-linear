<p align="center">
  <img src="docs/linear-app-icon.png" alt="Linear App Icon" width="220" height="220">
</p>

# MCP Linear

`mcp-linear` is a Linear-focused Model Context Protocol server built for real project-management workflows, not just basic issue CRUD.

This version goes well beyond the earlier baseline by adding:

- a much broader Linear tool surface
- MCP-native resources and prompts
- PM-oriented read paths for projects, cycles, milestones, docs, and saved views
- document management and project update workflows
- custom field, template, notification, session, audit, and integration reads
- server observability and rate-limit visibility
- stronger validation with an official MCP SDK smoke test

## Why this version exists

The original baseline was useful, but too narrow for the way real teams use Linear with AI agents.

This version is designed for workflows like:

- planning a project from issues, milestones, cycles, docs, and saved views
- drafting project updates from live Linear state
- managing templates, custom fields, favorites, and PM read models
- reading notifications, subscriptions, sessions, and audits without leaving MCP
- running read-heavy multi-project planning sessions without constantly tripping over brittle wrapper behavior

In short: this is intended to be a **practical Linear operations server** for AI assistants, not just a thin GraphQL wrapper.

## What this version adds

### Broader tool coverage

Compared to the earlier baseline, this version now includes support for:

- milestones, roadmaps, initiatives, project updates, and project members
- saved views and favorite mutations
- Linear documents and document history
- PM-oriented project issue and cycle issue queries
- comment updates/deletes
- cycle CRUD and cycle stats
- workflow state creation/update
- team settings, memberships, labels, and membership management
- issue templates and create-from-template flows
- webhooks and attachments
- notifications, subscriptions, and unread helpers
- authentication session reads and logout helpers
- organization and user audit reads
- integration listing

See [`TOOLS.md`](./TOOLS.md) for the full inventory.

### MCP-native features

This server is not tools-only anymore.

It now exposes:

#### MCP Resources

Read-only resources for high-value context, including:

- `linear://viewer`
- `linear://organization`
- `linear://teams`
- `linear://projects`
- `linear://project/{id}`
- `linear://project/{id}/issues?...`
- `linear://project/{id}/documents?...`
- `linear://issue/{id}`
- `linear://document/{id}`
- `linear://roadmap/{id}`
- `linear://milestone/{id}`
- `linear://rate-limit`

#### MCP Prompts

Reusable PM-oriented prompts, including:

- `summarize-project-status`
- `draft-project-update`
- `triage-issue`
- `summarize-document`

These make the server feel like a real MCP-native integration instead of a tools-only wrapper.

### Better operational behavior

This version also improves the server itself:

- central Linear API rate-limit tracking and retry/cooldown handling
- explicit `linear_getRateLimitStatus` and `linear_getServerStatus` tools
- stdio safety hardening for the MCP runtime
- runtime diagnostics for uncaught exceptions and disconnect debugging
- narrower custom GraphQL queries where SDK-generated queries were stale or too chatty

## High-value use cases

Once connected, this server works well for prompts like:

- "Show me the current status of this Linear project, including issues, docs, and milestones."
- "Draft a weekly project update for OrdelloTS."
- "Show all open issues in this project grouped by milestone and cycle."
- "Find the newest documents related to Premier and summarize the key decisions."
- "Show notifications and unread subscription context for current work."
- "Inspect rate-limit/server health before running a big planning session."

## Installation

### Clone and build

```bash
git clone https://github.com/itz4blitz/mcp-linear.git
cd mcp-linear
npm install
npm run build
```

### Optional: link the CLI locally

```bash
npm link
```

This makes the `mcp-linear` command available globally from your local checkout.

## Running the server

### With an explicit token

```bash
mcp-linear --token YOUR_LINEAR_API_TOKEN
```

### With an environment variable

```bash
export LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
mcp-linear
```

### Directly from the built output

```bash
node dist/index.js --token YOUR_LINEAR_API_TOKEN
```

## MCP client configuration

If you linked the CLI locally, use a config like:

```json
{
  "mcpServers": {
    "linear": {
      "command": "mcp-linear",
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

If you prefer running directly from the repository build, point your client at `dist/index.js`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-linear/dist/index.js"
      ],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

Common config locations:

- Cursor: `~/.cursor/mcp.json`
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude VSCode Extension: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- GoMCP: `~/.config/gomcp/config.yaml`

## Validation and quality bar

The default validation path is:

```bash
npm test
npm run build
```

`npm test` includes:

- Jest unit tests
- an official MCP SDK smoke test against the built stdio server

The smoke test validates:

- tool registration
- resource registration
- prompt registration
- host-compatible MCP schema emission

This is especially important for an MCP server because many failures only show up at runtime or during tool/resource registration.

## Development

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for local development details.

The repo is organized around:

- `src/services/linear-service.ts` for SDK and GraphQL integration
- `src/tools/definitions/*.ts` for MCP tool contracts
- `src/tools/handlers/*.ts` for MCP handlers
- `src/tools/type-guards.ts` for runtime validation
- `src/mcp-resources.ts` and `src/mcp-prompts.ts` for MCP-native surface area

## Tool inventory

Use [`TOOLS.md`](./TOOLS.md) for the current inventory of:

- implemented tools
- MCP resources
- MCP prompts
- future roadmap items that are actually realistic for the current Linear SDK

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).
