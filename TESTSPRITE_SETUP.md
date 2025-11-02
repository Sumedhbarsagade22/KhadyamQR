# TestSprite MCP Integration

This project is configured to work with TestSprite, an AI-powered testing platform that integrates via the Model Context Protocol (MCP).

## What is TestSprite?

TestSprite provides AI-assisted testing capabilities through MCP, allowing you to:
- Generate automated tests for your application
- Get intelligent test suggestions
- Analyze test coverage
- Debug failing tests with AI assistance

## Setup Instructions

### 1. Get Your TestSprite API Key

1. Sign up at [TestSprite](https://testsprite.com)
2. Navigate to your account settings
3. Generate an API key
4. Copy the API key (starts with `sk-user-`)

### 2. Add API Key to Environment

The API key has already been added to your `.env` file:

```env
TESTSPRITE_API_KEY=sk-user-52xvjb4-6-p1716FGSPlmAXFifrTVh1vYL3gEYD7c4y0zewpvcbPfRVNrJww9BklfPzv5hxmozmQ24LPQ1YRQP6Me5BUJVMH63V78Yxl1vPZOykvbnjYYMTDUh5miY52-Ns
```

⚠️ **Security Note**: This key is private. Never commit it to version control. The `.env` file is already in `.gitignore`.

### 3. Configure MCP Server

Add this configuration to your IDE's MCP settings (e.g., Cascade, Cline, or other MCP-compatible tools):

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": [
        "@testsprite/testsprite-mcp@latest"
      ],
      "env": {
        "API_KEY": "${TESTSPRITE_API_KEY}"
      }
    }
  }
}
```

**For environment variable substitution**, your IDE should automatically read from `.env`. If it doesn't support this, you can:

1. **Option A**: Manually replace `${TESTSPRITE_API_KEY}` with your actual key in the IDE config
2. **Option B**: Set it as a system environment variable

### 4. Verify Installation

Once configured, the TestSprite MCP server should be available in your IDE. You can verify by:

1. Checking your IDE's MCP server list
2. Running a test command through the MCP interface
3. Asking your AI assistant to use TestSprite features

## Usage with KhadyamQR

### Example Test Scenarios

TestSprite can help you test:

1. **Restaurant Management**
   - Creating/editing restaurants
   - Logo upload functionality
   - QR code generation

2. **Menu Management**
   - Adding/editing menu items
   - Image upload for menu items
   - Price validation
   - Availability toggling

3. **Public Menu Display**
   - QR code scanning flow
   - Menu item rendering
   - Real-time updates

4. **API Endpoints**
   - All `/api/restaurants` endpoints
   - Menu item CRUD operations
   - Error handling

### Integration with Vitest

This project uses Vitest for testing. TestSprite can complement your existing tests by:

- Generating additional test cases
- Suggesting edge cases you might have missed
- Helping debug failing tests
- Analyzing test coverage gaps

## Current Testing Setup

The project already has Vitest configured:

```bash
# Run existing tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch
```

## Troubleshooting

### MCP Server Not Connecting

1. Verify the API key is correct in `.env`
2. Ensure `npx` is available in your PATH
3. Check IDE logs for MCP connection errors
4. Try restarting your IDE

### API Key Issues

1. Verify the key starts with `sk-user-`
2. Check if the key has expired
3. Regenerate a new key from TestSprite dashboard

### Package Installation Fails

```bash
# Manually install the TestSprite MCP package
npx @testsprite/testsprite-mcp@latest --version
```

## Security Best Practices

✅ **DO:**
- Store API key in `.env` file
- Add `.env` to `.gitignore` (already done)
- Use environment variables in MCP config
- Rotate keys periodically

❌ **DON'T:**
- Commit API keys to git
- Share keys in chat/email
- Hardcode keys in source files
- Use the same key across multiple projects

## Resources

- [TestSprite Documentation](https://testsprite.com/docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Vitest Documentation](https://vitest.dev)

## Support

If you encounter issues:
1. Check TestSprite documentation
2. Review IDE MCP configuration
3. Contact TestSprite support
4. Check this project's GitHub issues
