<p align="center">
  <img src="docs/linear-app-icon.png" alt="Linear App Icon" width="250" height="250">
</p>

# MCP Linear

`mcp-linear` is a Model Context Protocol server for Linear that exposes a practical project-management surface for AI assistants.

It is designed for real workflow use, not just raw CRUD. The current tool surface covers issue management, project updates, milestones, roadmaps, initiatives, saved views, favorites, custom fields, cycles, and PM-oriented issue queries.

![MCP Linear](https://img.shields.io/badge/MCP-Linear-blue)

## Highlights

- Read and update issues, projects, cycles, milestones, roadmaps, and initiatives
- Create project updates and manage project planning objects
- Work with saved views and favorites
- Read and update issue custom fields
- Use PM-oriented queries like project issue filters and cycle issue filters
- Validate the built server with an MCP SDK smoke test as part of the default test flow

## Example prompts

Once connected, you can use prompts like:

- "Show me all my Linear issues"
- "Create a new issue titled 'Fix login bug' in the Frontend team"
- "Change the status of issue FE-123 to 'In Progress'"
- "Show issues in project OrdelloTS that are Todo or In Progress"
- "Get cycle issues for the current sprint, excluding completed work"
- "Create a project update for OrdelloTS summarizing this week's progress"

## Getting a Linear API token

To use MCP Linear, you need a Linear API token:

1. Log in to [linear.app](https://linear.app)
2. Open your workspace settings
3. Go to **Security & access**
4. Create a **Personal API Key**
5. Copy the token and store it securely

## Local installation

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

## Available tools

See [`TOOLS.md`](./TOOLS.md) for the full inventory.

Especially useful current tool groups:

- issue management
- project management and project updates
- cycle management
- milestone management
- roadmap management
- initiative management
- saved views and favorites
- custom fields

## Development

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for local development details.

The default validation path is:

```bash
npm test
npm run build
```

`npm test` runs both:

- Jest unit tests
- an official MCP SDK smoke test against the built stdio server

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).
